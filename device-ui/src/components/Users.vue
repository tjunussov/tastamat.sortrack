<template lang="pug">
.row
  .col-12
    h1 Пользователи

    table.table
      tr(v-for="(u,i) in settings.users")
        td {{i+1}}
        td: b-form-input(v-model="settings.users[i]")
        td.barcode {{encode('u'+u)}}
        td: b-link(@click="settings.users.splice(i,1)") Удалить
      tr
        td
        td: b-button(@click="settings.users.push('')") Добавить
        td

</template>

<script>

import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import Encoder from 'code-128-encoder'
var code128= new Encoder()

export default {
  name: 'Users',
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
    ]),
    saveSettings(){    
      console.log('settgins updated');
      this.settingsUpdate(this.settings)
    },
    encode(val){
      return code128.encode(val)
    },
  }
}
</script>

<style scoped lang="stylus">

 .barcode
    font-family 'code128' !important
    font-size 22px  !important

</style>
