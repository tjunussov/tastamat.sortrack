<template lang="pug">
b-modal#mclosebag(size="" scrollable centered no-close-on-backdrop no-fade @hide="clear" visible ref="closeModalRef")


    template(slot="modal-header") 
      b-card.w-100(no-body)
        b-card-header
          b-link.close(@click.stop="clear") &times;
          b-card-title 
            i.fa.fa-inbox.mr-2(:class="{'text-success':isEditing}" @click="isEditing=!isEditing")
            b-badge.circle(v-if="count" pill variant="success") {{count}}
            | Полка 
            input.inline(:value="selectedBag.ppi" style="width:95px;" @input="tempPpi = $event.target.value" :disabled="!isEditing" size="8")
            .scales.pr-4(v-if="count")
              i.fa.fa-tachometer.mr-2
              b-form-input.inline.text-right#weightscales(
                :value="weight" 
                readonly=""
                :class="{'text-danger':weight >= 15000}"
                @dblclick="weight = 25" 
                style="width:90px;"
                placeholder="Вес") 
              .label.text-muted гр
              //- b-tooltip(target="weightscales") Взвесте пожалуйста
            //- .scales.pr-4(v-if="count == 0 && response")
            //-   i.fa.fa-bookmark.mr-2
            //-   b-form-input.inline.text-right#plomba(
            //-     :value="plomba" 
            //-     readonly=""
            //-     @dblclick="plomba = 1234567890123" 
            //-     style="width:130px; font-size:16px;"
            //-     placeholder="Пломба") 
              .label.text-muted
          b-card-sub-title.mb-2 Индекс 
            input.inline(v-model="selectedBag.ppn" :disabled="!isEditing" size="20" :placeholder="selectedBag.ppi")
            div 
              i.fa.fa-bookmark.mr-2 
              | Пломба
              input.inline.ml-2(:value="plomba" style="width:130px" @dblclick="plomba = 1234567890123")
            div(v-if="isEditing") Лампочка
              i.fa.fa-lightbulb-o.mr-2.ml-4
              input.inline(v-model="selectedBag.led" style="width:50px" :placeholder="cursor")

    b-card(no-body)

      //- b-card-header(header-tag="nav")
      //-   b-nav.nav-justified.wizard(card-header tabs)
      //-     b-nav-item(:active="tabIndex == 0" @click="tabIndex = 0") ШПИ
      //-       b-badge.ml-2(variant="primary") {{count}}шт
      //-     //- b-nav-item(:active="tabIndex == 1" @click="tabIndex = 1" :disabled="!count") Вес
      //-     b-nav-item(:active="tabIndex == 1" :disabled="!(response && response.packetListNo)" @click="tabIndex = 2") Ярлык

      //- b-card-body.p-4        
          //- b-input-group-append
          //-   b-btn(disabled) Считать вес
        //- b-form-group(label="Вид отправки")
        //-   b-btn(@click="sendmeth = 2" disabled variant="white" v-if="sendmeth == 1") Наземный
        //-   b-btn(variant="primary" disabled @click="sendmeth = 1" v-else) Авия

      b-card-body(v-if="response && response.packetListNo")
        pre.text-primary#printSection.mb-0( :class="{'rotate':config.isRotate}")
          template(v-if="config.isWindowsPrint")
            div
              b ВИД ЗАДЕЛКИ       
              span {{response.bagType}}
            //- div
              b ШТРИХКОД 
              span {{response.packetListNo}}
            div
              b НОМЕР ЗАДЕЛКИ     
              span {{response.labelListNo}}
            div
              b ПЛОМБА            
              span {{response.plombaNum}}
            div
              b СПОСОБ ПЕРЕСЫЛКИ  
              span {{response.route}}
            //- div 
            //-   b ТИП 
            //-   span {{response.cli_info.BAGTYPE_NAME}}
            div
              b ОТКУДА 
              span {{response.fromTechindex}} {{response.fromDepartment}}
            div
              b КУДА   
              span {{response.fromTechindex}} {{response.toDepartment}}
            div
              b ВЕС МЕШКА 
              span {{response.actualWeight}}
              b     ВЕС НЕТТО 
              span {{response.totalWeight}}
              b     КОЛ-ВО 
              span {{response.count}} 
            div ——————————————————————————————————————————————————
            .barcode.ml-3 {{encode(response.labelListNo)}}
            div ——————————————————————————————————————————————————
            div.small
              b СОЗДАЛ 
              span {{response.workerName}}
            div.small
              b ДАТА 
              span {{response.date}}
            div
              | 
              |
              b     ©2020 Powered by SORTRACK®, KAZPOST INC"
          template(v-else)
              | N
              | q720
              | j555
              | l8,C,001
              | X0,40,4,710,640
              | 
              | A20,60,0,5,1,1,N,"{{response.route}}"
              | A20,120,0,4,1,1,N,"KYDA"
              | A300,120,0,4,1,1,N,"{{response.toDepartment}}"
              | 
              | A20,150,0,4,1,1,N,"OT"
              | A300,150,0,4,1,1,N,"{{response.fromDepartment}}"
              | 
              | A20,180,0,4,1,1,N,"BEC {{response.actualWeight}}"
              | A300,180,0,4,1,1,N,"{{response.count}} Kolvo"
              | 
              | A20,210,0,4,1,1,N,""
              | 
              | B20,240,0,1,2,2,100,B,"{{response.packetListNo}}"
              | 
              | A20,480,0,4,1,1,N,"COTPYDHNK"
              | A300,480,0,4,1,1,N,"{{response.workerName}}"
              | A380,480,0,4,1,1,N,"_______________"
              | 
              | A20,510,0,1,1,1,N,"© 2018 Powered by SORTRACK®, KAZPOST INC"
              | P1
              | N              
      b-card-body(v-if="error" body-bg-variant="danger" body-text-variant="white")  {{error}}



      b-card-body(v-if="!count && !response" style="min-height:300px;")
        b-btn(block v-if="selectedBag.closeResponse" @click="$store.state.polka.closeResponse=selectedBag.closeResponse" variant="outline-secondary") Показать старый мешок


      b-list-group(v-if="count && !response" style="min-height:300px;" flush)
        b-list-group-item.flex-column.align-items-start(v-for="(v,k, n) in selectedBag.wpi" :key="k")
          .d-flex.w-100.justify-content-between
            h5(@click="removeWpi(k)") {{k}}   &times;
            small {{v.postIndex}}

        
          //- p.text-muted.mb-1(:title="JSON.stringify(v)") {{v.mailInfo.toFullName}}
    template(slot="modal-footer") 
        b-btn(v-if="isEditing" block @click="save"  size="lg" variant="danger") Save
        b-btn(:variant="weight>0 && weight < 15000 && plomba?'success':'outline-success'" block size="lg" v-if="!isEditing && tabIndex == 0 && !response" :disabled="!weight || weight > 15000 || !plomba" @click="closeBag")
          i.fa.fa-lock.mr-2
          | Закрыть мешок
        //- b-btn(@click="$bus.$emit('keyboard:keydown:enter:p',selected)" v-if="tabIndex == 0 && count" variant="success") Взвесить 
          i.fa.fa-tachometer

          //- b-button-group.float-left
            b-btn(title="Автопечать" :variant="config.isAutoPrint?'primary':'outline-primary'" @click="config.isAutoPrint=!config.isAutoPrint") 
              i.fa.fa-bolt
            b-btn(title="Автопечать" :variant="config.isAutoPrint?'primary':'outline-primary'" @click="config.isAutoPrint=!config.isAutoPrint") 
              i.fa.fa-bolt
        b-dropdown.button-block.w-100(v-if="response" split size="lg" split-variant="primary" variant="outline-primary" @click="print")
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
var code128= new Encoder()



export default {
  name: 'CloseModal',
  props: ['isCloseModalOpen'],
  mounted(){
    this.$bus.$on('keyboard:keydown:enter:p',this.next);
    this.$bus.$on('keyboard:keydown:enter',this.weightEnter);
  },
  beforeDestroy(){
    this.$bus.$off('keyboard:keydown:enter:p',this.next);
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
    count(){
      return Object.keys(this.selectedBag.wpi).length;
    }
  },
  data () {
    return {
      isEditing:false,
      tabIndex:0,
      tempPpi:null,
      weight:null,
      sendmeth:1,
      plomba:0
    }
  },
  methods:{
    ...mapActions([
      '$closeBag',
      '$clear',
      '$deselectBag',
      '$save',
      '$selectBag',
      '$deselectBag',
    ]),
    encode(val){
      return code128.encode(val)
    },
    closeBag(){
      this.$closeBag({
        ppi:this.selected,
        wpi:Object.keys(this.selectedBag.wpi),
        weight:this.weight,
        sendmeth:this.sendmeth,
        plomba:this.plomba
      }).then(()=>{
          this.tabIndex = 1
          this.weight = null
          if(this.config.isAutoPrint) this.print();
        });
    },
    weightEnter(val){
      // console.log('COUNT',this.count)
      if(val && val.length == 13) this.plomba = val
      else if(this.count > 0 && val.indexOf('.') > 0 ) this.weight = val.substr(0,val.indexOf('.'));
    },
    removeWpi(k){

      //if(confirm("Удалить ШПИ "+k+" из мешка ?")){
        console.log('deleted',k,this.selectedBag.wpi[k]);
        
        if(confirm('Вы уверены что хотите удалить ' + k)) {
          Vue.delete(this.selectedBag.wpi,k);
          this.$forceUpdate(); // TODO SuperBug, Why we need this ?
        }

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
          this.closeBag();
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
  

  .btn-group.button-block .btn:first-child
    width 100%
  
  

.scales
  position absolute
  right 0px
  top 30px
  font-size 2rem
  
  .inline 
    outline none
    display inline
    padding 0
    line-height 1
    height auto
    border none
    border-bottom 1px dashed #ccc
    font-weight normal
    border-radius 0
    
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
