<template lang="pug">
.row
  .col-12.badges
    b-card-group#printSection(deck)
      b-card.mb-2(align="center" no-body v-for="(u,i) in settings.users" :key="i")
        template(slot="header") 
          b-form-input.inline(v-model="settings.users[i]")
          //- b-link(@click="settings.users.splice(i,1)")  &times;
        .barcode {{encode('u'+u)}}
        b-card-footer
          img(src="static/logo2.svg" width="200" height="40")/

    b-btn(@click="settings.users.push('')" block  variant="outline-secondary") Добавить

</template>

<script>

import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import Encoder from 'code-128-encoder'
var code128= new Encoder()

export default {
  name: 'Badges',
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
    encode(val){
      return code128.encode(val)
    },
  }
}
</script>

<style lang="stylus">

#badge
  .modal-dialog
    max-width 550px !important
    
  .badges
    .card .inline
      font-weight bold !important
      text-align center
      
    .card
      flex 0 0 auto !important
      width 30rem
      
      .card-footer
        display none


</style>
<style lang="stylus">

@media print
    
  .badges
    .card
      flex 0 0 auto !important
      border 2px solid #000
      width 90mm !important
      height 60mm
      
      .inline
        border none
        background transparent
        color #fff !important
        
      .card-footer, .card-header
        background-color black
        display block !important
        
        
      .barcode 
        padding 1.5rem 0rem
        font-size 2rem !important
      
      
      
            
</style>