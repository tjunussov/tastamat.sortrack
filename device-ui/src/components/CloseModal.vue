<template lang="pug">
b-modal#mclosebag(no-enforce-focus size="" no-fade @hide="clear" visible ref="closeModalRef" hide-header hide-footer)
    

    b-card(no-body)
      b-card-header
        b-link.close(@click.stop="clear") &times;
        b-card-title 
          i.fa.fa-inbox.mr-2(:class="{'text-success':isEditing}" @click="isEditing=!isEditing") 
          | Полка 
          input.inline(:value="selectedBag.ppi" @input="tempPpi = $event.target.value" :disabled="!isEditing" size="8")
          template(v-if="isEditing")
            i.fa.fa-lightbulb-o.mr-2.ml-4
            input.inline(v-model="selectedBag.led" style="width:50px" type="number" :placeholder="cursor")
        b-card-sub-title.mb-2 Направление 
          input.inline(v-model="selectedBag.ppn" :disabled="!isEditing" size="20" :placeholder="selectedBag.ppi")

      b-card-header(header-tag="nav")
        b-nav.nav-justified.wizard(card-header tabs)
          b-nav-item(:active="tabIndex == 0" @click="tabIndex = 0") ШПИ
            b-badge.ml-2(variant="primary") {{count}}шт
          b-nav-item(:active="tabIndex == 1" @click="tabIndex = 1" :disabled="!count") Вес
          b-nav-item(:active="tabIndex == 2" :disabled="!(response && response.packetListNo)" @click="tabIndex = 2") Ярлык

      b-card-body.p-5(v-if="tabIndex == 1")
        b-row
          b-col Общий вес
          b-col
            b-form-input(v-model="weight" @dblclick.native="weight = 25" :autofocus="true" type="number" size="lg" required palceholder="Общий Вес*") 
          b-col КГ
          //- b-input-group-append
          //-   b-btn(disabled) Считать вес
        //- b-form-group(label="Вид отправки")
        //-   b-btn(@click="sendmeth = 2" disabled variant="white" v-if="sendmeth == 1") Наземный
        //-   b-btn(variant="primary" disabled @click="sendmeth = 1" v-else) Авия

      b-card-body(v-if="response && response.packetListNo")
        code.text-primary#printSection
          .mx-4.my-4
            //- code {{response}}
            code#bagPrintData.hide
              | N
              | q720
              | j555
              | l8,C,001
              | X0,40,4,710,640
              | 
              | A20,60,0,5,1,1,N,"response.route"
              | A20,120,0,4,1,1,N,"KYDA"
              | A300,120,0,4,1,1,N,"response.toDepartment"
              | 

              | A20,150,0,4,1,1,N,"OT"
              | A300,150,0,4,1,1,N,"response.fromDepartment"
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


            div
              b ШТРИХКОД 
              span {{response.packetListNo}}
            div
              b ЛЭЙБЛ 
              span {{response.labelListNo}}
            //- div 
            //-   b МЕТОД 
            //-   span {{response.cli_info.SNDMETH_NAME}}
            //- div 
            //-   b ТИП 
            //-   span {{response.cli_info.BAGTYPE_NAME}}
            div 
              b ОТ 
              span {{response.fromDepartment}}
            div 
              b КУДА 
              span {{response.toDepartment}}
            div 
              b ВЕС 
              span {{response.actualWeight}} 
            div 
              b КОЛ-ВО 
              span {{response.count}}
            div 
              b ОПЕРАТОР 
              span {{response.workerName}}
            div 
              b ДАТА 
              span {{response.date}}

              
        code.text-danger(v-if="response && response.result == 'error'")  {{response}}


      b-list-group(v-if="count" flush)
        b-list-group-item.flex-column.align-items-start(v-for="(v,k, n) in selectedBag.wpi" :key="k")
          .d-flex.w-100.justify-content-between(@click="removeWpi(k)") 
            h5 {{k}}   &times;
            small  {{v.postIndexTitle}} ( {{v.postIndex}} )
          //- p.text-muted.mb-1(:title="JSON.stringify(v)") {{v.mailInfo.toFullName}}
      b-card-footer.text-center
        b-btn.mr-auto(v-if="isEditing" @click="save" variant="outline-secondary") Save
        //- b-btn.mr-auto(@click="tabIndex--" v-if="tabIndex > 0" variant="primary").left 
          i.fa.fa-arrow-left
          |  Назад 
        b-btn(variant="danger" v-if="tabIndex == 1 && !response" :disabled="!weight" @click="closeBag")
          i.fa.fa-lock.mr-2
          | Закрыть мешок
        b-btn(@click="$bus.$emit('keyboard:keydown:enter:p',selected)" v-if="tabIndex == 0 && count" variant="success") Взвесить 
          i.fa.fa-tachometer
        template(v-if="tabIndex == 2 && response")
          b-btn(variant="primary" @click="print") 
            i.fa.fa-print.mr-2
            | Печать Ярлыка
          //- b-btn.m-auto(variant="primary" @click="") Печать Windows

  
   
      
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
      isWindowsPrint:true,
      isAutoPrint:false
    }
  },
  methods:{
    ...mapActions([
      '$closeBag',
      '$clear',
      '$deselectBag',
      '$saveConfig',
      '$selectBag',
      '$deselectBag',
    ]),
    closeBag(){
      this.$closeBag({
        ppi:this.selected,
        wpi:Object.keys(this.selectedBag.wpi),
        weight:this.weight,
        sendmeth:this.sendmeth}).then(()=>{
          this.tabIndex = 2
           if(this.isAutoPrint) this.print();
        });
    },
    removeWpi(k){

      //if(confirm("Удалить ШПИ "+k+" из мешка ?")){
        console.log('deleted',k,this.selectedBag.wpi[k]);
        Vue.delete(this.selectedBag.wpi,k);
        this.$forceUpdate(); // TODO SuperBug, Why we need this ?

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
        } else if(this.tabIndex == 2){
          this.clear();
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
      this.$saveConfig();
    },
    clear(){
      this.$deselectBag();
      this.$emit('close');
    },
    print(){
      if(this.isWindowsPrint){
        window.print();
      } else {
        var text = document.getElementById('bagPrintData').innerText;
          text = cyr().transform(text);
          text = text.replace('қ','k')
          $leds.printbag(text);
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
  
input.inline
  border none
  border-bottom 1px dashed #ccc
  font inherit
  -webkit-appearance: none
  background-color inherit
  
  &[disabled]
    border-bottom-color transparent
    

@media print
  body *
    visibility hidden
    padding 0
    margin 0
    
  
  #printSection, #printSection *
    visibility visible !important
    
  .modal-dialog
    margin 0 !important
    border 1px solid #000
    width 1024px  !important
    
  .modal-lg
    width 100% !important
    
  
  #printSection
    visibility visible !important
    position absolute
    left 0
    top 0
    width 1024px  !important
    
  
</style>
