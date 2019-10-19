<template lang="pug">
b-row.flex-xl-nowrap2
  .pl-md-5.bd-content.col-12
    h2.mb-2 Сортировка TEST 
      b-btn(v-b-modal="msortplan") Сортплан

    b-card-group.polkas(deck)
      b-card(no-body align="center"
        v-for="(bag,no) in bags"
        :key="no" 
        :class="{'text-muted':!Object.keys(bag)[0]}"
        v-b-modal="'mclosebag'" 
        @click="close.bag = bag; close.bagno = no" )
        b-card-header {{(no)}}
          span(v-if="Object.keys(bag)[0]") ({{(bag[Object.keys(bag)[0]].addDetailPREGMAIL.mlcntq)}})
          b-btn.close &times;
        b-card-body
          h4.card-title {{Object.keys(bag).length}}

    hr/

    b-card(no-body :bg-variant="response&&response.error?'danger':''" :text-variant="response&&response.error?'white':''")
      b-card-header ШПИ 
        b {{barcode}} 
        b-progress(v-if="status=='search'" :value="100" :max="100" striped animated)
      b-card-body(v-if="response")
        p(v-if="response.error") {{response.error}}
        template(v-else)
          h4.card-title Индекс посылки {{response.toIndex}} положить в мешок {{response.next.bagNo}}
          p Кол-вл : {{response.addDetailPREGMAIL.mlcntq}} Вес: {{response.addDetailPREGMAIL.wghtv}}
          blockquote.blockquote-footer {{response}}

  b-modal#mclosebag(size="lg" title="Мешок" ref="myModalRef")
    template(slot="modal-header" v-if="bagMetaData && bagMetaData.next.bag") 
      h2.modal-title(v-if="bagMetaData.next.bag") Мешок {{bagMetaData.next.bagNo}} - {{bagMetaData.next.bag.barcode}} - {{bagMetaData.addDetailPREGMAIL.mlcntq}}
      .meta
        small {{bagMetaData.next.bag.created}} {{bagMetaData.next.bag.user}}
        small.pull-right.ml-2 BID : {{bagMetaData.next.bag.bid}} DEPID : {{bagMetaData.next.bag.bdepid}}
    b-form-group(label="Итоговый Вес" horizontal)
      b-form-input(v-model="close.weight" required palceholder="Вес")
    b-form-group(label="Вид отправки" horizontal)
      b-form-select(v-model="close.type" required)
        option(:value="1") Наземный
        option(:value="2") Авия
      
    table.table.b-table.mt-4
      tr
        th ШПИ
        th КУДА Индекс 
        th DEPID / Кол-во / Вес

      tr(v-for="(v,k) in close.bag")
        td(:title="JSON.stringify(v)") {{k}}
        //- td {{v.next.bagNo}}
        td {{v.toIndex}}
        td {{v.p_depcode}} | {{v.addDetailPREGMAIL.mlcntq}} | {{v.addDetailPREGMAIL.wghtv}}

    hr/

    code.text-primary(v-if="close.response && close.response.cli_info")
      .mx-4 
        div
          b ШТРИХКОД 
          span {{close.response.cli_info.BARCODE}}
        div 
          b МЕТОД 
          span {{close.response.cli_info.SNDMETH_NAME}}
        div 
          b ТИП 
          span {{close.response.cli_info.BAGTYPE_NAME}}
        div 
          b ОТ 
          span {{close.response.cli_info.FR_DEP_NAME}}
        div 
          b КУДА 
          span {{close.response.cli_info.TO_DEP_NAME}}
        div 
          b ВЕС 
          span {{close.response.cli_info.WGT_KG}} 
          span {{close.response.cli_info.WGT_GR}}
        div 
          b ОПЕРАТОР 
          span {{close.response.closeBag.p_cpilslogin}}
        div 
          b ИНДЕКС ОПЕРАТОРА 
          span {{close.response.closeBag.bag.todepindex}}
    code.text-danger(v-if="close.response && close.response.error")  {{close.response}}

    template(slot="modal-footer" v-if="close.response")
      b-btn(variant="primary" @click="close.response = null; $refs.myModalRef.hide()") Ok
    template(slot="modal-footer" v-else)
      b-btn(variant="primary" @click="closeBag(close.bagno,close.weight,close.type)" :disabled="!close.bag") Закрыть мешок
      b-btn(@click="$refs.myModalRef.hide()") Отмена


  b-modal#msortplan(title="Сортплан" v-if="sortplan")
    template(slot="title") Сортплан {{sortplan.depcode}}
    b-table(:items="sortplan.plan")
        
</template>

<script>
import Vue from 'vue'
import {$smartsort} from '@/store/api/http'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Test',
  mounted(){
    this.$bus.$on('keyboard:keydown:enter:13',this.putToBag);
  },
  beforeDestroy(){
    this.$bus.$off('keyboard:keydown:enter:13',this.putToBag);
  },
  data () {
    return {
      status:null,
      tmResponse:null,
      response:null,
      closeResponse:null,
      barcode:null,
      close:{
        bagno:null,
        bag:null,
        weight:0,
        response:null,
        type:1
      },
      sortplan:null,
      bags:{}
    }
  },
  computed:{
     ...mapGetters({
        settings: 'getSettingsSelected',
    }),
    bagMetaData(){
      if(this.close.bag)
        return this.close.bag[Object.keys(this.close.bag)[0]]
    }
  },
  created(){
    this.bags = [...new Array(24)].map(x => 0);
  },
  methods:{
    timeout(tm){
      window.clearTimeout(this.tmResponse);
      this.tmResponse = window.setTimeout(this.clear,tm);
    },
    fetchSortplan(depcode){
      $smartsort.sortplan(depcode).then((resp)=>{
        this.sortplan = resp.data
      }).catch((error)=>{
        console.log('error',error);
      });

    },
    putToBag(wpi){

      this.clear();

      this.barcode = wpi.toUpperCase()
      
      console.log('putToBag barcode',this.barcode);

      this.status = 'search';

      //$http.get(this.barcode).then((resp)=>{
      $smartsort.putToBag(this.barcode,this.$root.point,this.$root.user).then((resp)=>{

        this.response = resp.data

        if(resp.data.error) {
          console.log('error')
          this.timeout(2000);
          return;
        }

        this.timeout(10000);

        var bagNo = resp.data.next.bagNo
        this.$root.depcode = resp.data.p_depcode // проставляем автоматический индекс пользователя

        this.status = 'found';
        // ложим посылку в корзину
        console.log('Ложим в корзину',bagNo);

        // VuePush(this.bags,resp.data.next.bagNo,)
        var val = {}; val[this.barcode] = resp.data;
        var currentVal = this.bags[bagNo];

        Vue.set(this.bags,bagNo,{...val,...currentVal})

      }).catch((error)=>{
        this.status = 'error';
        console.log('error',error);
      });
    },
    closeBag(bagno,weight,sendmeth){
      console.log('closeBag',bagno,weight,sendmeth);

      $smartsort.closeBag(bagno,weight,sendmeth,this.$root.point,this.$root.user).then((resp)=>{
        this.close.response = resp.data

        if(resp.data.error) {
          this.timeout(2000);
          return;
        }

        Vue.set(this.bags,this.bagNo,{})
      }).catch((error)=>{
        console.log('error',error);
        this.response = error.response?error.response.data:{"error":"catch"}
      });
    },
    clear(){
      this.barcode = null;
      this.response = null;
      this.$root.barcode = null;
      this.status = null;
      this.close.response = null;
    }
  }
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
   
.selected
  background-color #f00
  color #fff

.polkas  
  .card
    flex 0 0 auto
    width 6.6rem 
    height 6.6rem
    margin 0.2rem
    cursor pointer
    transition  background 0.2s ease-out, color 0.2s ease-out, border-color 0.5s ease-out
    
    &.closed
      -webkit-animation 0.5s blink step-end infinite
      

    &.text-muted
      opacity 0.8

    .card-body, .card-header
      padding 0.5rem
      overflow hidden
      position relative
      

    .card-header .close
      margin-top -3px
      
    .card-title
      font-size 6rem
      color #e0e0e0
      white-space nowrap
      text-align right
      margin 0
      line-height 3rem
      letter-spacing -5px
      
    .stat
      font-size 1.5rem
      white-space nowrap
      text-align left
      left 0.5rem
      margin 0
      bottom 2px
      position absolute
      z-index 1
      
    
  .card:nth-child(5),.card:nth-child(13),.card:nth-child(21)
    margin-left 4rem
    background-color #ffe
    
  .card:nth-child(4),.card:nth-child(12),.card:nth-child(20)
    background-color #ffe
  

</style>
