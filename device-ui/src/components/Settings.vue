<template lang="pug">
.row
  .col-sm-7
    h1 Настройки

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

</template>

<script>
export default {
  name: 'Settings',
  data () {
    return {
      putTimeout: 5000,
      saveTimeout: 5000,
      errorTimeout: 1000,
      putBlinkInterval: 500,
      searchBrightness: 100
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
