<template lang="pug">
b-row.flex-xl-nowrap2
  .pl-md-3.pt-2.mt-4.bd-content.col-12
    b-tabs.nav-justified.wizard(pills v-model="tabIndex")
      b-tab(v-for="(pp,p) in bagsPages" :key="p")
        template(slot="title") Thor {{p+1}} [{{p*24}}-{{(p+1)*24}}] 
          i.fa.fa-lightbulb-o.text-danger.pull-right(v-if="ledOffline[p]")
        b-card-group.polkas.pt-4(:class="{calibrating}" deck)
          b-card(no-body align="center"
            v-for="(b,i) in filteredBags(p)"
            :key="i" 
            :class="{'text-muted':!Object.keys(b)[0],'outlined':bind.cursor == b.led || b.led == null,'isErrorBag':b.isErrorBag}"
            :bg-variant="selected == b.ppi?'danger':''"
            :text-variant="selected == b.ppi?'white':''" 
            :disabled="calibrating && b.led != null"
            @click="selectBag(b.ppi,i,p,b.isErrorBag)"
            @dblclick="calibrateSelectBag(b.ppi,i,p)" )
            b-card-header 
              template(v-if="b.isErrorBag") Корзина
              template(v-else) {{(b.ppi)}}
              small.text-muted.indx
                //- {{(b.index)}} 
                span.led(:class="{'remapped':b.led!=null}") {{b.led!==null?b.led:i}}
              b-btn.close(v-if="Object.keys(b.wpi).length") &times;
            b-card-body
              h4.card-title(:class="{'smaller':Object.keys(b.wpi).length>100}")
                template(v-if="bind.cursor != null") {{bind.cursor}} 
                template(v-else) {{Object.keys(b.wpi).length}}


  .m-4.p-2.pb-3.fixed-bottom
    b-card(no-body :bg-variant="error?'danger':''" :text-variant="error?'white':''")
      b-card-header ШПИ 
        b {{barcode}} 
        b-btn.close(@click.stop="clearAll")  &times;
        .debug.float-right.mr-3
          b-link.text-danger(v-b-modal.debug="")
            i.fa.fa-bug.mr-2
          //- b-link(@click="wizardToggle" size="sm" v-bind:class="{'bg-primary text-white':bind.started}") {{!bind.started?'Bind Start':'Bind Stop'}}
        b-progress(v-if="status=='search'" :value="100" :max="100" striped animated)
      b-card-body
        p(v-if="error") {{error}} 
        template(v-if="response && response.mailInfo")
          h4.card-title Мешок {{response.parentPostIndex}}
            span(v-if="selectedBag.ppn") ( {{selectedBag.ppn}} )
          | АДРЕС : 
          b {{response.postIndexTitle}} 
          | ИНДЕКС : 
          b {{response.postIndex}}
          span.text-muted.ml-5 
          | {{response.mailInfo.toFullName}}
        template(v-if="response && response.packetListNo")
          h4.card-title B Накладная {{response.packetListNo}}
          | ОБЩИЙ ВЕС : 
          b {{response.totalWeight}} 
          | АКТУАЛЬНЫЙ ВЕС : 
          b {{response.actualWeight}} 
          | КОЛ-ВО :  
          b {{response.count}} 
          
          //- blockquote.blockquote-footer {{response}}

  
  CloseModal(v-if="isCloseModalOpen" @close="isCloseModalOpen = false")
  CloseModalAvar(v-if="isCloseModalAvarOpen" @close="isCloseModalAvarOpen = false")
  b-modal#debug(hide-header size="lg" hide-footer scrollable  body-bg-variant="dark")
    pre {{bags}}
        
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import {$leds,$sounds,deviceLEDMixin} from '@/store/api/http'

import {bindMixin} from '@/components/misc/BindModal'
import CloseModal from '@/components/CloseModal'
import CloseModalAvar from '@/components/CloseModalAvar'


export default {
  name: 'Console2',
  mounted(){
    this.$bus.$on('keyboard:keydown:enter:13',this.putToBag);
    this.$bus.$on('keyboard:keydown:enter:p',this.selectBagBarcode);
  },
  beforeDestroy(){
    this.$bus.$off('keyboard:keydown:enter:13',this.putToBag);
    this.$bus.$off('keyboard:keydown:enter:p',this.selectBagBarcode);
  },
  created(){
    if(this.ledOn) $leds.$ledoff();
  },
  watch:{
    thor(val){
      if(val !== undefined) this.tabIndex = val;
    },
    calibrating(val){
      if(val) this.calibrateStart();
      else this.calibrateStop();
    },
    error(val){
      if(val) this.timeout(10000);
    },
    status(val){
      console.log('status',val);
      
      if(val){
        // this.timeout(10000);

        // if(this.selectedBag && this.selectedBag.led){  // if led specified
        //   console.log('watched status[selectedbag]',this.selectedBag.led);
        //   $leds.on(val,this.selectedBag.led,this.thor);
        // } else {
        //   console.debug('watched status [cursor]',this.cursor)
        //   if(this.cursor != null) $leds.on(val,this.cursor);
        //   else $leds.on(val);
        // }
        
        var led = this.selectedBag && this.selectedBag.led !== null ? this.selectedBag.led : this.cursor;
            // led = led%24;
        console.debug('watched status',val,led,this.thor);
        if(this.ledOn) $leds.on(val,led,this.thor);
        $sounds.play(val);
      } /*else {
        $leds.$ledoff();
      }*/
    }
  },
  data () {
    return {
      tabIndex:0,
      ledOffline:[true,false,false,false],
      tmResponse:null,
      isCloseModalOpen:false,
      isCloseModalAvarOpen:false,
      bind:{
        started:false,
        cursor:null,
        selectedBag:null,
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
        lastBag:'getLastBag',
        error: 'getError',
        cursor: 'cursor',
        selected: 'getSelected',
        selectedBag:'getSelectedBag',
        calibrating:'getCalibrating',
        ledOn:'getLedOn',
        sortplan: 'getSortplan',
        thor:'thor'
    }),
    filteredBags() {
      return (page)=>{ return this.bags.slice(page*24, (page+1)*24); }
    },
    bagsPages(){
      return new Array(Math.ceil(this.bags.length/24));
    }
  },
  mixins:[bindMixin],
  methods:{
    ...mapActions([
      '$initBags',
      '$putToBag',
      '$selectBag',
      '$deselectBag',
      '$fetchSortplan',
      // '$remapSelectedBag',
      '$clear',
      '$save'
    ]),
    timeout(tm){
      window.clearTimeout(this.tmResponse);
      this.tmResponse = window.setTimeout(this.$clear,tm);
    },
    selectBagBarcode(barcode){
      if(this.calibrating){
        this.calibrateMapBagBarcode(barcode);
      } else {
        this.selectBag(barcode);
      }
    },
    calibrateSelectBag(ppi,i,p){
      if(this.calibrating){
        this.$selectBag({ppi});
        console.log('calibrating selectBag',ppi);
        this.calibrateMap((p*24)+i);
      }
    },
    selectBag(ppi,i,p,isErrorBag){
      console.debug('selectBag',ppi,i,p,isErrorBag)
      window.clearTimeout(this.tmResponse);
      if(this.isCloseModalOpen){
        // this.$root.$emit('bv::hide::modal','mclosebag')
      } else if(this.calibrating){
        
      } else {
        this.$clear();
        this.$selectBag({ppi}).then(()=>{
          if(isErrorBag) this.isCloseModalAvarOpen = true;
          else this.isCloseModalOpen = true;  
        }).catch((error)=>{
          console.log('selectBag error',error);
        });
        
      }
    },
    putToBag(barcode){
      if(this.isCloseModalOpen) { console.debug('skipping putToBag due to isCloseModalOpen'); return; }
      console.log('started putToBag barcode',barcode);
      window.clearTimeout(this.tmResponse);

      this.$putToBag({barcode:barcode}).then((resp)=>{
        // this.timeout(30000);
        console.log('ended Положили в корзину',resp.parentPostIndex);
      }).catch((error)=>{
        console.log('putToBag error',error);
      });

    },
    clearAll(){
      this.$clear(); 
      if(this.ledOn) $leds.$ledoff();
    }
  },
  components:{
    CloseModal,
    CloseModalAvar
  }
}




</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
   
.selected
  background-color #f00
  color #fff

#debug pre 
  color #4f4 !important
  font-size 11px
  overflow hidden
  line-height 11px


.polkas 
  user-select none
  // display: grid;
  // grid-column-gap: 50px;
    
  &.calibrating .card.outlined
    border-color #f00 !important
    
  
  .card
    flex 0 0 auto
    width 7.1rem 
    height 7.1rem
    margin 1px
    cursor pointer
    transition  background 0.2s ease-out, color 0.2s ease-out, border-color 0.5s ease-out
    
    .text-muted
      opacity 0.5
    
    // &.outlined
    //   outline 2px solid #f00
    
    &.closed
      -webkit-animation 0.5s blink step-end infinite

    &.text-muted
      opacity 0.2
      
    &.isErrorBag
      background-image linear-gradient(180deg, rgba(254,195,0,1) 0%, rgba(252,0,0,1) 100%) !important
      // pointer-events none
      

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
      
      &.smaller
        font-size 3rem
      
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

