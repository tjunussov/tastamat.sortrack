<template lang="pug">
.px-1

  //- b-alert(show) Сканер правильно должен быть настроен

  b-card(no-body)
    b-card-header
      b-input-group
        b-input-group-prepend(is-text) Тест
        b-form-input.nokeyboard#input-wpi(v-model="wpi" placeholder="Штрихкод Cканера" @blur="testScanerState = null" autofocus :state="testScanerState" @keyup="testScaner")
        b-form-valid-feedback#input-wpi Успешно пройден, сканер настроен 😊!
        b-form-invalid-feedback#input-wpi У сканера не настроен ENTER

    b-card-footer   
      b-input-group
        b-input-group-prepend(is-text) Тест
        b-form-input.nokeyboard#input-weight(v-model="weight" placeholder="Электронных Весов" @blur="testWeightState = null" :state="testWeightState" @keyup="testWeight")
        b-form-valid-feedback#input-weight Успешно пройден, Весы настроены 😊!
        b-form-invalid-feedback#input-weight У Весов не настроен ENTER

  b-card(no-body).mt-2
    b-card-body
      Yarlik(:response="testYarlik")
    b-card-footer.text-center
      b-btn(@click="testPrint" variant="outline-primary") Тестовая Печать

  b-card(no-body).mt-2
    b-card-body
      b-input-group
        b-input-group-prepend(is-text) Тест LED ламп
        b-input-group-append
          b-btn(@click="testLedRoll" variant="success") Поочереди
        b-input-group-append
          b-btn(@click="testLedError" variant="danger") Все
        b-input-group-append
          b-btn(@click="testLedOff" variant="secondary") Выключить
          

  
    
</template>

<script>
import Vue from 'vue'
import Yarlik from '@/components/YarlikPrintTemplate'
import {$leds} from '@/store/api/http'

var captureTM = null;

export default {
  name: 'DiagnosticModal',
  data () {
    return {
      wpi:null,
      weight:null,
      testYarlik: {
          "result": "success",
          "labelListNo": "G2020555"+Math.ceil(Math.random()*100000),
          "actualWeight": 1050,
          "workerName": "Сана Сабыргалиева",
          "date": new Date().toString(),
          "count": 50,
          "packetListCount":50,
          "toTechindex": "050009",
          "toDepartment": "Алматы-9",
          "totalWeight": 9999,
          "fromTechindex": "055990",
          "techindex": "055990",
          "fromDepartment": "АФ АО «Казпочта» «Алматинский»",
          "route": "Наземный",
          "sendMethod": 1,
          "bagType": 1,
          "taraType": 1,
          "plombaNum": "1234567890123",
          "comment":'DEMO:Диагностика Система Умных Полок'
      },
      led:0,
      testScanerState:null,
      testWeightState:null,
    }
  },
  methods:{
    testScaner(){
      if (event.keyCode == 13 && this.wpi != "") this.testScanerState = true
      else if(this.wpi != "") this.testScanerState = false
    },
    testWeight(){
      if (event.keyCode == 13 && this.weight != "") this.testWeightState = true
      else if(this.weight != "") this.testWeightState = false
    },
    testPrint(){ window.print(); },
    testLedRoll(){
      
      this.testLedOff();
      captureTM = window.setInterval(()=>{
        $leds.push(this.led++);
      },5000)
    },
    testLedError(){
      this.testLedOff();
      $leds.error();
    },
    testLedOff(){
      this.led = 0;
      window.clearInterval(captureTM);
      $leds.$ledoff();
    },
  },
  components:{
    Yarlik
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">

  
.demoprint
  .card
    flex 0 0 auto !important
    margin 0.1rem !important
    
    .barcode
      font-size 22px !important
      
</style>
<style lang="stylus">

@media print
    
  .demoprint
    .card
      flex 0 0 auto !important
      width 15rem !important
      
      .barcode 
        padding 0.5rem
        font-size 1.5rem !important
      
    .users .card      
      width 18rem !important
      
      
      
            
</style>
