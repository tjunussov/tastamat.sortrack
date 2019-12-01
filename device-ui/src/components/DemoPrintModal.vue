<template lang="pug">
#printSection.demoprint.px-4

  h5 Пользователи
  b-card-group.users(deck)
    b-card(align="center" no-body v-for="u in config.users" :key="u")
      template(slot="header") 
        b {{u}}
      .barcode {{encode('u'+u)}}

  h5.mt-3 Тестовые Ящики
  b-card-group.crates(deck)
    b-card(align="center" no-body v-for="b in crates" :key="b")
      template(slot="header") 
        b {{b}}
      .barcode {{encode('c'+b)}}

  h5.mt-3 Технологические индекс
  b-card-group.techindexes(deck)
    b-card(align="center" no-body v-for="t in techIndexes" :key="t")
      template(slot="header") 
        b {{t}}
      .barcode {{encode('t'+t)}}

  h5.mt-3 Тестовые РПО
  b-card-group.rpos(deck)
    b-card(align="center" no-body v-for="b in demoBarcodes" :key="b")
      template(slot="header") 
        b {{b}}
      .barcode {{encode(b)}}

  h5.mt-3 Полки
  b-card-group.polka(deck)
    b-card(align="center" no-body v-for="i in 24" :key="i")
      template(slot="header") 
        b {{'#'+i}}
      .barcode {{encode('p#'+(i-1))}}


</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import Encoder from 'code-128-encoder'
var code128= new Encoder()
import {$smartsort,$http,$leds} from '@/store/api/http'

export default {
  name: 'DemoPrintModal',
  computed:{
    ...mapGetters({
        depcode: 'getDepcode',
        config:'config',
        demoBarcodes:'getDemoBarcodes'
    }),
  },
  created(){
    this.$fetchDemoRPO();
  },
  data () {
    return {
      depcodeManual:null,
      status: null,
      error:null,
      techIndexes:['055990','220081'],
      crates:['220081.001','220081.002']
    }
  },
  methods:{
    ...mapActions([
      '$fetchDemoRPO'
    ]),
    encode(val){
      return code128.encode(val)
    },
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
