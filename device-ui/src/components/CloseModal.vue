<template lang="pug">
div
  b-modal#mclosebagwpi(size="sm" centered hide-footer @hide="batch=null" no-fade ref="closeModalWpiRef")
    template(v-if="batch" slot="modal-title") {{batch.no}}
    b-list-group(v-if="batch")
      b-list-group-item(v-for="(v,k, n) in batch.items" :key="k") {{v}}

  b-modal#mclosebag(size="" scrollable centered Zhide-header no-close-on-backdrop no-fade @hide="clear" visible ref="closeModalRef" :header-bg-variant="isEditing?'danger':''"  :footer-bg-variant="isEditing?'danger':''")


      template(slot="modal-header") 
        b-card.w-100(no-body)
          b-card-header.noborder
            b-link.close(@click.stop="clear") &times;
            b-card-title 
              i.fa.fa-inbox.mr-2(:class="{'text-danger':isEditing}" @click="isEditing=!isEditing")
              input.inline(:value="selectedBag.ppi" style="width:85px;" @input="tempPpi = $event.target.value" :disabled="!isEditing" size="8")
              input.inline.ml-1(v-model="selectedBag.ppn" size="18" placeholder="Полка" :disabled="!isEditing")
              div(v-if="isEditing")
                i.fa.fa-lightbulb-o.mr-2
                input.inline(v-model="selectedBag.led" style="width:33px" :placeholder="cursor")
              
            //- b-card-sub-title
              template(v-if="isEditing || selectedBag.ppn") УСПП 
                input.inline(v-model="selectedBag.ppn" size="20" :placeholder="selectedBag.ppi" :disabled="!isEditing"

          b-card-header.pt-0(header-tag="nav")
            b-nav.nav-justified.wizard(card-header tabs)
              b-nav-item(:active="tabIndex == 0" @click="tabIndex = 0") ШПИ
                b-badge.ml-2(variant="primary" v-if="count") {{count}} шт
              b-nav-item(:active="tabIndex == 1" @click="tabIndex = 1" :disabled="!count && !batchCount") Б'шки
                b-badge.ml-2(variant="warning" v-if="batchCount") {{batchCount}}
              //- b-nav-item(:active="tabIndex == 2" @click="tabIndex = 2" :disabled="!count") Вес
                b-badge.ml-2(variant="info") 0.24
              b-nav-item(:active="tabIndex == 2" :disabled="!response && !selectedBag.closeResponse" @click="tabIndex = 2") Ярлык

      b-card(no-body v-if="!isEditing" style="min-height:500px;")
        b-card-body
          template(v-if="!response && tabIndex == 2")
            b-btn(block v-if="selectedBag.closeResponse" @click="$store.state.polka.closeResponse=selectedBag.closeResponse" variant="outline-secondary") Показать старый ярлык
          template(v-if="error")  {{error}}
          template(v-if="response && response.labelListNo && tabIndex == 2")
            Yarlik

          template(v-if="count && !response && tabIndex == 0")
            h4 
              b-badge.mr-2(v-for="(v,k, n) in selectedBag.wpi" size="lg" :key="k" 
                :variant="v.forcepush?'danger':'primary'" @click="removeWpi(k)") {{k}}   &times;

          template(v-if="tabIndex == 1")
            h4
              //- template(v-if="selectedBag.batch")
                b-badge.mr-2(size="lg" variant="warning") B1234567890DEMO
                b-badge.mr-2(size="lg" variant="warning") B1234567890DEMO
              b-badge.mr-2(v-for="(v,k, n) in selectedBag.batch" size="lg" :key="n" variant="warning" @click="showBatchContent(k,v)") {{k}}

          //- b-list-group(v-if="count && !response" flush)
          //-   b-list-group-item.flex-column.align-items-start(v-for="(v,k, n) in selectedBag.wpi" :key="k" :variant="v.forcepush?'warning':''")
          //-     .d-flex.w-100.justify-content-between
          //-       h5(@click="removeWpi(k)") 
          //-         b-badge(variant="danger") {{k}}   &times;
                //- small {{v.postIndex}} 
                  template(v-if="v.forcepush") Ручной ввод

            
              //- p.text-muted.mb-1(:title="JSON.stringify(v)") {{v.mailInfo.toFullName}}


      template(slot="modal-footer") 
        b-card.w-100(no-body)
          template(v-if="tabIndex == 0")
            b-card-footer
              i.fa.fa-tachometer.mr-2/
              input.inline.mr-2#weightscales(
                :value="weight" 
                readonly=""
                :class="{'text-danger':weight >= 15}"
                @dblclick="weight = 5.05" 
                style="width:335px; text-align:right"
                placeholder="Вес")/ kg
          template(v-if="tabIndex == 1")
            b-card-footer
              b-row
                b-col
                  i.fa.fa-tachometer.mr-2/
                  input.inline.mr-2#weightscales(
                    :value="weight" 
                    readonly=""
                    :class="{'text-danger':weight >= 15}"
                    @dblclick="weight = 5.05" 
                    style="width:135px; text-align:right"
                    placeholder="Вес")/ kg
                b-col
                  i.fa.fa-bookmark.mr-2/ 
                  input.inline(
                    :value="plomba" 
                    readonly="" 
                    placeholder="Пломба" 
                    style="width:165px; text-align:right" 
                    @dblclick="plomba = 1234567890123")
            b-card-footer
              b-row
                b-col
                  b-form-radio-group(v-model="sendmeth" :options="sendmethTypes")
                b-col
                  b-form-radio-group(v-model="taraType")
                    b-form-radio(value="1") Мешок
                    b-form-radio(value="2") Ящик
          b-card-footer
            b-btn(v-if="isEditing" block @click="save"  size="lg" variant="danger") Сохранить

            b-dropdown.button-block.w-100(
              v-if="!isEditing && tabIndex == 0 && !response" split 
              size="lg" 
              :disabled="buttonPending || count < 1 || !weight" 
              split-variant="primary" variant="outline-primary" @click="formB")
              template(slot="button-content") 
                | Формировать B накладную
              b-dropdown-item(@click="tabIndex = 1") Сразу закрыть мешок


            b-dropdown.button-block.w-100(
              v-if="!isEditing && tabIndex == 1 && !response" 
              :disabled="!weight || weight > 15 || !plomba || buttonPending" split size="lg" 
              :split-variant="weight>0 && weight < 15 && plomba? (selectedBag.batch ? 'warning':'primary'):(selectedBag.batch?'outline-warning':'outline-primary')" 
              :variant="selectedBag.batch?'outline-warning':'outline-primary'" @click="closeBag")
              template(slot="button-content") 
                | Закрыть {{bagTypes[bagType].text}} {{taraTypes[taraType]}} {{crateId}}
                //- div.small {{mapSpr(bagType,bagTypes)}}
              b-dropdown-item(@click="bagType = k" v-for="(v,k) in bagTypes" :key="k") 
                i.fa.mr-2( :title="k" :class="{'fa-circle text-success':bagType==k,'fa-circle-o':bagType!=k}")/
                | {{v.val}}
              b-dropdown-divider
              b-dropdown-item Мешок
              b-dropdown-item Ящик
              b-dropdown-divider
              b-dropdown-item Наземный
              b-dropdown-item Авиа

            b-dropdown.button-block.w-100(v-if="tabIndex == 2" split size="lg" split-variant="success" variant="outline-success" @click="print")
              template(slot="button-content") 
                i.fa.fa-print.mr-2
                | Печать Ярлыка
              b-dropdown-item(@click="config.isAutoPrint=!config.isAutoPrint; $save();") 
                i.fa.mr-2(:class="{'fa-circle text-success':config.isAutoPrint,'fa-circle-o':!config.isAutoPrint}")/
                | Автопечать
              b-dropdown-item(@click="config.isWindowsPrint=!config.isWindowsPrint; $save();")
                i.fa.mr-2(:class="{'fa-circle text-success':!config.isWindowsPrint,'fa-circle-o':config.isWindowsPrint}")/
                | Нативная Печать
              b-dropdown-item(@click="config.isPrintProxy=!config.isPrintProxy; $save();")
                i.fa.mr-2(:class="{'fa-circle text-success':config.isPrintProxy,'fa-circle-o':!config.isPrintProxy}")/
                | Proxy Печать
              b-dropdown-item(@click="config.isRotate=!config.isRotate; $save();")
                i.fa.mr-2(:class="{'fa-circle text-success':config.isRotate,'fa-circle-o':!config.isRotate}")/
                | Альбомная

                
                  
                //- b-btn.m-auto(variant="primary" @click="") Печать Windows

    
   
      
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import {$leds} from '@/store/api/http'
import cyr from 'cyrillic-to-translit-js'
import Encoder from 'code-128-encoder'
import Yarlik from '@/components/YarlikPrintTemplate'
var code128= new Encoder()



export default {
  name: 'CloseModal',
  props: ['isCloseModalOpen'],
  mounted(){
    this.$bus.$on('keyboard:keydown:enter:p',this.next);
    this.$bus.$on('keyboard:keydown:enter:c',this.crateEnter);
    this.$bus.$on('keyboard:keydown:enter',this.weightEnter);
  },
  beforeDestroy(){
    this.$bus.$off('keyboard:keydown:enter:p',this.next);
    this.$bus.$off('keyboard:keydown:enter:c',this.crateEnter);
    this.$bus.$off('keyboard:keydown:enter',this.weightEnter);
  },
  computed:{
    ...mapGetters({
        response: 'getCloseResponse',
        selected:'getSelected',
        config:'getConfig',
        error: 'getError',
        selectedBag:'getSelectedBag',
        bags: 'getBags',
        cursor: 'cursor',
    }),
    comment(){
      return (this.crateId)?'Ящик номер ' + this.crateId:''
    },
    count(){
      return Object.keys(this.selectedBag.wpi).length;
    },
    batchCount(){
      return (this.selectedBag.batch) ? Object.keys(this.selectedBag.batch).length : 0;
    }
  },
  data () {
    return {
      isEditing:false,
      buttonPending:false,
      wpi:null,
      tabIndex:0,
      crateId:null,
      tempPpi:null,
      weight:null,
      batch:null,
      sendmethTypes:{"1":"Наземный","2":"Авиа"},
      sendmeth:1,
      plomba:null,
      bagTypes:{
        "1":{val:"Мешок Сактандыру",text:"Сактандыру"},
        "2":{val:"Заказная корреспонденция",text:"Заказной"},
        "3":{val:"Правительственная письменная коррeспонденция",text:"Правительственный"},
        "4":{val:"Письменная корреспонденция",text:"Письменный"},
        "5":{val:"Пороженная тара",text:"Пороженный"},
        "6":{val:"Мешок с отправлениями EMS",text:"EMS"},
        "7":{val:"Мешок с международной письменной корреспонденцией",text:"Международный"},
        "8":{val:"Постпакет внутренний",text:"Постпакет"},
        "9":{val:"Группа РПО",text:"Группа"},
      },
      taraTypes:{"1":"Мешок","2":"Ящик"},
      bagType:2,
      taraType:1,
      // comment:null
    }
  },
  methods:{
    ...mapActions([
      '$formBag',
      '$formBagByPacklist',
      '$formB',
      '$clear',
      '$deselectBag',
      '$save',
      '$selectBag',
      '$deselectBag',
      '$forcePutToBag',
      '$removeWpi'
    ]),
    encode(val){
      return code128.encode(val)
    },
    showBatchContent(k,v){
      this.batch = {items:v,no:k};
      this.$bvModal.show('mclosebagwpi');
    },
    formB(){

      this.buttonPending = true;

      this.$formB({
          ppi:this.selected,
          wpi:Object.keys(this.selectedBag.wpi),
          weight:this.weight
        }).then(()=>{
          this.tabIndex = 1
          this.weight = null

        }).finally(()=>{
          this.buttonPending = false;
        });

    },
    closeBag(){
      this.buttonPending = true;

      if(this.selectedBag.batch){

        this.$formBagByPacklist({
          ppi:this.selected,
          packList:Object.keys(this.selectedBag.batch),
          weight:this.weight,
          sendmeth:this.sendmeth,
          plomba:this.plomba,
          bagType:this.bagType,
          taraType:this.taraType,
          comment:this.comment
        }).then(()=>{
          this.tabIndex = 2
          this.weight = null
          this.plomba = null
          this.crateId = null
          // this.bagType = 1
          // this.taraType = 1
          if(this.config.isAutoPrint) this.print();
          
        }).finally(()=>{
          this.buttonPending = false;
        });

    } else {

        this.$formBag({
          ppi:this.selected,
          wpi:Object.keys(this.selectedBag.wpi),
          weight:this.weight,
          sendmeth:this.sendmeth,
          plomba:this.plomba,
          bagType:this.bagType,
          taraType:this.taraType,
          comment:this.comment
        }).then(()=>{
          this.tabIndex = 2
          this.weight = null
          this.plomba = null
          this.crateId = null
          // this.bagType = 1
          // this.taraType = 1
          if(this.config.isAutoPrint) this.print();
          
        }).finally(()=>{
          this.buttonPending = false;
        });

      }


    },
    mapSpr(val,spr){
      if(val) return spr[val];
    },
    crateEnter(val){
      this.crateId = val
      this.taraType = 2;
    },
    weightEnter(val){
      // console.log('COUNT',this.count)
      if(val && val.length == 13) 
        if(isNaN(val)) this.$forcePutToBag({barcode:val});
        else this.plomba = val
      else if(this.count > 0 && val.indexOf('.') > 0 ) 
        if(!isNaN(val)) this.weight = val;
    },
    removeWpi(k){
      this.$removeWpi({barcode:k}); // TODO SuperBug, Why we need this ?
        

        // const wpi = { ...this.selectedBag.wpi };
        // delete wpi[k];
        // this.selectedBag.wpi = wpi
      // }

      // this.$bvModal.msgBoxConfirm("Удалить ШПИ "+k+" из мешка ?", {
      //     title: "Выемка из мешка",
      //     size: 'sm',
      //     buttonSize: 'sm',
      //     okVariant: 'danger',
      //     okTitle: 'Удалить',
      //     cancelTitle: 'Отмена',
      //     footerClass: 'p-2',
      //     hideHeaderClose: false,
      //     centered: true
      //   }).then(value => {
      //     if(value) {
      //       console.log(value,k);
      //       Vue.delete(this.selectedBag.wpi,k);
      //     }
      //   })
      //   .catch(err => {
      //     console.error(err);
      //     // An error occurred
      //   })
    },
    next(ppi){

      if(ppi == this.selected && this.selectedBag.ppi ){
        if(this.tabIndex == 0){
          this.tabIndex = 1
        } else if(this.tabIndex == 1){
          this.formBag();
        }
      } else {
        this.clear();
      }
    },
    save(){
      console.log("===>",this.selectedBag.ppi,this.tempPpi);
      if(this.tempPpi && this.selected != this.tempPpi){
        var indx = this.cursor
        this.clear();
        this.bags[indx].ppi = this.tempPpi;
        this.tempPpi = null
      } else {
        this.clear();
      }
      this.$save();
    },
    clear(){
      this.$deselectBag();
      this.plomba = null;
      this.weight = null;
      this.crateId = null;
      this.taraType = 1;
      this.$emit('close');
    },
    print(){
      if(this.config.isPrintProxy){
        var text = document.getElementById('printSection').innerText;
          text = cyr().transform(text);
          text = text.replace('қ','k')
          $leds.printbag(text);
      } else {
        this.$print();
      }
    },
    testLed(led){
      $leds.test(led);
    },
    printTest(){
      $leds.printbagTest();
      this.clear();
    }
  },
  components:{
    Yarlik
  }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">


    
.content * 
  display block
  
  

#mclosebag 
  .circle
    position absolute
    font-size 11px
    margin-left -20px
    padding 2px 4px
    
  pre 
    overflow-x hidden
  

  .btn-group.button-block .btn:first-child
    width 100%
    

  .modal-header
    border-bottom none
    padding-bottom 0
    
    .card-header.noborder
      border-bottom none
      padding-bottom 0
    
    .card 
      border-bottom-right-radius 0
      border-bottom-left-radius 0
      border-bottom none
  
  .modal-footer
    border-top none
    padding-top 0
    
    .card
      border-top-right-radius 0
      border-top-left-radius 0
      border-top none

  .modal-body
    padding-top 0
    padding-bottom 0
    
    .card 
      border-radius 0
      border-top none
      border-bottom none
  
  
  
.inline 
  outline none
  display inline
  padding 0
  line-height 1
  border-bottom 1px dashed #ccc
  height auto
  border none
  font-weight normal
  border-radius 0
  
  &:disabled
    border-bottom 1px transparent !important
  
  &:focus
    box-shadow none
    background-color transparent
    
.label
  font-size 1rem
  display inline
  margin-left 5px

.hide
  display none
  
  
</style>
