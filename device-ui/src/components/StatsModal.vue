<template lang="pug">
div
  h5 Кол-во посылок {{user.name}} 
  b-card(no-body)
    b-progress(:value="stats" :max="max" variant="success" show-value)
    b-progress(:value="errors" :max="max" variant="danger" show-value)

</template>

<script>

import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'StatsModal',
  data () {
    return {
      // maxLeds: 24,
      max:100,
    }
  },
  computed:{
    ...mapGetters({
        bags: 'getBags',
        lastBag: 'getLastBag',
        user: 'getUser'
    }),
    stats(){
      return this.bags.reduce(function (sum, bag) {
        if(bag.isErrorBag) return sum;
        return sum + Object.keys(bag.wpi).length;
      }, 0);
    },
    errors(){
      return Object.keys(this.lastBag.wpi).length;
    }
  },
  methods:{
    ...mapActions([
      'settingsUpdate',
    ]),
  }
}
</script>

<style scoped lang="stylus">

 .barcode
    font-family 'code128' !important
    font-size 22px  !important

</style>
