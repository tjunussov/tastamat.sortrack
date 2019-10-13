<template lang="pug">
b-row.flex-xl-nowrap2
  .pl-md-5.pt-2.mt-4.bd-content.col-12

    b-tabs.nav-justified.wizard(pills bottom v-model="tabIndex")
      b-tab(v-for="(pp,p) in bagsPages" :key="p")
        template(slot="title") {{p+1}} [{{p*24}}-{{(p+1)*24}}]
        b-card-group.polkas.pb-4(deck)
          b-card(no-body align="center"
            v-for="(b,i) in filteredBags(p)"
            :key="i" 
            :class="{'text-muted':!Object.keys(b)[0],'outlined':bind.unmappedIndx == i}"
            :bg-variant="selected == b.ppi?'success':''"
            :text-variant="selected == b.ppi?'white':''" 
            @click="selectBag(b.ppi)" )
            b-card-header {{(b.ppi)}}
              small.text-muted.indx(v-if="b.ppi != b.ppn") 
                //- {{(b.index)}} 
                span.led(:class="{'remapped':b.led!=null}") {{b.led?b.led:i}}
              b-btn.close(v-if="Object.keys(b.wpi).length") &times;
            b-card-body
              h4.card-title {{Object.keys(b.wpi).length}}

    
          
    b-collapse#collapse1_inner 
      code {{this.bind.unmapped}}
      hr/
      code {{bags}}

    

  .m-4.p-2.fixed-bottom
    b-card(no-body :bg-variant="error?'danger':''" :text-variant="error?'white':''")
      b-card-header ШПИ 
        b {{barcode}} 
        span(v-if="response") конечный индекс {{response.postIndex}}
        b-btn.close(@click.stop="clearAll")  &times;
        .debug.float-right.mr-3
          b-link(v-b-toggle="'collapse1_inner'") Debug [{{$root.version}}] | 
          b-link(@click="isSortplanModalOpen = true" v-b-modal="'msortplan'") Сортплан | 
          b-link(@click="wizardToggle" size="sm" v-bind:class="{'bg-primary text-white':bind.started}") {{!bind.started?'Bind Start':'Bind Stop'}}
        b-progress(v-if="status=='search'" :value="100" :max="100" striped animated)
      b-card-body
        p(v-if="error") {{error}}
        template(v-if="response")
          h4.card-title Мешок {{response.parentPostIndex}} 
          | АДРЕС : 
          b {{response.postIndexTitle}} {{response.postIndex}}
          span.text-muted.ml-5 
          | {{response.mailInfo.toFullName}} 
          | ( {{response.postIndexTitle}} {{response.postIndex}} )       
          
          //- blockquote.blockquote-footer {{response}}

  
  CloseModal(v-if="isCloseModalOpen" @close="isCloseModalOpen = false")
  SortplanModal(v-if="isSortplanModalOpen" @close="isSortplanModalOpen = false")
        
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
    cursor(val){
      if(typeof val !== 'undefined') {
        this.tabIndex = Math.floor(val/24);
        console.log('tab',val,this.tabIndex);
      }
    },
    status(val){
      if(val){

        if(this.selectedBag && this.selectedBag.led){  // if led specified
          console.log('watched status[selectedbag]',this.selectedBag.led);
          $leds.on(val,this.selectedBag.led);
        } else {
          console.debug('watched status [cursor]',this.cursor)
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
      tabIndex:0,
      tmResponse:null,
      isCloseModalOpen:false,
      isSortplanModalOpen:false,
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
    filteredBags() {
      return (page)=>{ return this.bags.slice(page*24, (page+1)*24); }
    },
    bagsPages(){
      return new Array(Math.ceil(this.bags.length/24));
    }
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
    selectBag(ppi){
      console.log('selectBag',ppi)
      if(this.isCloseModalOpen){
        // this.$root.$emit('bv::hide::modal','mclosebag')
      } else if(this.bind.started){
        console.log('Binding',ppi);
        this.wizardNext(ppi);
        // this.$selectBag({ppi}).then(()=>{
          
        // });
      } else {
        window.clearTimeout(this.tmResponse);
        this.$clear();
        this.$selectBag({ppi}).then(()=>{
          this.isCloseModalOpen = true;  
        }).catch((error)=>{
          console.log('selectBag error',error);
          this.timeout(5000);  
        });
        
      }
    },
    putToBag(barcode){
      barcode = barcode.toUpperCase().trim()
      console.log('started putToBag barcode',barcode);

      this.$putToBag({barcode:barcode}).then((resp)=>{
        this.timeout(10000);
        console.log('ended Положили в корзину',resp.parentPostIndex);
      }).catch((error)=>{
        console.log('putToBag error',error);
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

