<template lang="pug">
b-modal#settings(title="Настройки LED" lazy hide-header centered @ok="save" ok-title="Сохранить")
  b-form(v-if="settings")
    b-card(no-body)
      b-card-header
        b-link.close(@click="close") &times;
        b-card-title Настройки
      b-tabs(card)
        b-tab(title="Стелаж" active)
          b-form-group(label="Кол-во LED" horizontal)
            b-input-group
              b-form-input(v-model="settings.size")
              b-input-group-append
                b-btn(@click="$initBags") Инициализировать
          b-form-group(label="Кол-во LED" horizontal)
            b-button-group
              b-btn(@click="settings.size = 24") 24
              b-btn(@click="settings.size = 48") 48
              b-btn(@click="settings.size = 72") 72
        b-tab(title="Мультитор")
          b-form-group(label="URL ПУС Сервиса" horizontal)
            b-form-input(v-model="settings.apiUrl")
          b-form-group(label="URL Led Сервиса" horizontal)
            b-form-input(v-model="settings.ledUrl")
          b-form-group(label="IP Leds" horizontal)
            template(v-for="(n,i) in settings.leds")
              b-input-group.mb-2(:prepend="''+i")
                b-form-input(v-model="settings.leds[i]")
          b-form-group(label="MQTT Broker" horizontal)
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
        b-tab(title="Интервалы")
          b-form-group(label="ШПИ Вложение" horizontal)
            b-form-input(v-model="settings.bindscan")
          b-form-group(label="Bind Scan" horizontal)
            b-form-input(v-model="settings.bindscan")
          b-form-group(label="MockDelayResponse" horizontal)
            b-form-checkbox(v-model="settings.mockdelay")
    
</template>

<script>

import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'MultiLedModal',
  data () {
    return {
      test:null,
    }
  },
  computed:{
    ...mapGetters({
        settings: 'getSettingsSelected',
    })
  },
  methods:{
    ...mapActions([
      '$save',
      '$initBags',
      '$initSettings'
    ]),
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
