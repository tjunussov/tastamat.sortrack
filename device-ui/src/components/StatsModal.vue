<template lang="pug">
div
  h5 Кол-во посылок {{user.name}} 
  b-card(no-body)
    b-progress(:value="stats" :max="max" variant="success" show-value)

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
        user: 'getUser'
    }),
    stats(){
      return this.bags.reduce(function (sum, bag) {
        return sum + Object.keys(bag.wpi).length;
      }, 0);
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
