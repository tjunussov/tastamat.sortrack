<template lang="pug">
.row
  .col-sm-11
    h1 Сортплан

    b-form.mt-3(@submit.prevent="bindBag(formInput); formInput=''")
      b-form-group(label="Индекс/Мешок" horizontal)
        b-form-input(v-model="formInput" :disabled="!isBindWizardStarted")
    b-row
      b-col
        h3 Полки 
          b-btn-group
            b-btn(size="sm" @click="bindWizardToggle" v-bind:class="{'btn-info':isBindWizardStarted}") Калибровка
            b-btn(size="sm" variant="danger" @click="clearDemo") Clear Demo
          b-btn-group.float-right
            b-btn(size="sm" @click="printSortplan") Распечатать
            b-btn(size="sm" @click="fetchSortplan") Обновить

          
        b-card-group.polkas(deck)
          b-card(v-for="(value,i) in settings.destinations" :key="i" variant="primary" :bg-variant="bagLed == i?'danger':''" :text-variant="bagLed == i?'white':''" @click="bindBagByIndex(i)" @contextmenu="deleteBag(i,value)" align="center" no-body)
            b-card-header {{(value?''+value:'Empty')}}
              b-btn.close(@click.stop="editBag(value,i)") +
            b-card-body
              h4.card-title {{(''+(i+1))}}
              


  b-modal(ref="myModalRef" @close="bagIndex = null" no-fade header-bg-variant="primary" header-text-variant="white" ok-title="Сохранить" cancel-title="Отмена")
    template(slot="modal-title" v-if="bagIndex !== null")
      | Мешок 1 опорный индекс 1000 
      //- {{showBagInfo.leds}} - {{bagCounts[showBagInfo.leds]}} шт - Индекс {{showBagInfo.toIndex}}
    template(v-if="bagIndex !== null")
      h4 Индексы 
      b-form.mt-3(@submit.prevent="bindBag(formInput); formInput=''")
        b-form-group(label="Опорный Индекс")
          b-form-input(v-model="formInput" :disabled="!isBindWizardStarted")
      table.table.b-table.mt-4
        tr(v-for="(v,k) in sortplan[bagIndex]")
          td {{v}}
    
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import {$http,$leds} from '@/store/api/http'

export default {
  name: 'Sortplan',
  computed:{
    ...mapGetters({
        settings: 'getSettingsSelected',
    })
  },
  mounted(){
    this.$bus.$on('keyboard:keydown:enter',this.bindBag);
    this.$bus.$on('keyboard:keydown:enter:SETUP',this.bindWizardToggle);
    // this.$bus.$on('keyboard:keydown:enter:d',this.bindWizardBybarcode);
    // this.$bus.$on('keyboard:keydown:enter:p',this.togglePolka);
  },
  beforeDestroy(){
    this.$bus.$off('keyboard:keydown:enter',this.bindBag);
    this.$bus.$off('keyboard:keydown:enter:SETUP',this.bindWizardToggle);
    // this.$bus.$off('keyboard:keydown:enter:d',this.bindWizardBybarcode);
    // this.$bus.$off('keyboard:keydown:enter:p',this.togglePolka);
  },
  data () {
    return {
      formInput:null,
      plan:null,
      bagIndex:null,
      bagLed:null,
      isBindWizardStarted:false,
      isBindWizardStartedbindBagByIndex:false,
      tmBindWizard:null,
      registerBagClickedNo:0,
      sortplan:{}
    }
  },
  methods:{
    ...mapActions([
      'settingsUpdate',
    ]),
    editBag(index,value){
      console.log('editBag',index);
      this.bagIndex = index;
      this.$refs.myModalRef.show()
    },

    deleteBag(key,value){
      console.log('deleteBag',key,value);
      Vue.delete(this.settings.destinations,key)
      this.settingsUpdate(this.settings)
      this.$deletePoint(value);
    },
    bindWizardToggle(){
      this.isBindWizardStarted = !this.isBindWizardStarted;
      console.log('isBindWizardStarted',this.isBindWizardStarted);

      if(this.isBindWizardStarted){
        this.$bindStart()
        this.autoStopWizard(10000);
        window.setTimeout(()=>{
          this.bagLed = 0; // statring again from 0
          this.$bind(this.bagLed)
        },1500)
        
      } else {
        this.autoStopWizard(100)
      }
    },    
    bindBagByIndex(bagLed){
      console.log('bindBagByIndex',bagLed);
      this.isBindWizardStarted = true;
      this.isBindWizardStartedbindBagByIndex = true;
      this.bagLed = bagLed;
      this.$bind(this.bagLed)
      this.autoStopWizard(10000);
    },
    bindBag(bagIndex){
      console.log('bindBag',bagIndex);

      if(this.isBindWizardStarted){
        console.log('bindBag',bagIndex);
        this.bagIndex = bagIndex;
        this.settings.destinations[this.bagLed] = this.bagIndex;

        if(this.isBindWizardStartedbindBagByIndex){
          this.autoStopWizard(500);
        } else {
          this.bagLed++;
          this.$bind(this.bagLed)
          this.autoStopWizard();
        }
      } else {
        // alert('Нажмите калибровку!')
        this.bindWizardToggle();
      }
    },
    autoStopWizard(tm){
      window.clearTimeout(this.tmBindWizard);
      this.tmBindWizard = window.setTimeout(()=>{
        console.log('autoStopWizard');
        this.isBindWizardStarted = false;
        this.isBindWizardStartedbindBagByIndex = false;
        this.bagLed = null
        this.formInput = null
        this.$bindEnd()
      },tm||5000);
    },
    fetchSortplan(){
      console.log('fetchSortplan');
    },
    printSortplan(){
      console.log('printSortplan');
    },
    clearDemo(){
      console.log('clearDemo');
      this.settings.destinations = new Array(this.settings.destinations.length)
      this.settingsUpdate(this.settings)
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">

.card
    flex 0 0 auto !important
    width 5rem  !important
    height 6rem !important
    margin 0.1rem !important
    
  .card-body, .card-header
      padding 0.5rem  !important
      overflow hidden  !important

</style>
