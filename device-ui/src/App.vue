<template lang="pug">
doctype html

#app(v-if="hydrated" @paste="enterBarcodeManualy($event.clipboardData.getData('text'));"  Zclass="{'bg-danger text-white':error,'bg-success text-white':response}")

  b-navbar.bd-navbar(toggleable="md" fixed="top" type="dark")

    b-nav-toggle(target="nav_collapse")

    b-navbar-brand(to="/")
      <svg width="36" height="36" viewBox="0 0 612 612" xmlns="http://www.w3.org/2000/svg" focusable="false" fill="#fff" class="d-block"><path d="M510,8 C561.846401,8.16468012 603.83532,50.1535995 604,102 L604,510 C603.83532,561.846401 561.846401,603.83532 510,604 L102,604 C50.1535995,603.83532 8.16468012,561.846401 8,510 L8,102 C8.16468012,50.1535995 50.1535995,8.16468012 102,8 L510,8 L510,8 Z M510,0 L102,0 C45.9,6.21724894e-15 0,45.9 0,102 L0,510 C0,566.1 45.9,612 102,612 L510,612 C566.1,612 612,566.1 612,510 L612,102 C612,45.9 566.1,6.21724894e-15 510,0 Z" fill-rule="nonzero"></path> <text id="BV" font-family="Arial" font-size="350" font-weight="light" letter-spacing="2"><tspan x="72.0527344" y="446">B</tspan> <tspan x="307.5" y="446">V</tspan></text></svg>
    b-navbar-brand(@click="toggleFullScreen()") Sortrack® {{$store.state.user}}

    b-collapse(is-nav id="nav_collapse" v-if="user")

      b-navbar-nav
        //- b-nav-item(to="/console") Консоль
        b-nav-item(to="/console2") Консоль
        b-nav-item(to="/admin") Настройки
        //- b-nav-item(to="/admin/sortplan") Сортплан
        b-nav-item(@click="toogleDemo(null)" ) 
          toggle-button(:value="demo" :sync="true" :labels="{checked: 'Prod', unchecked: 'Demo'}")
        b-nav-item(@click="toogleLed()" )
          toggle-button(:value="ledOn" :sync="true" :labels="{checked: 'LED', unchecked: 'LED'}")

      b-navbar-nav.ml-auto

        b-nav-form
          b-form-input.mr-sm-2(
            size="sm" 
            style="width:5rem"
            v-on:focus.native="$event.target.value = '';"
            v-on:dblclick.native="enterBagManualy;" 
            @keyup.enter.native="enterBagManualy($event.target.value);" 
            :placeholder="'Мешок'") 

        b-nav-form
          b-form-input.mr-sm-2(
            size="sm" 
            v-on:focus.native="$event.target.value = '';"
            v-on:dblclick.native="enterBarcodeManualy('KZ'+Math.floor(Math.random()*1000000000)+'KZ'); $event.target.value = ''; $event.target.blur();" 
            @keyup.enter.native.stop="enterBarcodeManualy($event.target.value);$event.target.value = ''; $event.target.blur(); " 
            :placeholder="barcode?barcode:'Поис поссылок  ...'") 
        //- p {{barcode}}

        b-nav-item(v-if="settings" right v-b-modal.depcode) 
          span(v-if="depcode") {{depcode}}
          span.text-muted(v-else) [{{autodepcode}}]

        b-nav-item(right v-b-modal.user) {{user}} 
          //- small: b-badge(:variant="mqttOnline?'success':'dark'") mqtt

        //- b-nav-item-dropdown(right v-if="authUser" id="loginPopover")
        //-   template(slot="button-content")
        //-     span(:title="authUser.email") 
        //-   b-dropdown-item(to="/profile") Profile
        //-   b-dropdown-item(@click="logout()")
        //-     span.i.fa.fa-exit.mr-1
        //-     | Signout

        //- b-nav-item(right id="loginPopover" v-else) Login

    b-navbar-nav.ml-auto(v-else)
      b-nav-item(right v-b-modal.user) Log In


  b-container(fluid)
    router-view
  Keyboard


  b-modal#depcode(title="Код департамента" ok-title="Изменить" :hide-footer="true")
    b-form-input(v-model="depcode" palceholder="Depcode")

  b-modal#user(title="CPILS Пользователь" ok-title="Войти" :hide-footer="true")
    b-form-input(v-model="user" palceholder="CPILS Login")

</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import Keyboard from '@/components/misc/Keyboard'
import {$smartsort,$http,deviceLEDMixin} from '@/store/api/http'
import {mock,mockDevice} from '@/store/api/mock'
import populateData from '@/store/idb/data.js'

export default {
  name: 'app',
  data(){
    return {
      ui:{
        search:null,
        showModalLogin:false
      },
    }
  },
  mixins:[deviceLEDMixin],
  mounted(){
    this.$bus.$on('keyboard:keydown:enter:13',this.barcodeSet);
    this.$bus.$on('keyboard:keydown:enter:i',this.registerDepcode);
    this.$bus.$on('keyboard:keydown:enter:u',this.auth);
    
    this.$ledoff();
  },
  created(){
    this.$db.on("populate",()=>{
      populateData.populate(this.$db)
    });
    this.toogleDemo(this.$store.state.polka.demo);
    this.toogleLed(this.$store.state.polka.ledOn);

    
    // Demo
    /*window.setInterval(()=>{
      this.enterBarcodeManualy('KZ'+Math.floor(Math.random()*1000000000)+'KZ');
    },10000);*/


  },
  beforeDestroy(){
    this.$bus.$off('keyboard:keydown:enter:13',this.barcodeSet);
    this.$bus.$off('keyboard:keydown:enter:i',this.registerDepcode);
    this.$bus.$off('keyboard:keydown:enter:u',this.auth);
  },
  computed:{
    ...mapGetters({
        settings: 'getSettingsSelected',
        setting: 'getSettings',
        depcode: 'getDepcode',
        autodepcode: 'getAutoDepcode',        
        ledOn: 'getLedOn',
        demo: 'getDemo',
        bags: 'getBags',
        barcode: 'getBarcode',
        hydrated:'hydrated',
        response: 'getResponse',
        error: 'getError',
    }),
    online(){
      return this.$root.online
    },
    mqttOnline(){
      return this.$root.mqttOnline
    },
    user:{
      get: function () {
        return this.$store.state.polka.user
      },
      // setter
      set: function (newValue) {
        this.$store.state.polka.user = newValue
      }
    },
    depcode: {
      get: function () {
        return this.$store.state.polka.depcode
      },
      // setter
      set: function (newValue) {
        this.$store.state.polka.depcode = newValue
      }
    },
  },
  watch:{
    hydrated(){
      this.settingsSelect(this.setting[0]);
    },
    demo(val){
      localStorage.setItem('demo',val);
    },
    ledOn(val){
      localStorage.setItem('ledOn',val);
    },
    depcode(val){
      localStorage.setItem('depcode',val);
    },
    user(val){
      localStorage.setItem('user',val);
    }
  },
  methods:{
    ...mapActions([
      'settingsUpdate',
      'settingsSelect',
    ]),
    barcodeSet(val){
      // console.log('setting barcode',val)
      this.$store.state.polka.barcode = val
    },
    enterBarcodeManualy(barcode){
      // console.log('enterBarcodeManualy',barcode);
      this.$bus.$emit('keyboard:keydown:enter:13',barcode);
    },
    enterBagManualy(bagno){
      // console.log('enterBagManualy',bagno);
      this.$bus.$emit('keyboard:keydown:enter:p',bagno)
    },
    registerDepcode(depcode){
      this.settings.depcode = depcode
      this.$store.state.polka.depcode = depcode
      this.settingsUpdate(this.settings)
      console.log('registerdepcode',depcode);
      // this.$registerdepcode(depcode)
    },
    auth(user){
      $smartsort.auth(user).then((resp)=>{
         console.log('auth',user);
         this.settings.user = user
         this.$store.state.polka.user = user
         this.settingsUpdate(this.settings)
      }).catch(()=>{
         this.$error();
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
    toogleDemo(state){

      if(state !== null)
        this.$store.state.polka.demo = state
      else
        this.$store.state.polka.demo = !this.$store.state.polka.demo;

      // console.log('toogleDemo',this.$root,this.$root.demo);

      if(this.demo) {
        mock.restore();
      }
    },
    toogleLed(state){
      if(state == null)
        this.$store.state.polka.ledOn = !this.$store.state.polka.ledOn;
      else 
        this.$store.state.polka.ledOn = state
        
      console.log('toogleLed',this.ledOn);

      if(this.ledOn) {
        mockDevice.restore();
      }
    }
  },
  components: {
    Keyboard
  },
}


</script>

<style lang="stylus">

#app
  width 1024px

body
  padding-top 4rem
  margin 0

// Test  

.modal-header 
  display block !important

.bd-navbar
  min-height 64px
  min-height 4rem
  background-color #0157a5
  -webkit-box-shadow 0 .5rem 1rem rgba(0,0,0,.05),inset 0 -1px 0 rgba(0,0,0,.1)
  box-shadow 0 .5rem 1rem rgba(0,0,0,.05),inset 0 -1px 0 rgba(0,0,0,.1)

@media (max-width:991.98px)
  .bd-navbar
    padding-right .5rem
    padding-left .5rem

.bd-sidebar
    -webkit-box-ordinal-group 1
    -ms-flex-order 0
    order 0
    border-bottom 1px solid rgba(0,0,0,.1)
    .nav
        & > li
            & > a
                display block
                padding 4px 24px
                padding .25rem 1.5rem
                font-size 90%
                color rgba(0,0,0,.65)
                &:hover
                    color rgba(0,0,0,.85)
                    text-decoration none
                    background-color transparent

.bd-sidebar
  border-right 1px solid rgba(0,0,0,.1)
  
.bd-sidebar
  position sticky
  top 4rem
  z-index 1000
  height calc(100vh - 4rem)
  

.bd-content>h1, .bd-content>h2, .bd-content>h3, .bd-content>h4, .bd-content>h5
  padding-top 25px
  padding-bottom 15px
  

@media (min-width:1200px)
    .bd-sidebar
        -webkit-box-flex 0
        -ms-flex 0 1 320px
        flex 0 1 320px
        
.bd-navbar
    .navbar-nav-scroll
        max-width 100%
        height 2.5rem
        margin-top .25rem
        overflow hidden
        font-size .875rem
        .navbar-nav
            padding-bottom 2rem
            overflow-x auto
            white-space nowrap
            -webkit-overflow-scrolling touch
    .navbar-nav
        .nav-link
            &.active
                font-weight 500
    .navbar-nav-svg
        display inline-block
        width 16px
        width 1rem
        height 16px
        height 1rem
        vertical-align text-top
    .dropdown-menu
        font-size 14px
        font-size .875rem

.bd-navbar
  .navbar-nav
      .nav-link
        padding-right 8px
        padding-right .5rem
        padding-left 8px
        padding-left .5rem
        color #cbbde2

.bd-navbar .navbar-nav .nav-link.active,.bd-navbar .navbar-nav .nav-link:hover
  color #fff
  background-color transparent


.bd-content
    -webkit-box-ordinal-group 2
    -ms-flex-order 1
    order 1

.bd-text-purple
    color #563d7c

.bd-text-purple-bright
    color #7952b3

.bd-toc
  -webkit-box-ordinal-group 3
  -ms-flex-order 2
  order 2
  padding-top 24px
  padding-top 1.5rem
  padding-bottom 24px
  padding-bottom 1.5rem
  font-size 14px
  font-size .875rem

.section-nav
    padding-left 0
    border-left 1px solid #eee

.section-nav
    ul
        padding-left 16px
        padding-left 1rem
        ul
            display none

.toc-entry,.toc-entry a
    display block

.toc-entry
    a
      padding 2px 24px
      padding .125rem 1.5rem
      color #99979c
      &:hover
          color #007bff
          text-decoration none

.bd-links
  padding-top 16px
  padding-top 1rem
  padding-bottom 16px
  padding-bottom 1rem
  margin-right -15px
  margin-left -15px

@media (min-width:768px)
  .bd-links
      display block !important

.bd-search
    position relative
    padding 16px 15px
    padding 1rem 15px
    margin-right -15px
    margin-left -15px
    border-bottom 1px solid rgba(0,0,0,.05)
    .form-control
        &:focus
            border-color #7952b3
            -webkit-box-shadow 0 0 0 3px rgba(121,82,179,.25)
            box-shadow 0 0 0 3px rgba(121,82,179,.25)

.bd-search-docs-toggle
    line-height 1
    color #212529

.bd-sidenav
    display none

.bd-toc-link
    display block
    padding 4px 24px
    padding .25rem 1.5rem
    font-weight 500
    color rgba(0,0,0,.65)
    &:hover
        color rgba(0,0,0,.85)
        text-decoration none

.bd-toc-item
  &.active
      margin-bottom 16px
      margin-bottom 1rem
      &:not(:first-child)
          margin-top 16px
          margin-top 1rem
      & > .bd-toc-link
          color rgba(0,0,0,.85)
          &:hover
              background-color transparent
      & > .bd-sidenav
          display block

.bd-sidebar .nav>.active:hover>a,.bd-sidebar .nav>.active>a
    font-weight 500
    color rgba(0,0,0,.85)
    background-color transparent

.bd-footer
    font-size 85%
    text-align center
    background-color #f7f7f7
    a
        font-weight 500
        color #495057
    p
        margin-bottom 0

.bd-footer a:focus,.bd-footer a:hover
    color #007bff

@media (min-width:576px)
    .bd-footer
        text-align left

.bd-footer-links
    padding-left 0
    margin-bottom 16px
    margin-bottom 1rem
    li
        display inline-block
        & + li
            margin-left 16px
            margin-left 1rem

.bd-brand-logos
    display table
    width 100%
    margin-bottom 16px
    margin-bottom 1rem
    overflow hidden
    color #563d7c
    background-color #f9f9f9
    border-radius .25rem
    .inverse
        color #fff
        background-color #563d7c

.bd-brand-item
    padding 64px 0
    padding 4rem 0
    text-align center
    & + .bd-brand-item
        border-top 1px solid #fff
        border-top 0
        border-left 1px solid #fff
    .bd-booticon
        margin-right auto
        margin-left auto
    h1
        font-size 4rem

.bd-brand-item h1,.bd-brand-item h3
    margin-top 0
    margin-bottom 0

@media (min-width:768px)
    .bd-brand-item
        display table-cell
        width 1%
        
@-webkit-keyframes blink
  from,to
    visibility hidden
  50%
    visibility visible
    

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