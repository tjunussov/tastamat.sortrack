<template lang="pug">
doctype html

#app(v-if="hydrated" @paste="enterBarcodeManualy($event.clipboardData.getData('text'));" :class="{'disabled':!user && !calibrating,'isDemo':demo, 'isLedOff':ledOn,'notechindex':!depcode,'dark':isDark}")

 

  b-navbar.bd-navbar(toggleable="md" fixed="top" type="dark")

      b-nav-toggle(target="nav_collapse")

      //- b-navbar-brand(to="/")
        <svg width="36" height="36" viewBox="0 0 612 612" xmlns="http://www.w3.org/2000/svg" focusable="false" fill="#fff" class="d-block"><path d="M510,8 C561.846401,8.16468012 603.83532,50.1535995 604,102 L604,510 C603.83532,561.846401 561.846401,603.83532 510,604 L102,604 C50.1535995,603.83532 8.16468012,561.846401 8,510 L8,102 C8.16468012,50.1535995 50.1535995,8.16468012 102,8 L510,8 L510,8 Z M510,0 L102,0 C45.9,6.21724894e-15 0,45.9 0,102 L0,510 C0,566.1 45.9,612 102,612 L510,612 C566.1,612 612,566.1 612,510 L612,102 C612,45.9 566.1,6.21724894e-15 510,0 Z" fill-rule="nonzero"></path> <text id="BV" font-family="Arial" font-size="350" font-weight="light" letter-spacing="2"><tspan x="72.0527344" y="446">S</tspan> <tspan x="307.5" y="446">T</tspan></text></svg>
      b-navbar-brand 
        img(src="static/logo2.svg" width="200" height="40" @click="toggleFullScreen()")/
        //- span(@click="toggleFullScreen()") Sortrack® 
        b-badge(variant="danger" v-if="!ledOn" @click="togleLed()") &times; NO LED
        b-badge(variant="danger" v-if="offline") OFFLINE
        b-badge.ml-1(variant="danger" v-if="demo" @click="togleDemo()") &times; DEMO
        b-badge.ml-1(variant="danger" v-if="calibrating" @click="togleCalibrate()") &times; CALIBRATE
        b-badge.ml-1(variant="danger" v-if="ws.isOpen" @click="toggleWsConnect()") WS

        

      b-collapse(is-nav id="nav_collapse" v-if="depcode")

        b-navbar-nav
          b-nav-item-dropdown(right ref="loginPopover"  @show="onShow" @toggle="onToggle")
            template(slot="button-content")
              i.fa.fa-map-marker.mr-2
              | {{depcode}}

            b-dropdown-item(v-b-modal.depcode) Сменить Индекс
            b-dropdown-divider
            b-dropdown-header(@click="showDemo=!showDemo") Печать
            b-dropdown-item(v-b-modal.badge="") Бейджики
            b-dropdown-item(@click="isSortplanModalOpen = true" v-b-modal="'msortplan'") Сортплан
            b-dropdown-item(v-if="showDemo" v-b-modal.demoprint="") Demo Шаблон
            b-dropdown-divider
            b-dropdown-item(v-b-modal.diagnostic="") Диагностика
            b-dropdown-item(@click="togleCalibrate()" ) Калибрововка
              //- b-link(@click="wizardToggle" size="sm" v-bind:class="{'bg-primary text-white':bind.started}") {{!bind.started?'Bind Start':'Bind Stop'}}
            
            
            
            template(v-if="showDemo")
              b-dropdown-divider
              b-dropdown-item(@click="togleDemo()" ) 
                i.fa.mr-2(:class="{'fa-circle text-success':demo,'fa-circle-o':!demo}")/
                | Демо
              b-dropdown-item(@click="togleLed()" ) 
                i.fa.mr-2(:class="{'fa-circle text-success':ledOn,'fa-circle-o':!ledOn}")/
                | Лампочки
              b-dropdown-item(v-if="settings.broker" @click="toggleWsConnect()" ) 
                i.fa.mr-2(:class="{'fa-circle text-success':ws.isOpen,'fa-circle-o':!ws.isOpen}")/
                | Мультитор 
            
            b-dropdown-divider
            b-dropdown-item(v-b-modal.settings="") Настройки

        b-navbar-nav.ml-auto

          b-nav-form(@submit.stop.prevent)
            b-input-group
              b-form-input.nokeyboard(
                :disabled="!user" 
                v-on:focus.native="$event.target.value = '';"
                v-on:dblclick.native="enterBarcodeRandom(); $event.target.blur();" 
                @keyup.enter.native.stop="enterBarcodeManualy($event.target.value); $event.target.value = ''; $event.target.blur(); " 
                placeholder="Поиск поссылок  ...") 
              b-input-group-append
                b-dropdown(:variant="kolor(colorPrefix)" :dropup="colorPrefixRandom")
                  b-dropdown-item(@click="setUserColorPrefix('R')")
                    .text-danger Red
                  b-dropdown-item(@click="setUserColorPrefix('G')")
                    .text-success Green
                  b-dropdown-item(@click="setUserColorPrefix('B')")
                    .text-primary Blue
                  b-dropdown-divider
                  b-dropdown-item(@click="setUserColorPrefix('random')")
                    .text-secondary Random
            

          b-nav-item(right v-b-modal.user v-if="!user") 
            | Войти
          b-nav-item-dropdown.ml-2(right v-else @click="$logout()")
            template(slot="button-content")
              i.fa.fa-gear.mr-2/
              //- | {{user.name?user.name:user.login}} 
              //- .username(v-if="user.name") {{user.login}}
            b-dropdown-item(v-b-modal.user="") Войти как
            b-dropdown-item( @click="$logout()") Выход

      b-navbar-nav.ml-auto(v-else)
        b-nav-item(right v-b-modal.depcode) Установить Индекс


  b-container

    
    //- router-view

    Console
  
  .bd-footer.text-muted
      p.mb-2.pl-5 &copy; 2019 Copyright. Система "Умные Полки" для ПУС. 
        | Разработка by tastamat.com. Версия 
        b {{$root.version}} 
        b-link.ml-4(v-b-modal.about="") Credits 
        | | 
        b-link(v-b-modal.help="") Manual 
        | | 
        b-link(v-b-modal.stats="") Stats 
        | | 
        b-link(v-b-modal.debug="") 
          i.fa.fa-bug.ml-1
                

  Keyboard

  SortplanModal(v-if="isSortplanModalOpen" @hide="isSortplanModalOpen = false")


  b-modal#depcode(title="Технологический Индекс" centered size="sm"  ok-only @ok="registerDepcode(tmpDepcode);" @hide="tmpDepcode=''")
    b-form-input.nokeyboard(v-model="tmpDepcode" autofocus :placeholder="depcode" @dblclick.native="demo?tmpDepcode = '220081':null")

  b-modal#user(size="sm" title="Авторизация*" :modal-class="{'isLoginError':loginResponse}" @hide="tmpUser=''" centered="")
    b-form-group(:invalid-feedback="'Ошибка! [' + tmpUser + '] '+ loginResponse" :state="!loginResponse")
      b-form-input.nokeyboard(v-model="tmpUser" size="lg" @dblclick.native="demo?tmpUser = 'test.ast17.sc1':null" placeholder="Ваш логин в ПУС" autofocus)
    b-button-group
      b-btn(:variant="colorPrefix=='R'?'danger':'outline-danger'" @click.stop="setUserColorPrefix('R')"): i.fa.fa-user.mr-2
      b-btn(:variant="colorPrefix=='G'?'success':'outline-success'" @click.stop="setUserColorPrefix('G')"): i.fa.fa-user.mr-2
      b-btn(:variant="colorPrefix=='B'?'primary':'outline-primary'" @click.stop="setUserColorPrefix('B')"): i.fa.fa-user.mr-2
    
    //- b-row
    //-   b-col 
    //-    .barcode {{encode('u'+user)}}
    template(slot="modal-footer")
      b-btn(variant="primary" :disabled="!tmpUser" @click="login(tmpUser,colorPrefix)") Вход

  b-modal#help(title="Инструкция" lazy size="lg" :hide-footer="true")
    HelpModal

  b-modal#about(hide-header size="lg" lazy hide-footer scrollable  body-bg-variant="dark" body-text-variant="white")
    AboutModal

  b-modal#stats(title="Статистика" lazy size="lg" :hide-footer="true")
    StatsModal

  b-modal#badge(title="Беджики" lazy scrollable ok-title="Печать" ok-only @ok="$print")
    BadgeModal

  b-modal#demoprint(title="Шаблон" scrollable lazy size="lg" ok-only ok-title="Печать" @ok="$print")
    DemoPrintModal

  b-modal#diagnostic(title="Диагностика" lazy hide-footer)
    DiagnosticModal

  b-modal#debug(hide-header size="lg" hide-footer scrollable  body-bg-variant="dark")
    pre {{consoles}}
    pre {{bags}}
  
  SettingsModal

</template>

<script>

import Encoder from 'code-128-encoder'
var code128= new Encoder()
import { mapGetters, mapActions } from 'vuex'
import Keyboard from '@/components/misc/Keyboard'
import {$smartsort,$http,$leds} from '@/store/api/http'
import {kolor} from '@/store/modules/polka'
import {mock,mockDevice} from '@/store/api/mock'
import populateData from '@/store/idb/data.js'
import SortplanModal from '@/components/SortplanModal'
import Console from '@/components/Console'
import HelpModal from '@/components/HelpModal'
import DemoPrintModal from '@/components/DemoPrintModal'
import AboutModal from '@/components/AboutModal'
import BadgeModal from '@/components/BadgeModal'
import StatsModal from '@/components/StatsModal'
import DiagnosticModal from '@/components/DiagnosticModal'

import SettingsModal from '@/components/SettingsModal'


var webSocket;

export default {
  name: 'app',
  data(){
    return {
      errorLogin:null,
      tmpUser:null,
      tmpDepcode:null,
      tmResponse:null,
      isSortplanModalOpen:false,
      demoIndex:0,
      colorPrefix:'R',
      colorPrefixRandom:false,
      showDemo:false,
      preventKeyboardDropdown:false,
      ws:{
        isOpen : false,
        start: false,
        error: null,
        message:'Here will be data',
        url:null
      }
    }
  },
  mounted(){
    // this.$bus.$on('keyboard:keydown:enter:13',this.enterBarcode);
    this.$bus.$on('keyboard:keydown:enter:t',this.registerDepcode);
    this.$bus.$on('keyboard:keydown:enter:u',this.loginViaBarcode);

    this.demoIndex = Number(localStorage.getItem('demoIndex'));
    
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
        consoles: 'getConsoles',
        calibrating:'getCalibrating',
        demoBarcodes:'getDemoBarcodes'
    }),
    offline(){
      return this.$root.offline
    },
    isDark(){
      return this.$root.isDark
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
      '$setColor'
    ]), 
    kolor,
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
        localStorage.setItem('demoIndex',this.demoIndex);
      }
    },
    // enterBarcode(val){
    //   // console.log('setting barcode',val)
    //   this.$store.state.polka.barcode = val
    // },
    enterBarcodeManualy(barcode){
      if(this.colorPrefixRandom) {
        var prefix = Math.ceil(Math.random()*10);
        this.colorPrefix = (prefix>3?(prefix>6?'G':'B'):'R');
      }
      console.log('enterBarcodeManualy',barcode,this.colorPrefix);
      this.$bus.$emit('keyboard:keydown:enter:13',barcode,this.colorPrefix);  
    },
    // enterBagManualy(bagno){
    //   // console.log('enterBagManualy',bagno);
    //   this.$bus.$emit('keyboard:keydown:enter:p',bagno)
    // },
    setUserColorPrefix(prefix){
      if(prefix == 'random') {
        this.colorPrefix = 'R'
        this.colorPrefixRandom = true;
      }
      else {
        this.colorPrefix = prefix
        this.colorPrefixRandom = false;
      }
    },
    registerDepcode(depcode){
      console.log('registerdepcode',depcode);
      this.$registerDepcode({depcode});
    },
    loginViaBarcode(user,color){
      if(this.user && this.user.login == user) 
        this.$logout();
      else 
        this.login(user,color);
    },
    login(user,color){
      this.tmpUser = user;
      this.$login({user,color}).then((resp)=>{
         console.log('login',user);
         this.tmpUser = null;
         this.$root.$emit('bv::hide::modal', 'user', '#btnLogin')
      }).catch((err)=>{
        this.timeout(3000);
        this.$root.$emit('bv::show::modal', 'user')
      });
    },
    onToggle(event){
      if(event.keyCode){
        this.preventKeyboardDropdown = true
        return false;
      }
      // console.error('onToggle invoked',event)
    },
    onShow(bvEvt){
      // console.error('onShow invoked',bvEvt)
      if(this.preventKeyboardDropdown){
        bvEvt.preventDefault();
        this.preventKeyboardDropdown = false
      }
      
    },
    clear(){
      this.$store.state.polka.loginResponse = null;
    },
    timeout(tm){
      window.clearTimeout(this.tmResponse);
      this.tmResponse = window.setTimeout(this.clear,tm);
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
      console.log('togleCalibrate',this.$store.state.polka.calibrating);
      // if(state !== null)
      //   this.$store.state.polka.calibrating = state
      // else
        this.$store.state.polkaUtils.calibrating = !this.$store.state.polkaUtils.calibrating;
    },
    togleDemo(val){
      console.log('togleDemo',val);
      this.$togleDemo({val}).then(()=>{
        if(val === undefined){
           // location.reload();
        }
        if(!this.demo) {
          mock.restore();
        }
      });

    },
    togleLed(val){
      this.$togleLed({val});
      console.log('togleLed',this.ledOn);

      // if(this.ledOn) {
      //   mockDevice.restore();
      // }
    },
    toggleWsConnect(){
      if(this.ws.isOpen){
        webSocket.close();
        this.ws.isOpen = false;
        webSocket = null;
      } else {
        webSocket = new WebSocket('ws://'+this.settings.broker);
        webSocket.addEventListener('open', (e) => {
          this.ws.isOpen = true
          webSocket.send('/');
        });
        webSocket.addEventListener('error', (e) => {
          console.error('error',e)
          this.ws.error = e
          this.ws.isOpen = false
        });
        webSocket.addEventListener('close', (e) => {
          this.ws.isOpen = false
        });
        webSocket.addEventListener('message', (m) => {
          console.log('message',m)
          this.ws.message = m;
        });
      }
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
    SettingsModal,
    StatsModal,
    DiagnosticModal
  },
}


</script>

<style lang="stylus" src="./AppStyle.stylus"/>
<style lang="stylus" src="./AppStylePrint.stylus"/>
<style lang="stylus">


body.dark
  background-color #435267 !important
  
  .bd-navbar
    background-color #435267 !important
  
  
  .bd-footer a
    color #6c757d 
  
  .polkas,  .consoles, .nav-pills, .navbar
    .card, .nav-link, .form-control, .badge 
      border none
      border-color rgba(255,255,255,0.1)
    
    .card
      background-color rgba(255,255,255,0.1)
      
    .card, .card-header, .card-body, .card-footer, .nav-link, .form-control,  .badge, .dropdown-toggle
      border-radius 0
      color #f0f0f0
      
      &::placeholder
        color #b0b0b0
      
    .card-header, .card-body, .card-footer
      border none
      
    .card-header
      background-color transparent
    

    .card:nth-child(4), .card:nth-child(8n+4), 
    .card:nth-child(5), .card:nth-child(8n+5), .nav-link.active, .form-control
      background-color rgba(255,255,255,0.3)

#app
  
  &:before
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

  // &.isDemo
    
  //   &:before
  //     content 'DEMO РЕЖИМ DEMO РЕЖИМ'
  //     z-index 0
  //     letter-spacing -5px
  //     color #f002
  //     padding-top 60px
  //     font-size 50pt
  //     background-color rgba(255,0,0,0.1)
    
  //   .bd-navbar, .nav-pills .nav-link.active, .nav-pills .show > .nav-link, .nav-link.active
  //     background-color #500 !important

#app.disabled 
  // background-color #000
  
  .bd-content
  //   filter blur(1px)
    pointer-events none
  
  &:before
    z-index 1000
    content 'Авторизация! Просканируйте Ваш Бейдж'
    
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
  


#debug pre 
  color #4f4 !important
  font-size 11px
  overflow hidden
  line-height 11px

    

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
