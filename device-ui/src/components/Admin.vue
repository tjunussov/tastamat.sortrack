<template lang="pug">
b-row.flex-xl-nowrap2
  b-col(md="3" xl="2" cols="12").bd-sidebar
    .bd-search.d-flex.align-items-center
      b-form-input#bd-search-input(placeholder="Поиск посылок ..." v-model="barcode" v-focus="")
    nav#bd-docs-nav.bd-links.navbar-collapse
      //- .bd-toc-item.active
      //-   b-link.bd-toc-link(to='/console') Консоль
      //-   ul.bd-sidenav.nav
      .bd-toc-item
        a.bd-toc-link(disabled href='/admin/settings') Статистика
        ul.bd-sidenav.nav
      .bd-toc-item.active
        b-link.bd-toc-link(to='/admin/sortplan') Сортплан
        //- ul.bd-sidenav.nav
        //-   li.nav-item
        //-     a.nav-link(disabled href='/docs/components/alert', target='_self') Грузы
      //- .bd-toc-item
      //-   a.bd-toc-link(disabled href='/docs/reference/') Емкости
      //-   ul.bd-sidenav.nav
      //-     li.nav-item
      //-       a.nav-link(disabled href='/docs/reference/color-variants', target='_self') Справочники
      .bd-toc-item
        b-link.bd-toc-link(to='/admin/settings') Настройки
      .bd-toc-item
        b-link.bd-toc-link(to='/admin/debug') Debug

  .pt-4.pb-md-3.pl-md-5.bd-content.col-md-9.col-xl-8.col-12
    router-view


</template>

<script>

export default {
  name: 'Admin',
  mounted(){
    this.$bus.$on('keyboard:keydown:enter:13',this.barcodeToggle);
  },
  beforeDestroy(){
    this.$bus.$off('keyboard:keydown:enter:13',this.barcodeToggle);
  },
  data () {
    return {
      barcode:''
    }
  },
  methods:{
    barcodeToggle(value){
      this.barcode = value
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
