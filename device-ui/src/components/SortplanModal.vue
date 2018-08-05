<template lang="pug">
b-modal#msortplan(ref="msortplan" title="Сортплан" size="lg" hide-footer)
    template(slot="modal-header") 
      b-form-group.mx-4.mt-3
        b-input-group(size="lg")
          b-input-group-text(slot="prepend") 
            template(v-if="sortplan") {{Object.keys(sortplan.plan).length}}шт
          b-form-input#inputPlan(:state="error==null?null:false" v-model="depcodeManual" @keyup.enter.native="fetch(depcode)" :placeholder="'Код продразделения ' + depcodeDefault")
          b-input-group-append
            b-btn(variant="primary" @click="$fillBags({plan:sortplan.plan})") Загрузить
            b-btn( @click="print()") Печать
          b-form-invalid-feedback#inputPlan {{error?error.message:null}}

    #printSection.mx-4.mb-4(v-if="sortplan")
      h4 Сортплан {{depcode}}
      b-card-group.sortplan(deck)
        b-card(align="center" no-body v-for="(e) in Object.entries(sortplan.plan)" :key="e[0]")
          template(slot="header") {{e[1]}} 
            b {{e[0]}}
          .barcode {{encode('p'+e[1])}}
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
        depcodeDefault: 'getAutoDepcode'
    }),
    depcode(){
      return this.depcodeManual?this.depcodeManual:this.depcodeDefault;
    }
  },
  created(){

    this.fetch(this.depcodeDefault);
  },
  data () {
    return {
      depcodeManual:null,
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
    fetch(depcode){

      this.status = 'loading'
      this.error = null

      this.$fetchSortplan({depcode}).then((r)=>{
        this.status = r
      }).catch((e)=>{
        this.error = e
      });
    },
    print(){
      window.print();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">


#msortplan
  .modal-dialog
    max-width 960px !important
  
.sortplan
  .card
    flex 0 0 auto
    width 9rem
    margin 0.1rem
    
    .barcode
      font-family 'code128'

</style>
<style lang="stylus">

@media print
  body *
    visibility hidden
    padding 0
    margin 0
    
  
  #printSection, #printSection *
    visibility visible !important
    
  .modal-dialog
    margin 0 !important
    border 1px solid #000
    width 1024px  !important
    
  .modal-lg
    width 100% !important
    
  
  #printSection
    visibility visible !important
    position absolute
    left 0
    top 0
    width 1024px  !important
    
  .sortplan
    .card
      width 15.8rem !important
      margin 0.01rem
      // margin-right 10rem
        
      .barcode
        font-family 'code128' !important
        font-size 44px  !important
      
</style>
