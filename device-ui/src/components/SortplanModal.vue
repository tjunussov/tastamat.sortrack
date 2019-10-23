<template lang="pug">
b-modal#msortplan(v-if="sortplan" ref="msortplan" header-bg-variant="primary" header-text-variant="white" visible scrollable ok-title="Печать" ok-only title="Сортплан" size="lg")
    template(slot="modal-title") Сортплан для Индекса {{depcode}} 
      span кол-во направлений {{sortplan.length}}
        
    template(slot="modal-footer") 
      b-btn(:variant="config.size < sortplan.length?'danger':'primary'" @click="fillBags({plan:sortplan})") Установить
      b-btn( @click="$print") Печать


    b-alert(:show="config.size < sortplan.length" variant="danger")
      | ВНИМАНИЕ! В стелаже {{config.size}} ячеек, нехватает еще {{sortplan.length - config.size }} ячеек

    #printSection.mx-4.mb-4.text-center
      b-card-group.sortplan(deck)
        b-card(align="center" no-body v-for="e in sortplan" :key="e.techindex")
          template(slot="header") 
            //- span(v-if="e[0] != e[1]") {{e[1]}} 
            b {{e.techindex}} 
            div {{e.nameRu}}
          .barcode {{encode('p'+e.techindex)}}

</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import Encoder from 'code-128-encoder'
var code128= new Encoder()

export default {
  name: 'SortplanModal',
  computed:{
    ...mapGetters({
        sortplan: 'getSortplan',
        depcode: 'getDepcode',
        config:'config'
    })
  },
  created(){
    this.fetch(this.depcode);
  },
  data () {
    return {
      status: null,
      error:null,
    }
  },
  methods:{
    ...mapActions([
      '$fillBags',
      '$fetchSortplan'
    ]),
    encode(val){
      return code128.encode(val)
    },
    fillBags(sortplan){
      if(confirm("Сортплан будет изменен! Вы уверены ?")) { 
        this.$fillBags(sortplan);
        this.$emit('close');
      }
    },
    fetch(depcode){

      this.status = 'loading'
      this.error = null

      this.$fetchSortplan({depcode}).then((r)=>{
        this.status = r
      }).catch((e)=>{
        this.error = e
      });
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">


#msortplan
  .modal-dialog
    max-width 960px !important
  
.sortplan,.users
  .card
    flex 0 0 auto !important
    width 18rem !important
    margin 0.1rem !important

      
</style>
<style lang="stylus">

@media print
    
  .sortplan
    .card
      width 15.2rem !important
      margin 0.01rem
      
      .card-header
        line-height 1.2rem
</style>
