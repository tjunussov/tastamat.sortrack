<template lang="pug">
.row
  .col-12
    h1 Настройки

    b-form.mt-3
      b-form-group(label="Кол-во LED" horizontal)
          b-form-input(v-model="settings.size")
      b-form-group(label="Bind Scan" horizontal)
          b-form-input(v-model="settings.bindscan")
      b-form-group(label="MockDelayResponse" horizontal)
          b-form-checkbox(v-model="settings.mockdelay")
      b-form-group(label="Error Simulate" horizontal)
          b-form-checkbox(v-model="settings.demoerror")
      b-form-group(label="IP Device" horizontal)
        b-form-input(v-model="deviceip")
      b-form-group(label="URL Сервиса" horizontal)
        b-form-input(v-model="apiUrl")
      b-form-group(label="User" horizontal)
        b-btn(@click="toggleUser") Toggle User
      b-form-group(label="Point" horizontal)
        b-btn(@click="togglePoint") Toggle Point
      b-form-group(label="Printer" horizontal)
        b-btn(@click="testPrint") Test
      b-form-group(label="" horizontal)
        b-btn(@click="saveSettings" variant="primary") Save

        


</template>

<script>

import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import {$leds,deviceURL,baseURL} from '@/store/api/http'


export default {
  name: 'Settings',
  mounted(){
    this.deviceip = deviceURL;
    this.apiUrl = baseURL;
  },
  data () {
    return {
      // maxLeds: 24,
      deviceip:null,
      apiUrl:null
    }
  },
  computed:{
    ...mapGetters({
        settings: 'getSettingsSelected',
    })
  },
  methods:{
    ...mapActions([
      'settingsUpdate',
      '$initBags'
    ]),
    saveSettings(){
      localStorage.setItem('deviceip',this.deviceip);
      localStorage.setItem('apiUrl',this.apiUrl);

      this.settings.deviceip = this.deviceip
      this.settings.apiUrl = this.apiUrl
      // this.settings.maxLeds = this.maxLeds


      this.$initBags().then(()=>{
        console.log('settgins updated');
        this.settingsUpdate(this.settings)
      });

      // location.reload();
    },
    publishOn(){
      $leds.$ledOn(this.cmd)
      console.log('publish',this.cmd);
    },
    toggleUser(){
      var users = ['ASEM','TIMUR','NATALYA']
      this.$bus.$emit('keyboard:keydown:enter:u',users[Math.floor(Math.random()*3)]);
    },
    togglePoint(){
      var users = ['220081','320080']
      this.$bus.$emit('keyboard:keydown:enter:i',users[Math.floor(Math.random()*2)]);
    },
    testPrint(){

    }
  }
}
</script>

<style scoped lang="stylus">

</style>
