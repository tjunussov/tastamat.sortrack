<template lang="pug">
b-modal#settings(title="Настройки LED" size="md" lazy hide-header centered @ok="save" ok-title="Сохранить")
  b-form(v-if="settings")
    b-card(no-body)
      b-card-header
        b-link.close(@click="close") &times;
        b-card-title Настройки
      b-tabs(card)
        b-tab(title="Мультитор" active)
          b-form-group(label="Кол-во Ячеек" horizontal)
            b-button-group(block)
              b-btn(@click="settings.size = 24; $initBags()" :variant="settings.size == 24 ? 'primary':''") 24
              b-btn(@click="settings.size = 48; $initBags()" :variant="settings.size == 48 ? 'primary':''") 48
              b-btn(@click="settings.size = 72; $initBags()" :variant="settings.size == 72 ? 'primary':''") 72
              b-btn(@click="settings.size = 96; $initBags()" :variant="settings.size == 96 ? 'primary':''") 96
          b-form-group(label="MultiLED IP" horizontal)
            template(v-for="(n,i) in settings.leds")
              b-input-group.mb-2(:prepend="''+i")
                b-form-input(v-model="settings.leds[i]")
        b-tab(title="Сервер")
          b-form-group(label="URL ПУС Сервиса" horizontal)
            b-form-input(readonly v-model="settings.apiUrl")
          b-form-group(label="WS Server" horizontal)
             b-input-group
              b-form-input(v-model="settings.broker")
              b-input-group-append
                b-btn(@click="") Подключить
        b-tab(title="Принтер" )
          b-form-group(label="IP Printer" horizontal)
            b-form-input(v-model="settings.printer")
          b-form-group(label="isWindowsPrint" horizontal)
            b-form-checkbox(v-model="settings.isWindowsPrint")
          b-form-group(label="isAutoPrint" horizontal)
            b-form-checkbox(v-model="settings.isAutoPrint")
          b-form-group(label="isPrintProxy" horizontal)
            b-form-checkbox(v-model="settings.isPrintProxy")
        b-tab(title="Tweaks")
          b-card(bg-variant="light" title="Timeouts") 
            b-form-group(label="ШПИ Вложение" horizontal)
              b-form-input(v-model="settings.bindscan")
            b-form-group(label="Bind Scan" horizontal)
              b-form-input(v-model="settings.bindscan")
            b-form-group(label="MockDelayResponse" horizontal)
              b-form-checkbox(v-model="settings.mockdelay")
          b-card(bg-variant="light" title="Sounds") 
            b-form-group(label="Поиск" horizontal)
              input(type="range" name="volume" min="0" max="100")
            b-form-group(label="ШПИ" horizontal)
              input(type="range" name="volume" min="0" max="100")
            b-form-group(label="Открыть мешок" horizontal)
              input(type="range" name="volume" min="0" max="100")
        b-tab
          template(slot="title")
            i.fa.fa-bug.mr-2
          b-form-group(label="NO LED" horizontal)
            b-form-checkbox(:checked="!ledOn" @change="togleLed()")
          b-form-group(label="Demo" horizontal)
            b-form-checkbox(:checked="demo" @change="togleDemo()")
          b-form-group(label="Dark" horizontal)
            b-form-checkbox(:checked="isDark" @change="togleDark()")
    
</template>

<script>

import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SettingsModal',
  data () {
    return {
      test:null,
    }
  },
  computed:{
    ...mapGetters({
        settings: 'getSettingsSelected',
        ledOn: 'getLedOn',
        demo: 'getDemo',
    }),
    isDark(){
      return this.$root.isDark
    },
  },
  methods:{
    ...mapActions([
      '$save',
      '$initBags',
      '$initSettings',
      '$togleDemo',
      '$togleLed',
    ]),
    togleDemo(val){
      console.log('togleDemo',val);
      this.$togleDemo({val}).then(()=>{
        if(val === undefined){
           // location.reload();
        }
        if(!this.demo) {
          mock.restore();
        }
      });

    },
    togleLed(val){
      this.$togleLed({val});
      console.log('togleLed',this.ledOn);

      // if(this.ledOn) {
      //   mockDevice.restore();
      // }
    },
    togleDark(){
      const el = document.body;
      this.$root.isDark = !this.$root.isDark;



      if (this.$root.isDark) {
        el.classList.add("dark");
      } else {
        el.classList.remove("dark");
      }
    },
    close(){
      this.$root.$emit('bv::hide::modal', 'settings', '')
    },
    save(){
      this.$initSettings();
      this.$save();
    }
  }
}
</script>

<style lang="stylus">

#multiled
  .modal-dialog
    max-width 550px !important
    

</style>
