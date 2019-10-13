<template lang="pug">
b-modal#msortplan(ref="msortplan" visible title="Сортплан" size="lg" hide-footer)
    template(slot="modal-header") 
      b-form-group.mx-4.mt-3
        b-input-group(size="lg")
          b-input-group-text(slot="prepend") 
            template(v-if="sortplan") {{sortplan.length}}шт
          b-form-input#inputPlan(:state="error==null?null:false" v-model="depcodeManual" @keyup.enter.native="fetch(depcode)" :placeholder="'Код продразделения ' + depcodeDefault")
          b-input-group-append
            b-btn(variant="primary" @click="fillBags({plan:sortplan})") Загрузить
            b-btn( @click="print()") Печать
          b-form-invalid-feedback#inputPlan {{error?error.message:null}}

    #printSection.mx-4.mb-4(v-if="sortplan")
      h4 Сортплан {{depcode}}
      b-card-group.sortplan(deck)
        b-card(align="center" no-body v-for="e in sortplan" :key="e.techindex")
          template(slot="header") 
            //- span(v-if="e[0] != e[1]") {{e[1]}} 
            b {{e.techindex}} {{e.nameRu}}
          .barcode {{encode('p'+e.techindex)}}

      h4 Пользователи
      b-card-group.users(deck v-if="config && config.users")
        b-card(align="center" no-body v-for="u in config.users" :key="u")
          template(slot="header") 
            b {{u}}
          .barcode {{encode('u'+u)}}
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
        depcodeDefault: 'getAutoDepcode',
        config:'config'
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
    fillBags(sortplan){
      if(confirm()) { 
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
  
.sortplan,.users
  .card
    flex 0 0 auto !important
    width 9rem !important
    margin 0.1rem !important
    
    .barcode
      font-family 'code128' !important
      
.users
  .card
    width 13rem !important

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
        
  .users
    .card
      width 30rem !important
      margin 0.01rem
      // margin-right 10rem
        
      .barcode
        font-family 'code128' !important
        font-size 44px  !important
      
</style>
