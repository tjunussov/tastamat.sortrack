<template lang="pug">
b-modal#mclosebag(no-enforce-focus size="lg" no-fade @hide="clear" visible ref="closeModalRef")
    template(slot="modal-header" v-if="meta && meta.next.bag") 
      b-link.close(@click.stop="clear")  &times;
      h3 Мешок {{meta.next.bagNo}} - {{meta.next.bag.barcode}} - {{selectedBag.index}}
      .meta
        small {{meta.next.bag.created}} {{meta.next.bag.user}}
        small.pull-right.ml-2 BID : {{meta.next.bag.bid}} DEPID : {{meta.next.bag.bdepid}}
    template(slot="modal-header" v-else)
       h2.modal-title.text-primary Мешок {{selected}} - {{selectedBag.index}}

    b-card(no-body)
      b-tabs.nav-justified.wizard(pills card v-model="tabIndex")
        b-tab
          template(slot="title") 
            span(v-b-toggle="'settings_collapse'") Содержимое 
            span(v-if="meta") {{meta.addDetailPREGMAIL.mlcntq}} шт

          table.table.b-table
            tr
              th #
              th ШПИ
              th КУДА Индекс 
              th DEPID / Кол-во / Вес

            tr(v-for="(v,k) in selectedBag.wpi")
              td: i.fa-icon.fa-star/
              td(:title="JSON.stringify(v)") {{k}}
              //- td {{v.next.bagNo}}
              td {{v.toIndex}}
              td {{v.p_depcode}} | {{v.addDetailPREGMAIL.mlcntq}} | {{v.addDetailPREGMAIL.wghtv}}
        b-tab(title="Вес и Вид")
          b-form-group(label="Итоговый Вес" horizontal)
            b-input-group
              b-form-input(v-model="weight" type="number" size="lg" required palceholder="Вес")
              b-input-group-append
                b-btn(@click="weight = 2.5" variant="white") Считать вес
          b-form-group(label="Вид отправки" horizontal)
            b-btn(@click="sendmeth = 2" v-if="sendmeth == 1") Наземный
            b-btn(variant="primary" @click="sendmeth = 1" v-else) Авия

        b-tab(title="Ярлык" :disabled="!(response && response.cli_info)")
          code.text-primary(v-if="response && response.cli_info")
            .mx-4
              //- code {{response.cli_info}}
              code#bagPrintData.hide
                | N
                | q720
                | j555
                | l8,C,001
                | X0,40,4,710,640
                | 
                | A20,60,0,5,1,1,N,"{{response.cli_info.BAGTYPE_NAME}}"
                | A20,120,0,4,1,1,N,"KYDA"
                | A300,120,0,4,1,1,N,"{{response.cli_info.TO_DEP_NAME}}"
                | 

                | A20,150,0,4,1,1,N,"OT"
                | A300,150,0,4,1,1,N,"{{response.cli_info.FR_DEP_NAME}}"
                | 
                | A20,180,0,4,1,1,N,"BEC {{response.cli_info.WGT_KG}}"
                | A300,180,0,4,1,1,N,"{{response.cli_info.WGT_GR}} gr"
                | 
                | A20,210,0,4,1,1,N,""
                | 
                | B20,240,0,1,2,2,100,B,"{{response.cli_info.BARCODE}}"
                | 
                | A20,480,0,4,1,1,N,"COTPYDHNK"
                | A300,480,0,4,1,1,N,"{{response.closeBag.p_cpilslogin}}"
                | A380,480,0,4,1,1,N,"_______________"
                | 
                | A20,510,0,1,1,1,N,"© 2018 Powered by SORTRACK®, KAZPOST INC"
                | P1
                | N

              div
                b ШТРИХКОД 
                span {{response.cli_info.BARCODE}}
              div 
                b МЕТОД 
                span {{response.cli_info.SNDMETH_NAME}}
              div 
                b ТИП 
                span {{response.cli_info.BAGTYPE_NAME}}
              div 
                b ОТ 
                span {{response.cli_info.FR_DEP_NAME}}
              div 
                b КУДА 
                span {{response.cli_info.TO_DEP_NAME}}
              div 
                b ВЕС 
                span {{response.cli_info.WGT_KG}} 
                span {{response.cli_info.WGT_GR}}
              div 
                b ОПЕРАТОР 
                span {{response.closeBag.p_cpilslogin}}
              div 
                b ИНДЕКС ОПЕРАТОРА 
                span {{response.closeBag.bag.todepindex}}
          code.text-danger(v-if="response && response.error")  {{response}}
          .text-center(v-if="tabIndex == 2 && response")
            b-btn(variant="primary" @click="print") Печать

    b-collapse(is-nav id="settings_collapse" v-if="selectedBag")
      b-form.my-3
        b-form-group(horizontal label="LED")
          b-form-input(v-model="selectedBag.led")
        b-form-group(horizontal)
          b-btn(@click="$saveConfig") Save

    template(slot="modal-footer")
      b-link(@click="$bus.$emit('keyboard:keydown:enter:p',selected)" size="sm") Scan Selected | 
      b-link(@click="$bus.$emit('keyboard:keydown:enter:p',Object.keys(bags)[1])" size="sm") Scan Bag 2
      b-btn(variant="primary" v-if="tabIndex == 1 && !response" @click="closeBag") Закрыть мешок
      
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import {$leds} from '@/store/api/http'
import cyr from 'cyrillic-to-translit-js'




export default {
  name: 'CloseModal',
  props: ['isCloseModalOpen'],
  mounted(){
    this.$bus.$on('keyboard:keydown:enter:p',this.next);
  },
  beforeDestroy(){
    this.$bus.$off('keyboard:keydown:enter:p',this.next);
  },
  computed:{
    ...mapGetters({
        response: 'getCloseResponse',
        selected:'getSelected',
        selectedBag:'getSelectedBag',
        meta: 'bagMetaData',
        bags: 'getBags',
    })
  },
  data () {
    return {
      tabIndex:0,
      weight:0,
      sendmeth:1
    }
  },
  methods:{
    ...mapActions([
      '$closeBag',
      '$clear',
      '$deselectBag',
      '$saveConfig'
    ]),
    closeBag(){
      this.$closeBag({
        bagno:this.selected,
        weight:this.weight,
        depcode:this.selectedBag.index,
        sendmeth:this.sendmeth}).then(()=>{
          this.tabIndex = 2
          this.print();
        });
    },
    next(bagno){

      if(bagno == this.selected && this.meta ){
        if(this.tabIndex == 0){
          this.tabIndex = 1
        } else if(this.tabIndex == 1){
          this.closeBag();
        } else if(this.tabIndex == 2){
          this.clear();
        }
      } else {
        this.clear();
      }
    },
    clear(){
      this.$deselectBag();
      this.$emit('close');
    },
    print(){
      var text = document.getElementById('bagPrintData').innerText;
      text = cyr().transform(text);
      text = text.replace('қ','k')
      $leds.printbag(text);
    },
    printTest(){
      $leds.printbagTest();
      this.clear();
    }
  }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

.wizard 
  .nav-pills .nav-link, .nav-pills > .nav-link
    border 1px solid transparent
    
  .nav-pills .nav-link.active, .nav-pills .show > .nav-link
    background-color #fff !important
    border-color #ddd
    color #007bff
    
.content * 
  display block
  

.hide
  display none
</style>
