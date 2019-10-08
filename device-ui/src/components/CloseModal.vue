<template lang="pug">
b-modal#mclosebag(no-enforce-focus size="lg" no-fade @hide="clear" visible ref="closeModalRef")
    template(slot="modal-header" v-if="selectedBag") 
      b-link.close(@click.stop="clear")  &times;
      h3 Мешок {{selectedBag.ppi}} - {{selectedBag.ppn}}
    template(slot="modal-header" v-else)
       h2.modal-title.text-primary Мешок {{selected}} - {{selectedBag.ppn}}

    b-card(no-body)
      b-tabs.nav-justified.wizard(pills card v-model="tabIndex")
        b-tab
          template(slot="title") 
            span(v-b-toggle="'settings_collapse'") Содержимое 
            span(v-if="selectedBag") {{Object.keys(selectedBag.wpi).length}} шт

          table.table.b-table
            tr
              th #
              th ШПИ
              th КУДА

            tr(v-for="(v,k, n) in selectedBag.wpi")
              td {{n+1}}
              td(:title="JSON.stringify(v)") {{k}}
              //- td {{v.next.bagNo}}
              td {{v.postIndex}} {{v.postIndexTitle}}
        b-tab(title="Вес и Вид")
          b-form-group(label="Итоговый Вес" horizontal)
            b-input-group
              b-form-input(v-model="weight" autofocus="true" type="number" size="lg" required palceholder="Вес")
              b-input-group-append
                b-btn(@click="weight = 25" variant="white") Считать вес
          b-form-group(label="Вид отправки" horizontal)
            b-btn(@click="sendmeth = 2" disabled v-if="sendmeth == 1") Наземный
            b-btn(variant="primary" disabled @click="sendmeth = 1" v-else) Авия

        b-tab(title="Ярлык" :disabled="!(response && response.packetListNo)")
          code.text-primary(v-if="response && response.packetListNo")
            .mx-4
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
                span {{response.count}}
              div 
                b ОПЕРАТОР 
                span {{response.workerName}}
              div 
                b ДАТА
                span {{response.date}}

                
          code.text-danger(v-if="response && response.result == 'error'")  {{response}}
          .text-center(v-if="tabIndex == 2 && response")
            b-btn(variant="primary" @click="print") Печать
            b-btn(variant="primary" @click="window.print();") Печать Windows

    b-collapse(is-nav id="settings_collapse" v-if="selectedBag")
      b-form.my-3
        
        
        b-form-group(horizontal label="LED")
          b-input-group
            b-form-input(:placeholder="cursor+''" v-model="selectedBag.led")
            b-input-group-append
              b-btn(variant="primary" @click="$testLed(selectedBag.led?selectedBag.led:cursor)") Тест
        b-form-group(horizontal label="INDEX")
          b-form-input(v-model="selectedBag.ppi")
        b-form-group(horizontal)
          b-btn(@click="$saveConfig") Save

    template(slot="modal-footer")
      b-link(@click="$bus.$emit('keyboard:keydown:enter:p',selected)" size="sm") Scan Selected 
      //- b-link(@click="$bus.$emit('keyboard:keydown:enter:p',Object.keys(bags)[1])" size="sm") Scan Bag 2
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
        bags: 'getBags',
        cursor: 'cursor',
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
        ppi:this.selected,
        wpi:Object.keys(this.selectedBag.wpi),
        weight:this.weight,
        sendmeth:this.sendmeth}).then(()=>{
          this.tabIndex = 2
          this.print();
        });
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
</style>
