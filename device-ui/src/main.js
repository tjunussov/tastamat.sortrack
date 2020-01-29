// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

// import ToggleButton from 'vue-js-toggle-button'
import BootstrapVue from 'bootstrap-vue'
import AxiosVue from './services/axios'

// import router from './router'
import store from './store'

// import VueMqtt from 'vue-mqtt'
import VueIdb from 'vue-idb'
// import { sync } from 'vuex-router-sync'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
// Vue.use(ToggleButton)
Vue.use(AxiosVue)
Vue.use(VueIdb)
// Vue.use(VueMqtt, 'ws://tasta.cubics.io:8443');
// Vue.use(VueMqtt, 'ws://smartsort.kazpost.kz:8083');

// Mocking Service
import '@/services/eventBus'
import '@/store/api/mock'
import '@/components/misc/filters.js'

Vue.config.productionTip = false

// Make store available accross all plugins
Vue.prototype.$store = store;

// Global Functions
Vue.mixin({
  methods: {
    $resetData: function (emit) {
      console.log('reset global data =', this.$options.name)
      // reset data()
      Object.assign(this.$data, this.$options.data.call(this));
      if((emit !==null && emit) || ( emit == null)) this.$emit('reset',null) /// CAUTION! May Interefere with other local events
    },
    $_clone: function (val) {
      return Object.assign({},val);
    },
    $: function (id) {
      return document.querySelector(id)
    },
    $ArrayRemoveElement(arr,item){
      let index = arr.indexOf(item);
      if(index !== -1) {
        arr.splice(index, 1);
      }
    },
    $print(){    
      window.print();
    },
  }
});


console.log("chuhan",process.env.NODE_ENV);

var aa = process.env.VERSION;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data () {
    return {
      offline:false,
      mqttOnline:false,
      isInFocusInput:false,
      version:process.env.VERSION
    }
  },
  created(){
    window.addEventListener("online",this.checkOnline)
    window.addEventListener("offline",this.checkOnline)
    // this.$mqtt.on('connect', ()=>{ this.mqttOnline = true })
    // this.$mqtt.on('offline', ()=>{ this.mqttOnline = false })
    this.checkOnline()

    // this.handleScroll = new InfiniteList(this.$refs.infinite, 'contacts', this.$store)
  },
  mounted(){
    // this.$mqtt.subscribe('sortrack/keyboard')
  },
  /*mqtt: {
    'sortrack/keyboard' (barcode) {
      console.log('mqtt keypreesed',barcode.toString(),'red');
      this.$bus.$emit('keyboard:keydown:enter:13',barcode.toString(),'red');
    }
  },*/
  beforeDestroy(){
    window.removeEventListener("online",this.checkOnline)
    window.removeEventListener("offline",this.checkOnline)
  },
  store,
  methods:{
    checkOnline(){
      console.log('check offline',!navigator.onLine);
      this.offline = !navigator.onLine
    },
  },
  render: h => h(App)
})
