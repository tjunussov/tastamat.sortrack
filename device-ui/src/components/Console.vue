<template lang="pug">
b-row.flex-xl-nowrap2
  .pl-md-5.bd-content.col-12
    h2.mb-2(@click="$ledoff") Сортировка

    b-card-group.polkas(deck)
      b-card(
        v-for="(value,i) in settings.destinations"
         :key="i"
         :class="{'closed':value == isClosedBag}"
         :bg-variant="toIndex == value?'danger':''"
         :text-variant="toIndex == value?'white':''"
         no-body
         @click="showBag(i,value)"
         align="center")
        b-card-header {{(value?''+value:'Пусто')}}
          b-btn.close(v-if="bagCounts[i]" @click.stop="closeBag(value)") &times;
        b-card-body
          h4.card-title {{(i+1)}}
          
        .stat(v-if="bagCounts[i]") {{bagCounts[i]}}

    hr/

    //- code {{bagBarcodes}}
    //- code {{bagCounts}}

    b-card(no-body :bg-variant="response&&response.error?'danger':''" :text-variant="response&&response.error?'white':''")
      b-card-header(@click="demobarcode()") Поиск ШПИ 
        b {{barcode}} 
        b-btn.close(@click.stop="putToBag(barcode)")  &times;
        b-progress(v-if="status=='search'" :value="100" :max="100" striped animated)
      b-card-body(v-if="response")
        p(v-if="response.error") {{response.error}}
        template(v-else)
          h4.card-title {{toIndex}} положить в полку {{toLed}}
          p Следующий пункт : {{response.next.dep_name}}
          blockquote.blockquote-footer {{response.delivery.dep_name}} - {{response.delivery.address}}

          //- code.mt-2(v-if="response" :inner-html.prop="response | json2html('json')")

  b-modal(ref="myModalRef" @close="showBagInfo = null" @ok="closeBag(showBagInfo.toIndex)" no-fade header-bg-variant="primary" header-text-variant="white" ok-title="Закрыть мешок" cancel-title="Отмена")
    template(slot="modal-title" v-if="showBagInfo !== null")
      | Полка {{showBagInfo.leds}} - {{bagCounts[showBagInfo.leds]}} шт - Индекс {{showBagInfo.toIndex}}
    template(v-if="showBagInfo !== null")
      h4 ШПИ 
      table.table.b-table.mt-4
        tr(v-for="(v,k) in bagBarcodesInsideBag(showBagInfo.toIndex)")
          td {{v}}
    
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

import {$smartsort,$http,deviceLEDMixin} from '@/store/api/http'

export default {
  name: 'Console',
  mounted(){
    this.$bus.$on('keyboard:keydown:enter:13',this.putToBag);
    this.$bus.$on('keyboard:keydown:enter:d',this.closeBag);
    this.$bus.$on('keyboard:keydown:enter:p',this.closeBag);
    this.$ledoff();

    // Filling with arrays
    
  },
  created(){
    this.bagCounts = [...new Array(this.settings.destinations.length)].map(x => 0);
  },
  beforeDestroy(){
    this.$ledoff();
    this.$bus.$off('keyboard:keydown:enter:13',this.putToBag);
    this.$bus.$off('keyboard:keydown:enter:d',this.closeBag);
    this.$bus.$off('keyboard:keydown:enter:p',this.closeBag);
  },
  computed:{
    ...mapGetters({
        settings: 'getSettingsSelected',
    }),
    demo(){
      return this.$root.demo;
    }
  },
  data () {
    return {
      status:null,
      formInput:null,
      tmResponse:null,
      response:null,
      barcode:null,
      toIndex:null,
      isClosedBag:null,
      toLed:null,
      user:'r',
      showBagInfo:null,
      bagCounts:[],
      bagBarcodes:{},
    }
  },
  mixins:[deviceLEDMixin],
  watch:{
    response(val){
      if(val){
        window.clearTimeout(this.tmResponse);
        this.tmResponse = window.setTimeout(this.clear,10000);  
      }
    },
    isClosedBag(val){
      if(val) window.setTimeout(()=>{this.isClosedBag = null},5000); 
    }
  },
  methods:{
    ...mapActions([
      'settingsUpdate',
    ]),
    putToBag(wpi){

      
      this.barcode = wpi.toUpperCase()
      this.clear();


      // if already in list
      if(this.bagBarcodes[this.barcode]){
        this.status = 'pull';
        console.log('pullFromBag barcode',this.barcode);

        this.toIndex = this.bagBarcodes[this.barcode];
        this.toLed = this._getLeds(this.toIndex);

        for(var l of this.toLed){
          Vue.set(this.bagCounts,l,this.bagCounts[l]-1)
        }

        this.$pull(this.user,this.toLed.toString())
        Vue.delete(this.bagBarcodes,this.barcode);

        return;
      }

      console.log('putToBag barcode',this.barcode);

      this.status = 'search';
      this.$search();

      //$http.get(this.barcode).then((resp)=>{
        $smartsort.putToBag(this.barcode).then((resp)=>{
        this.response = resp.data
        
        // demo
        if(this.demo){
          if(Math.random()*10 < 9){
            this.response.next.bagNo = 'L'+Math.floor(Math.random()*this.settings.maxLeds)
            this.response.next.toIndex = '0000'+Math.floor(Math.random()*this.settings.maxLeds)
            console.log('demo',this.settings.maxLeds);
          } else {
            this.response.next.bagNo = 'S'
            this.response.next.toIndex = '00099'
          }
        }

        if(this.response.next  !== null && this.response.next.bagNo !== null ){

         this.toIndex = this.response.next.toIndex;
         this.toLed = this._getLeds(this.toIndex);

          if(this.toLed.length > 0 ){
            this.$push(this.user,this.toLed.toString())
            Vue.set(this.bagBarcodes,this.barcode,this.toIndex)

            console.log('bagBarcodes',this.bagBarcodes);
            this.status = 'found';

            for(var l of this.toLed){
              Vue.set(this.bagCounts,l,this.bagCounts[l]+1)
            }

          } else {

            this.status = 'notbind';
            console.error("Полки не настроены!");
            this.response = { error:`Направление ${this.toIndex} не привязано к мешку ` }
            this.$notBind();
          }
        } else {

          this.status = 'notfoundnextplan';
          console.error("Нет плана!");
          this.response = { error:`Отправление ${this.barcode} не привязано к плану ` }
          this.$notPlan();
        }
      }).catch((error)=>{

        this.status = 'notfound';
        console.error('ШПИ не найден',error.response.data);
        this.response = error.response?error.response.data:{"error":"catch"}
        this.$notFound();
      });
    },
    _getLeds(toIndex){
          return this.settings.destinations.reduce((a, e, i)=>{
            if (e === toIndex) a.push(i); return a;
          }, []);
    },
    bagBarcodesInsideBag(toIndex){
      console.log('bagBarcodesInsideBag',toIndex);
      return Object.entries(this.bagBarcodes).reduce((a, e, i)=>{
        // console.log(a,e,i);
        if (e[1] === toIndex) a.push(e[0]); return a;
      }, []);
    },
    showBag(leds,toIndex){
      console.log('showBag',leds,toIndex,this.bagBarcodes);
      this.showBagInfo = {leds,toIndex}
      this.$refs.myModalRef.show()
    },
    closeBag(toIndex){

      this.toIndex = toIndex
      this.toLed = this._getLeds(this.toIndex);

      var data = {bag:toIndex,count:this.bagCounts[this.toLed[0]]};

      $smartsort.closeBag(data).then((resp)=>{
        console.log('closeBag', this.toLed,toIndex);
        this.isClosedBag = toIndex
        this.$closeBag( this.toLed.toString())
        this.$printBag(data.count);

        this.bagBarcodes = Object.entries(this.bagBarcodes).reduce((a, e, i)=>{
          console.log();
          if (e[1] !== toIndex) a[e[0]]=e[1]; return a;
        }, {});        

        for(var l of this.toLed){
          Vue.set(this.bagCounts,l,0)
        }

      }).catch((error)=>{
        console.log('error',error);
        this.response = error.response?error.response.data:{"error":"catch"}
        this.$error();
      });
    },
    demobarcode(){
          if(Math.random()*10 < 9)
            this.$bus.$emit('keyboard:keydown:enter:13','KZ'+Math.floor(Math.random()*1000000000)+'KZ');
          else 
            this.$bus.$emit('keyboard:keydown:enter:13','KZ111111111KZ');
    },
    clear(){
      this.response = null;
      this.toIndex = null;
      this.toLed = null;
      this.status = null;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
h1, h2
    font-weight normal

ul
    list-style-type none
    padding 0

li
    display inline-block
    margin 0 10px

a
    color #42b983
    
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
