<template lang="pug">
b-row.flex-xl-nowrap2
  .pt-2.mt-4.bd-content.col-12
    b-tabs.nav-justified.wizard(pills v-model="tabIndex")
      b-tab(v-for="(pp,p) in bagsPages" :key="p")
        template(slot="title") Thor {{p+1}} [{{p*24}}-{{(p+1)*24}}] 
          i.fa.fa-lightbulb-o.text-danger.pull-right(v-if="ledOffline[p]")
        b-card-group.polkas.pt-4(:class="{calibrating}" deck)
          b-card(no-body align="center"
            v-for="(b,i) in filteredBags(p)"
            :key="i" 
            :class="{'text-muted':!Object.keys(b.wpi)[0] && !calibrating,'binding-led':bind.cursor == b.led,'outlined': b.led == null || cursor == i,'isErrorBag':b.isErrorBag,'inserted':b.color && Object.keys(b.color).length}"
            :disabled="calibrating && b.led != null"
            :bg-variant="b.color? Object.values(b.color)[0]:''" 
            @click="selectBag(b.ppi,i,p,b.isErrorBag)"
            @dblclick="calibrateSelectBag(b.ppi,i,p)" )
            
            b-card-header
              template(v-if="b.isErrorBag") Корзина
              template(v-else) {{(b.ppi)}}
              small.text-muted.indx
                //- {{(b.index)}} 
                span.led(:class="{'remapped':b.led!=null}") {{b.led!==null?b.led:i}}
              //- b-btn.close(v-if="Object.keys(b.wpi).length") &times;
            b-card-body
              h4.card-title(:class="{'smaller':Object.keys(b.wpi).length>100}")
                template(v-if="bind.cursor != null") {{bind.cursor}} 
                template(v-else) {{Object.keys(b.wpi).length}}
            b-card-footer.pt-0.pb-2(v-for="(b,c) in b.color" :footer-bg-variant="b" :key="c")


  .p-4.pb-5.consoles.fixed-bottom
    b-card-group(deck)
      b-card.mr-1(no-body v-for="(c,k,i) in consoles" :key="k" :class="{shake:c.req && c.req.error}")
        b-card-header.pt-1.pb-0(:header-bg-variant="c.bgColor")
        b-card-header(:header-bg-variant="c.req?c.bgColor:''" header-text-variant="white") ШПИ 
          template(v-if="c.req")
            b {{c.req.barcode}} 
            b-btn.close(@click.stop="clearAll")  &times;
              //- b-link(@click="wizardToggle" size="sm" v-bind:class="{'bg-primary text-white':bind.started}") {{!bind.started?'Bind Start':'Bind Stop'}}
        b-card-body.p-3(:body-bg-variant="c.req && c.req.error?'danger':'' " :body-text-variant="c.req && c.req.error?'white':''")
          template(v-if="c.req")
            b-progress(v-if="c.req.status=='search'" :variant="c.bgColor" :value="100" :max="100" striped animated)
            template(v-if="c.req.error")
              p(v-html="c.req.error")
            template(v-if="c.req.response && c.req.response.mailInfo")
              div(:set="(r = c.req.response)")
              h4.card-title Корзина {{r.parentPostIndex}}
                span(v-if="selectedBag && selectedBag.ppn") ( {{selectedBag.ppn}} )
              | АДРЕС : 
              b {{c.req.response.postIndexTitle}} 
              | ИНДЕКС : 
              b {{c.req.response.postIndex}}
              span.text-muted.ml-5 
              | {{c.req.response.mailInfo.toFullName}}

            //- template(v-if="c.req.response && c.req.response.packetListNo")
            //-   h4.card-title B Накладная {{c.req.response.packetListNo}}
            //-   | ОБЩИЙ ВЕС : 
            //-   b {{c.req.response.totalWeight}} 
            //-   | АКТУАЛЬНЫЙ ВЕС : 
            //-   b {{c.req.response.actualWeight}} 
            //-   | КОЛ-ВО :  
            //-   b {{c.req.response.count}} 
                  
                //- blockquote.blockquote-footer {{response}}

  
  CloseModal(v-if="isCloseModalOpen" @close="isCloseModalOpen = false")
  CloseModalAvar(v-if="isCloseModalAvarOpen" @close="isCloseModalAvarOpen = false")
  
        
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import {$leds} from '@/store/api/http'
import {kolor} from '@/store/modules/polka'
import {bindMixin} from '@/components/misc/BindModal'
import CloseModal from '@/components/CloseModal'
import CloseModalAvar from '@/components/CloseModalAvar'


const Var = {
  render() {
    return this.$scopedSlots.default(this.$attrs)
  }
}


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
    if(this.ledOn) $leds.xoff();
  },
  watch:{
    thor(val){
      if(val !== undefined) this.tabIndex = val;
    },
    calibrating(val){
      if(val) this.calibrateStart();
      else this.calibrateStop();
    },
    // error(val){
    //   if(val) this.timeout(10000);
    // },
    // status(val){
    //   console.debug('status',val);
      
    //   if(val){
    //     this.timeout(10000);

    //     // if(this.selectedBag && this.selectedBag.led){  // if led specified
    //     //   console.log('watched status[selectedbag]',this.selectedBag.led);
    //     //   $leds.on(val,this.selectedBag.led,this.thor);
    //     // } else {
    //     //   console.debug('watched status [cursor]',this.cursor)
    //     //   if(this.cursor != null) $leds.on(val,this.cursor);
    //     //   else $leds.on(val);
    //     // }
        
    //     var led = this.selectedBag && this.selectedBag.led !== null ? this.selectedBag.led : this.cursor;
    //         // led = led%24;
    //     console.debug('watched status',val,led,this.thor);
    //     if(this.ledOn) $leds.on(val,led,this.thor);
    //     $sounds.play(val);
    //   } /*else {
    //     $leds.$ledoff();
    //   }*/
    // }
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
        bags: 'getBags',
        selectedBag:'getSelectedBag',
        calibrating:'getCalibrating',
        ledOn:'getLedOn',
        thor:'thor',
        cursor: 'cursor',
        consoles:'getConsoles'
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
      '$remapPpi',
      '$clear',
      '$clearSelected',
      '$save'
    ]),
    kolor,
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
    putToBag(barcode,color){
      if(this.isCloseModalOpen) { console.debug('skipping putToBag due to isCloseModalOpen'); return; }
      console.log('started putToBag barcode',barcode);
      window.clearTimeout(this.tmResponse);

      this.$putToBag({barcode,color}).then((resp)=>{
        // this.timeout(30000);
        console.debug('ended Положили в корзину',resp.parentPostIndex);
      }).catch((error)=>{
        console.error('putToBag error',error);
      });

    },
    clearAll(){
      this.$clear(); 
      if(this.ledOn) $leds.xoff();
    }
  },
  components:{
    CloseModal,
    CloseModalAvar,
    Var
  }
}




</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
   
.selected
  background-color #f00
  color #fff

.dark .card
  
  &.text-muted
    opacity 0.2 
  
  .text-muted
    opacity 0.5


.polkas
  user-select none
  // display: grid;
  // grid-column-gap: 50px;
    
  &.calibrating .card.outlined
    -webkit-animation: 1s blinkoutline step-end infinite
    
  
  .card
    flex 0 0 auto
    width 7.1rem 
    height 7.1rem
    margin 1px
    cursor pointer
    transition  background 0.2s ease-out, color 0.2s ease-out, border-color 0.5s ease-out
    
    &.outlined
      outline 2px solid #fff
      
    &.binding-led 
      
      .card-header
        background-color #fff2
        -webkit-animation 1s blink step-end infinite !important
      
    
    &.closed
      -webkit-animation 0.5s blink step-end infinite
      
    &.inserted
      // background-color: #fff !important
      box-shadow 0px 10px 10px rgba(0,0,0,0.3) !important
      z-index 1000 !important
      
      .card-header
        color: #ccc
      
      .card-footer
        -webkit-animation 0.1s blink step-end 10
      
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
      color #eee
      
      &.remapped
        color #ff0
    
  // .card:nth-child(5),.card:nth-child(13),.card:nth-child(21),.card:nth-child(29)
  .card:nth-child(5),.card:nth-child(8n+5)
    margin-left 2rem
    background-color #ffe
    
  .card:nth-child(4),.card:nth-child(8n+4)
    background-color #ffe
    
</style>

