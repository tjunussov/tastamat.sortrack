<template lang="pug">
.row
  .col-sm-7
    h1 Настройки

    b-form.mt-3
      b-form-group(label="Color")
        b-input-group()
          b-form-input(v-model="cmd.color")
          b-input-group-append
            b-btn(variant="outline-info" @click="cmd.color='ff0000'") Red
            b-btn(variant="outline-info" @click="cmd.color='00ff00'") Green
            b-btn(variant="outline-info" @click="cmd.color='0000ff'") Blue
            b-btn(variant="outline-info" @click="cmd.color='ff5500'") Yellow
            b-btn(variant="outline-info" @click="cmd.color='ffffff'") White
      b-form-group()
        b-form-input(type="range" min="0" max="255" v-model="ui.r")
        b-form-input(type="range" min="0" max="255" v-model="ui.g")
        b-form-input(type="range" min="0" max="255" v-model="ui.b")
      b-form-group(label="Duration")
        b-input-group(:append="''+cmd.duration")
          b-form-input(type="range" min="10" max="10000" v-model="cmd.duration")
      b-form-group(label="Repeat")
        b-input-group(:append="''+cmd.repeat")
          b-form-input(type="range" min="1" max="100" v-model="cmd.repeat")
      b-form-group(label="Pause")
        b-input-group(:append="''+ui.isPause?cmd.pause:cmd.duration")
          b-input-group-prepend
            b-form-checkbox(v-model="ui.isPause")  
          b-form-input(type="range" min="10" :disabled="!ui.isPause" max="10000" v-model="cmd.pause")
      b-form-group(label="LED")
        b-form-checkbox(v-model="ui.isAll") All leds
        b-form-select(multiple v-model="cmd.led" :options="[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]")
      

    hr.my-4/

    b-form.mt-3
      b-form-group(label="PUT timeout")
        b-form-input(v-model="putTimeout")
      b-form-group(label="PUT blink interval")
        b-form-input(v-model="putBlinkInterval")
      b-form-group(label="SAVE timeout")
        b-form-input(v-model="saveTimeout")
      b-form-group(label="ERROR timeout")
        b-form-input(v-model="errorTimeout")
      b-form-group(label="Яркость поиска")
        b-form-input(v-model="searchBrightness")

  .col-sm-3
    pre {{cmd}}
    b-form-group
        b-button(@click="publishOn") On
        b-button(@click="$ledOff" variant="outline-info") Off

</template>

<script>

import {mqttLEDMixin} from '@/store/api/mqtt'


export default {
  name: 'Settings',
  mixins: [ mqttLEDMixin ],
  data () {
    return {
      putTimeout: 5000,
      saveTimeout: 5000,
      errorTimeout: 1000,
      putBlinkInterval: 500,
      searchBrightness: 100,
      ui:{
        r:255,
        g:0,
        b:0,
        isPause:false,
        isAll:false,
      },
      cmd:{
        color:'ff0000',
        duration:200,
        repeat:10,
        led:['1'],
      }
    }
  },
  watch:{
    'ui.isAll'(value){
      value ? this.cmd.led = ['all'] : this.cmd.led = [1]

    }
  },
  methods:{
    publishOn(){
      this.$ledOn(this.cmd)
      console.log('publish',this.cmd);
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
