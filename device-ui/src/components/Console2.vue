<template lang="pug">
b-row.flex-xl-nowrap2
  .pl-md-5.pt-2.mt-4.bd-content.col-12
    
    b-card-group.polkas(deck)
      b-card(no-body align="center"
        v-for="(bag,i) in bags"
        :key="i" 
        :class="{'text-muted':!Object.keys(bag)[0],'outlined':bind.unmappedIndx == i}"
        :bg-variant="selected == bag.no?'success':''"
        :text-variant="selected == bag.no?'white':''" 
        @click="selectBag(bag.no)" )
        b-card-header {{(bag.no)}}
          small.text-muted.indx(v-if="bag.no != bag.index") 
            //- {{(bag.index)}} 
            span.led(:class="{'remapped':bag.led!=null}") {{bag.led?bag.led:i}}
          b-btn.close(v-if="Object.keys(bag.wpi).length") &times;
        b-card-body
          h4.card-title {{Object.keys(bag.wpi).length}}

    
          
    b-collapse#collapse1_inner 
      code {{this.bind.unmapped}}
      hr/
      code {{bags}}

    

  .m-4.p-2.fixed-bottom
    b-card(no-body :bg-variant="error?'danger':''" :text-variant="error?'white':''")
      b-card-header ШПИ 
        b {{barcode}} 
        span(v-if="response") конечный индекс {{response.toIndex}}
        b-btn.close(@click.stop="clearAll")  &times;
        .debug.float-right.mr-3
          b-link(v-b-toggle="'collapse1_inner'") Debug 2.2 | 
          b-link(v-b-modal="'msortplan'") Сортплан | 
          b-link(@click="wizardToggle" size="sm" v-bind:class="{'bg-primary text-white':bind.started}") {{!bind.started?'Bind Start':'Bind Stop'}}
        b-progress(v-if="status=='search'" :value="100" :max="100" striped animated)
      b-card-body
        p(v-if="error") {{error}}
        template(v-if="response")
          h4.card-title Мешок {{response.next.bagNo}} 
            span(v-if="response.next.bagIndex != response.next.bagNo") - Опорный Индекс {{response.next.bagIndex}}
          | Кол-во : 
          b {{response.addDetailPREGMAIL.mlcntq}} 
          | Вес: 
          b {{response.addDetailPREGMAIL.wghtv}}
          span.text-muted.ml-5 {{response.next.bag.created}}  - 
          | {{response.next.bag.user}} 
          | ( {{response.p_depcode}} )       
          //- blockquote.blockquote-footer {{response}}

  
  CloseModal(v-if="isCloseModalOpen" @close="isCloseModalOpen = false")
  SortplanModal
        
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import {$leds,$sounds,deviceLEDMixin} from '@/store/api/http'

import SortplanModal from '@/components/SortplanModal'
import {bindMixin} from '@/components/BindModal'
import CloseModal from '@/components/CloseModal'



export default {
  name: 'Console2',
  mounted(){
    this.$bus.$on('keyboard:keydown:enter:13',this.putToBag);
    this.$bus.$on('keyboard:keydown:enter:p',this.selectBag);
  },
  beforeDestroy(){
    this.$bus.$off('keyboard:keydown:enter:13',this.putToBag);
    this.$bus.$off('keyboard:keydown:enter:p',this.selectBag);
  },
  created(){
    $leds.$ledoff();
  },
  watch:{
    status(val){
      if(val){
        console.log('sound',val);

        if(this.selectedBag && this.selectedBag.led){  // if led specified
          console.log('LED',this.selectedBag.led);
          $leds.on(val,this.selectedBag.led);
        } else {
          console.log('ZZZZZZZZZZZZZZ',this.cursor)
          if(this.cursor != null) $leds.on(val,this.cursor);
          else $leds.on(val);
        }



        $sounds.play(val);
      } /*else {
        $leds.$ledoff();
      }*/
    }
  },
  data () {
    return {
      tmResponse:null,
      isCloseModalOpen:false,
      kazakhstan:false,
      bind:{
        started:false,
        cursor:null,
        unmappedIndx:null,
        unmapped:[],
        intrvl:null
      }
    }
  },
  computed:{
     ...mapGetters({
        settings: 'getSettingsSelected',
        bags: 'getBags',
        config: 'getConfig',
        status: 'getStatus',
        barcode: 'getBarcode',
        response: 'getResponse',
        error: 'getError',
        cursor: 'cursor',
        selected: 'getSelected',
        selectedBag:'getSelectedBag'
    }),
  },
  mixins:[bindMixin],
  created(){
    if(!this.bags){
      this.$initBags()
    }
  },
  methods:{
    ...mapActions([
      '$initBags',
      '$putToBag',
      '$selectBag',
      '$deselectBag',
      '$remapSelectedBag',
      '$clear',
      '$saveConfig'
    ]),
    timeout(tm){
      window.clearTimeout(this.tmResponse);
      this.tmResponse = window.setTimeout(this.$clear,tm);
    },
    selectBag(bagno){
      console.log('selectBag',bagno)
      if(this.isCloseModalOpen){
        // this.$root.$emit('bv::hide::modal','mclosebag')
      } else if(this.bind.started){
        console.log('Binding',bagno);
        this.wizardNext(bagno);
        // this.$selectBag({bagno}).then(()=>{
          
        // });
      } else {
        window.clearTimeout(this.tmResponse);
        this.$clear();
        this.$selectBag({bagno}).then(()=>{
          this.isCloseModalOpen = true;  
        }).catch((error)=>{
          console.error('selectBag error',error);
          this.timeout(5000);  
        });
        
      }
    },
    putToBag(barcode){
      barcode = barcode.toUpperCase().trim()
      console.log('putToBag barcode',barcode);

      this.$putToBag({barcode:barcode}).then((resp)=>{
        this.timeout(10000);
        console.log('Положили в корзину',resp);
      }).catch((error)=>{
        console.error('putToBag error',error);
        this.timeout(5000);
      });

    },
    clearAll(){
      this.$clear(); 
      $leds.$ledoff();
    }
  },
  components:{
    SortplanModal,
    CloseModal
  }
}




</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
   
.selected
  background-color #f00
  color #fff

.polkas  
  // display: grid;
  // grid-column-gap: 50px;
  
  .card
    flex 0 0 auto
    width 7.1rem 
    height 7.1rem
    margin 1px
    cursor pointer
    transition  background 0.2s ease-out, color 0.2s ease-out, border-color 0.5s ease-out
    
    .text-muted
      opacity 0.5
    
    &.outlined
      outline 2px solid #f00
    
    &.closed
      -webkit-animation 0.5s blink step-end infinite

    &.text-muted
      opacity 0.2

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
      
    .led
      font-size 0.7rem
      left 0.2rem
      top -2px
      position absolute
      color #ddd
      
      &.remapped
        color #f99
    
  // .card:nth-child(5),.card:nth-child(13),.card:nth-child(21),.card:nth-child(29)
  .card:nth-child(5),.card:nth-child(8n+5)
    margin-left 2rem
    background-color #ffe
    
  .card:nth-child(4),.card:nth-child(8n+4)
    background-color #ffe
    
</style>

