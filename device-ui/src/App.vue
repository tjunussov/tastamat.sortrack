<template lang="pug">
doctype html

#app(v-if="hydrated" @paste="enterBarcodeManualy($event.clipboardData.getData('text'));" :class="{'disabled':!user,'isDemo':!demo, 'isLedOff':ledOn,'notechindex':!depcode}"  Zclass="{'bg-danger text-white':error,'bg-success text-white':response}")


  b-navbar.bd-navbar(toggleable="md" fixed="top" type="dark")

    b-nav-toggle(target="nav_collapse")

    b-navbar-brand(to="/")
      <svg width="36" height="36" viewBox="0 0 612 612" xmlns="http://www.w3.org/2000/svg" focusable="false" fill="#fff" class="d-block"><path d="M510,8 C561.846401,8.16468012 603.83532,50.1535995 604,102 L604,510 C603.83532,561.846401 561.846401,603.83532 510,604 L102,604 C50.1535995,603.83532 8.16468012,561.846401 8,510 L8,102 C8.16468012,50.1535995 50.1535995,8.16468012 102,8 L510,8 L510,8 Z M510,0 L102,0 C45.9,6.21724894e-15 0,45.9 0,102 L0,510 C0,566.1 45.9,612 102,612 L510,612 C566.1,612 612,566.1 612,510 L612,102 C612,45.9 566.1,6.21724894e-15 510,0 Z" fill-rule="nonzero"></path> <text id="BV" font-family="Arial" font-size="350" font-weight="light" letter-spacing="2"><tspan x="72.0527344" y="446">S</tspan> <tspan x="307.5" y="446">T</tspan></text></svg>
    b-navbar-brand 
      img(src="static/logo2.svg" width="200" height="40" @click="toggleFullScreen()")/
      //- span(@click="toggleFullScreen()") Sortrack® 
      b-badge(variant="danger" v-if="!ledOn" @click="togleLed()") &times; NO LED
      b-badge(variant="danger" v-if="offline") OFFLINE
      b-badge.ml-1(variant="danger" v-if="demo" @click="togleDemo(null)") &times; DEMO
      b-badge.ml-1(variant="danger" v-if="calibrating" @click="togleCalibrate()") &times; CALIBRATE

    b-collapse(is-nav id="nav_collapse" v-if="depcode")

      b-navbar-nav
        b-nav-item-dropdown(right id="loginPopover")
          template(slot="button-content")
            i.fa.fa-map-marker.mr-2
            | {{depcode}}
          
          b-dropdown-header Настройки
          b-dropdown-item(v-b-modal.depcode) Сменить Индекс
          b-dropdown-item(@click="isSortplanModalOpen = true" v-b-modal="'msortplan'") Загрузить Сортплан
          b-dropdown-item(@click="togleCalibrate" ) Начать Калибровку
            //- b-link(@click="wizardToggle" size="sm" v-bind:class="{'bg-primary text-white':bind.started}") {{!bind.started?'Bind Start':'Bind Stop'}}
          b-dropdown-divider
          b-dropdown-item(v-b-modal.demoprint="") Demo Шаблон
          b-dropdown-item(v-b-modal.badge="") Бейджики
          b-dropdown-item(@click="togleDemo(null)" ) 
            i.fa.mr-2(:class="{'fa-circle text-success':demo,'fa-circle-o':!demo}")/
            | Демо
          b-dropdown-item(@click="togleLed()" ) 
            i.fa.mr-2(:class="{'fa-circle text-success':ledOn,'fa-circle-o':!ledOn}")/
            | Лампочки 
          
          b-dropdown-divider
          b-dropdown-item(v-b-modal.settings="") Настройки

      b-navbar-nav.ml-auto

        b-nav-form
          b-form-input.mr-sm-2(
            size="sm" 
            v-on:focus.native="$event.target.value = '';"
            v-on:dblclick.native="enterBarcodeRandom(); $event.target.value = ''; $event.target.blur();" 
            @keyup.enter.native.stop="enterBarcodeManualy($event.target.value);$event.target.value = ''; $event.target.blur(); " 
            :placeholder="barcode?barcode:'Поиск поссылок  ...'") 

        b-nav-item(right v-b-modal.user v-if="!user") 
          | Войти
        b-nav-item-dropdown(right v-else @click="$logout()")
          template(slot="button-content")
            i.fa.fa-user.mr-2(:class="{'text-danger':user.login}")/
            | {{user.name?user.name:user.login}} 
            .username(v-if="user.name") {{user.login}}
          b-dropdown-item(v-b-modal.user="") Сменить пользователя
          b-dropdown-item( @click="$logout()") Выход

    b-navbar-nav.ml-auto(v-else)
      b-nav-item(right v-b-modal.depcode) Установить Индекс


  b-container(fluid)

    
    //- router-view
    Console

    
  
  .bd-footer.text-muted
    .container 
      p.mb-2.pl-0 &copy; 2019 Copyright. Система "Умные Полки" для ПУС. 
        | Разработка by tastamat.com. Версия 
        b {{$root.version}} 
        b-link.ml-4(v-b-modal.about="") Credits 
        | | 
        b-link(v-b-modal.help="") Manual

  Keyboard

  SortplanModal(v-if="isSortplanModalOpen" @close="isSortplanModalOpen = false")


  b-modal#depcode(title="Технологический Индекс" centered size="sm"  ok-only @ok="registerDepcode(tmpDepcode);" @hide="tmpDepcode=''")
    b-form-input(v-model="tmpDepcode" autofocus :palceholder="depcode" @dblclick.native="tmpDepcode = '055990'")

  b-modal#user(size="sm" @hide="tmpUser=''" centered)
    template(slot="modal-header")
      h4 Авторизация*
    b-form-group(:invalid-feedback="'Ошибка! [' + tmpUser + '] '+ loginResponse" :state="!loginResponse")
      b-form-input(v-model="tmpUser" size="lg" @dblclick.native="tmpUser = 'test.alm21.rpo1'" placeholder="Ваш логин в ПУС" autofocus)
    b-button-group
      b-btn(variant="danger"): i.fa.fa-user.mr-2
      b-btn(variant="outline-success"): i.fa.fa-user.mr-2
      b-btn(variant="outline-primary"): i.fa.fa-user.mr-2
    
    //- b-row
    //-   b-col 
    //-    .barcode {{encode('u'+user)}}
    template(slot="modal-footer")
      b-btn(variant="primary" :disabled="!tmpUser" @click="login(tmpUser)") Вход

  b-modal#help(title="Инструкция" lazy size="lg" :hide-footer="true")
    HelpModal

  b-modal#about(hide-header size="lg" lazy hide-footer scrollable  body-bg-variant="dark" body-text-variant="white")
    AboutModal

  b-modal#badge(title="Беджики" lazy scrollable ok-title="Печать" ok-only @ok="$print")
    BadgeModal

  b-modal#demoprint(title="Шаблон" scrollable lazy size="lg" ok-only ok-title="Печать" @ok="$print")
    DemoPrintModal

  
  MultiLedModal

</template>

<script>

import Encoder from 'code-128-encoder'
var code128= new Encoder()
import { mapGetters, mapActions } from 'vuex'
import Keyboard from '@/components/misc/Keyboard'
import {$smartsort,$http,$leds} from '@/store/api/http'
import {mock,mockDevice} from '@/store/api/mock'
import populateData from '@/store/idb/data.js'
import SortplanModal from '@/components/SortplanModal'
import Console from '@/components/Console'
import HelpModal from '@/components/HelpModal'
import DemoPrintModal from '@/components/DemoPrintModal'
import AboutModal from '@/components/AboutModal'
import BadgeModal from '@/components/BadgeModal'
import MultiLedModal from '@/components/MultiLedModal'




export default {
  name: 'app',
  data(){
    return {
      errorLogin:null,
      tmpUser:null,
      tmpDepcode:null,
      isSortplanModalOpen:false,
      demoIndex:0
    }
  },
  mounted(){
    // this.$bus.$on('keyboard:keydown:enter:13',this.enterBarcode);
    this.$bus.$on('keyboard:keydown:enter:t',this.registerDepcode);
    this.$bus.$on('keyboard:keydown:enter:u',this.loginViaBarcode);
    
  },
  created(){
    this.$db.on("populate",()=>{
      populateData.populate(this.$db)
    });
    // Demo
    /*window.setInterval(()=>{
      this.enterBarcodeManualy('KZ'+Math.floor(Math.random()*1000000000)+'KZ');
    },10000);*/


  },
  beforeDestroy(){
    // this.$bus.$off('keyboard:keydown:enter:13',this.enterBarcode);
    this.$bus.$off('keyboard:keydown:enter:t',this.registerDepcode);
    this.$bus.$off('keyboard:keydown:enter:u',this.loginViaBarcode);
  },
  computed:{
    ...mapGetters({
        settings: 'getSettingsSelected',
        loginResponse: 'getLoginResponse',        
        ledOn: 'getLedOn',
        demo: 'getDemo',
        calibrating:'getCalibrating',
        bags: 'getBags',
        barcode: 'getBarcode',
        hydrated:'hydrated',
        response: 'getResponse',
        error: 'getError',
        user:'getUser',
        depcode:'getDepcode',
        demoBarcodes:'getDemoBarcodes'
    }),
    offline(){
      return this.$root.offline
    },
    mqttOnline(){
      return this.$root.mqttOnline
    },
  },
  watch:{
    hydrated(){
      this.$onHydrated();
      this.togleDemo(this.demo);
      this.togleLed(this.ledOn);
    }
  },
  methods:{
    ...mapActions([
      '$onHydrated',
      '$login',
      '$logout',
      '$save',
      '$initBags',
      '$fetchDemoRPO',
      '$registerDepcode',
      '$togleDemo',
      '$togleLed',
    ]), 
    encode(val){
      return code128.encode(val)
    },
    enterBarcodeRandom(){
      // console.log(this.demoBarcodes,this.demoBarcodes,this.demoIndex);
      if(!this.demoBarcodes){
        this.$fetchDemoRPO().then(()=>{
           this.enterBarcodeManualy(this.demoBarcodes[this.demoIndex++]);
        })
      } else {
        if(this.demoIndex == this.demoBarcodes.length) this.demoIndex = 0;
        this.enterBarcodeManualy(this.demoBarcodes[this.demoIndex++]);
      }
    },
    // enterBarcode(val){
    //   // console.log('setting barcode',val)
    //   this.$store.state.polka.barcode = val
    // },
    enterBarcodeManualy(barcode){
      console.log('enterBarcodeManualy',barcode);
      this.$bus.$emit('keyboard:keydown:enter:13',barcode);
    },
    enterBagManualy(bagno){
      // console.log('enterBagManualy',bagno);
      this.$bus.$emit('keyboard:keydown:enter:p',bagno)
    },
    registerDepcode(depcode){
      console.log('registerdepcode',depcode);
      this.$registerDepcode({depcode});
    },
    loginViaBarcode(user){
      if(this.user && this.user.login == user) 
        this.$logout();
      else 
        this.login(user);
    },
    login(user){
      this.tmpUser = user;
      this.$login({user}).then((resp)=>{
         console.log('login',user);
         this.tmpUser = null;
         this.$root.$emit('bv::hide::modal', 'user', '#btnLogin')
      }).catch((err)=>{
        this.$root.$emit('bv::show::modal', 'user')
      });
    },
    toggleFullScreen() {
      if ((document.fullScreenElement && document.fullScreenElement !== null) ||    
       (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {  
          document.documentElement.requestFullScreen();  
        } else if (document.documentElement.mozRequestFullScreen) {  
          document.documentElement.mozRequestFullScreen();  
        } else if (document.documentElement.webkitRequestFullScreen) {  
          document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);  
        }  
      } else {  
        if (document.cancelFullScreen) {  
          document.cancelFullScreen();  
        } else if (document.mozCancelFullScreen) {  
          document.mozCancelFullScreen();  
        } else if (document.webkitCancelFullScreen) {  
          document.webkitCancelFullScreen();  
        }  
      }  
    },
    togleCalibrate(state){
      if(state !== null)
        this.$store.state.polka.calibrating = state
      else
        this.$store.state.polka.calibrating = !this.$store.state.polka.calibrating;
    },
    togleDemo(val){
      this.$togleDemo({val});
      if(!this.demo) {
        mock.restore();
      }
    },
    togleLed(val){
      this.$togleLed({val});
      console.log('togleLed',this.ledOn);

      // if(this.ledOn) {
      //   mockDevice.restore();
      // }
    },
  },
  components: {
    Keyboard,
    SortplanModal,
    Console,
    HelpModal,
    DemoPrintModal,
    AboutModal,
    BadgeModal,
    MultiLedModal
  },
}


</script>

<style lang="stylus" src="./AppStyle.stylus"/>
<style lang="stylus" src="./AppStylePrint.stylus"/>
<style lang="stylus">

#app.disabled 
  // background-color #000
  
  .bd-content
  //   filter blur(1px)
    pointer-events none
  
  &:before
    content 'Авторизация! Просканируйте Ваш Бейдж'
    font-size 30pt
    padding-top 30%
    text-align center
    color #fffa
    position absolute
    top 0
    bottom 0
    left 0 
    right 0
    background-color rgba(0,0,10,0.7)
    z-index 1000
    
  &.notechindex:before
    content '[Технологический Индекс не установлен]'
    color #f008
    background-color rgba(0,0,0,0.9)
  
.username
  position absolute
  font-size 12  px
  margin-left 20px
  margin-top -5px
  opacity 0.5

    

</style>
<style lang="stylus">
  .tjson
    font-family monospace
  .tjson.group .tjson.group
    margin-left 26px
  .tjson.json .tjson.group:after
    content '}'
  .tjson.json .tjson.group:before
    content '{'
  .tjson.key
     font-weight bold
     display inline-block
     min-width 50px
     margin-left 26px
  .tjson.json .tjson.key:after 
    content ':'
  .tjson.val
     color green
  .tjson.val:after 
     content ','
</style>
