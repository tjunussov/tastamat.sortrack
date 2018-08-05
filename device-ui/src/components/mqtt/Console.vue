<template lang="pug">
.row
  .col-sm-7
    h1 Консоль

    b-form().mt-3
      b-form-group(label="Отделение" horizontal)
        b-form-input(v-model="point" :state="point !== null" readonly)
      b-form-group(label="Пользователь" horizontal)
        b-form-input(v-model="user" :state="user !== null" readonly)
      b-form-group(label="Полки" horizontal)
        b-input-group
          b-form-input(v-model="polka" :state="polka !== null" readonly)
          b-input-group-append
            b-btn Привязать
      b-form-group(label="Направление" horizontal)
        b-form-input(v-model="destination" readonly)

    b-row
      b-col
        table.table.b-table.table-bordered
          tr(v-for="(key,value) in polkas" v-bind:class="{selected:toPolka == key}") 
            td {{key}}
            td {{value}}
      b-col
        table.table.b-table.table-bordered
          tr(v-for="(key,value) in destinations" v-bind:class="{selected:toDestination == value}")
            td {{key}} 
            td {{value}}

    hr.my-5/

  //-   hr
  //-   fieldset(:disabled="inprogress" class="result")
  //-     .form-group.row
  //-       label.col-sm-2.col-form-label.text-right No
  //-       b-input-group.col-sm-4(prepend="545")
  //-         b-form-input
  //-       label.col-sm-1.col-form-label Sum
  //-       .col-sm-3
  //-         input.form-control.text-right(type="number" placeholder="0")
  //-       .col-sm-2

  .col-sm-5
    template(v-if="response")
      b-card 
        p {{toDestination}}
        p 
          b Положить в полку {{toPolka}}
      code(:inner-html.prop="response | json2html('json')")

  //- b-modal(v-model="response")
  //-   template(slot="modal-title" v-if="response")
  //-     | Отправление {{response.trackid}} {{response.status}}
  //-   template(v-if="response")
  //-     p(v-if="response.next") {{response.next.postindex}}
  //-     code(:inner-html.prop="response | json2html('json')")
    
</template>

<script>
import Vue from 'vue'
import {$http,$smartsort} from '@/store/api/http'
import {mqttLEDMixin} from '@/store/api/mqtt'

export default {
  name: 'Console',
  mixins: [ mqttLEDMixin ],
  mounted(){
    this.$bus.$on('keyboard:keydown:enter:i',this.registerPoint);
    this.$bus.$on('keyboard:keydown:enter:d',this.registerDestination);
    this.$bus.$on('keyboard:keydown:enter:u',this.login);
    this.$bus.$on('keyboard:keydown:enter:p',this.togglePolka);
    this.$bus.$on('keyboard:keydown:enter:13',this.searchBarcode);
  },
  beforeDestroy(){
    this.$bus.$off('keyboard:keydown:enter:i',this.registerPoint);
    this.$bus.$off('keyboard:keydown:enter:d',this.registerDestination);
    this.$bus.$off('keyboard:keydown:enter:u',this.login);
    this.$bus.$off('keyboard:keydown:enter:p',this.togglePolka);
    this.$bus.$off('keyboard:keydown:enter:13',this.searchBarcode);
  },
  data () {
    return {
      input:null,
      inprogress:false,
      response:null,
      barcode:null,
      polka:null,
      polkas:{},
      point:null,
      destination:null,
      destinations:{},
      user:null,
      tmResponse:null,
      pin:0,
      polkaInterval:null,
      isPolkaSetupStarted:false,
      toDestination:null,
      toPolka:null,
      currentUserColor:'r'
    }
  },
  watch:{
    response(val){
      if(val){
        window.clearTimeout(this.tmResponse);
        this.tmResponse = window.setTimeout(()=>{
          this.response = null;
          this.toDestination = null;
          this.toPolka = null;
        },5000);  
      }
    }
  },
  methods:{
    _getBagLEDFromSortPlan(nextDepIndex){
      return 2;
    },
    searchBarcode(barcode,user){

      this.barcode = barcode.toUpperCase()
      this.$search()


      $smartsort.track(this.barcode).then((resp)=>{
        console.log(barcode,'led',resp.data.led)
        this.response = resp.data
        // this.$found(user,this._getBagLEDFromSortPlan(resp.data.next.postindex));
        this.$found(user,resp.data.led);

      }).catch(()=>{
        this.$notFound();
      });
    },
    /*beginSetupPolkas(){

      this.isPolkaSetupStarted = true;

      if(this.pin != 0 ){
        window.clearInterval(this.polkaInterval);
        this.pin = 0;
      } else {
        this.pin++;
        this.polkaInterval = window.setInterval(()=>{
          $mqttLED.bindStart()
        },1100);
      }
    },
    togglePolka(polka){
      
      console.log('togglePolka',polka);

      if(!this.isPolkaSetupStarted) this.beginSetupPolkas();
      else if(!this.isPolkaSetupEnded){

        Vue.set(this.polkas,polka,this.pin)

        if(this.pin > 6){
          this.pin = 0;
          this.isPolkaSetupEnded = true;
          window.clearInterval(this.polkaInterval);
        } else {
          this.pin++;
        }
      } else if(this.polkas[polka]) { // others polka

        if(this.polka ){ 
          window.clearInterval(this.polkaInterval);
          this.polka = null;
        } else {
          this.polka = polka;

          this.polkaInterval = window.setInterval(()=>{
            $mqttLED.bind(this.polkas[this.polka])
          },1100);
        }
      }
    },*/
    login(user){
      console.log('toggleUser',user);
      this.user = user
      $mqttLED.login(user)
    },
    /*registerPoint(point){
      this.point = point;
      console.log('registerPoint',point);
      $mqttLED.('/on?color=3&bind=1');
    },
    registerDestination(destination){
      this.destination = destination
      if(this.polka)
        Vue.set(this.destinations,destination,this.polka)
      // else 
      //   this.destinations[this.destination] = "temp"

      console.log('registerDestination',destination);
      $mqttLED.bindDestination('/on?color=3&bind=1');
    },*/
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
h1, h2
    font-weight normal

ul
    list-style-type none
    padding 0

li
    display inline-block
    margin 0 10px

a
    color #42b983
    
.selected
  background-color #f00
  color #fff
  
</style>
