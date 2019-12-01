<template lang="pug">
b-modal#mclosebag(size="" scrollable centered no-close-on-backdrop no-fade @hide="clear" visible ref="closeModalAvarRef")


    template(slot="modal-header") 
      b-card.w-100(no-body)
        b-card-header
          b-link.close(@click.stop="clear") &times;
          b-card-title 
            i.fa.fa-inbox.mr-2(:class="{'text-success':isEditing}" @click="isEditing=!isEditing")
            b-badge.circle(v-if="count" pill variant="success") {{count}}
            | Аварийный ящик

    b-card(no-body)

      b-list-group(v-if="count && !response" style="min-height:300px;" flush)
        b-list-group-item.flex-column.align-items-start(v-for="(v,k, n) in selectedBag.wpi" :key="k")
          .d-flex.w-100.justify-content-between
            h5(@click="removeWpi(k)") {{k}}   &times;
            small {{v.postIndex}}

          //- p.text-muted.mb-1(:title="JSON.stringify(v)") {{v.mailInfo.toFullName}}
    template(slot="modal-footer") 
        b-btn(variant="danger" block size="lg" @click="clearBag")
          i.fa.fa-lock.mr-2
          | Очистить
  
  
   
      
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import {$leds} from '@/store/api/http'
import cyr from 'cyrillic-to-translit-js'
import Encoder from 'code-128-encoder'
var code128= new Encoder()



export default {
  name: 'CloseModalAvar',
  props: ['isCloseModalAvarOpen'],
  computed:{
    ...mapGetters({
        response: 'getCloseResponse',
        selected:'getSelected',
        config:'getConfig',
        error: 'getError',
        selectedBag:'getSelectedBag',
        bags: 'getBags',
        cursor: 'cursor',
    }),
    count(){
      return Object.keys(this.selectedBag.wpi).length;
    }
  },
  data () {
    return {
      isEditing:false,
    }
  },
  methods:{
    ...mapActions([
      '$closeBag',
      '$clear',
      '$deselectBag',
      '$save',
      '$selectBag',
      '$deselectBag',
    ]),
    clearBag(){
      Vue.set(this.selectedBag,'wpi',{});
      this.$save();
      this.clear();
    },
    removeWpi(k){

      //if(confirm("Удалить ШПИ "+k+" из мешка ?")){
        console.log('deleted',k,this.selectedBag.wpi[k]);
        
        if(confirm('Вы уверены что хотите удалить ' + k)) {
          Vue.delete(this.selectedBag.wpi,k);
          this.$forceUpdate(); // TODO SuperBug, Why we need this ?
        }
    },
    clear(){
      this.$deselectBag();
      this.$emit('close');
    },
  }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">


  
</style>
