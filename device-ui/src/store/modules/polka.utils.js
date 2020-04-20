import Vue from 'vue'
import {$smartsort,$http,$device} from '@/store/api/http'

const state = {
  sortplan:null,
  calibrating:false,
  demoBarcodes:null,
  loginResponse:null,
  closeModal:null,
  color:null,
}

// getters
const getters = {  
  getCalibrating : (state) => state.calibrating,
  getLastBag: (state,getters) => {
    if(getters.config.bags)
      return getters.config.bags[getters.config.bags.length - 1];
    return null
  },
  config : (state,getters) => getters.getSettingsSelected,  
  getConfig : (state,getters) => getters.config,
  getSortplan : (state) => state.sortplan,
  getDepcode : (state,getters) => getters.config?getters.config.depcode:null,
  getLedOn : (state,getters) => getters.config?getters.config.isLedOn:null,
  getDemo : (state,getters) => getters.config?getters.config.isDemo:null,
  getDemoBarcodes: (state) => state.demoBarcodes,
  getUser : (state,getters) => getters.config?getters.config.user:null,
  getLoginResponse : (state) => state.loginResponse,
  getCloseError : (state) => (state.closeModal)?state.closeModal.error:null,
  
}

// actions
const actions = {
  $onHydrated({ commit, dispatch, state, getters }){
    dispatch('settingsSelect',getters.getSettings[0]);
    if(!getters.getBags) dispatch('$initBags');
    dispatch('$initSettings');
    dispatch('$clearInserted');
  },
  $initSettings({ commit, dispatch, state, getters }){

    
    // $http.defaults.baseURL = getters.config.apiUrl;


    // $device.defaults.baseURL = getters.config.ledUrl;

    // no led if timeout
    $device.init(getters.config.leds,getters.config.size,getters.getLastBag.led,(error)=>{
      // console.error('ErroZZZ',error ) 
      // if (error == 'Error: timeout of 1000ms exceeded') getters.config.isLedOn = false;
    });


    // $device.defaults.timeout = 1000;
    // $device.interceptors.response.use(function (response) {
    //   return response;
    // }, function (error) {
    //   console.error('ErroZZZ',error ) 
    //   if (error == 'Error: timeout of 1000ms exceeded') getters.config.isLedOn = false;
    // });
  },
  $initBags ({ commit, dispatch, state, getters }) {

    

      /*getters.getSettings[0].bags = {};
      var size = getters.getSettings[0].size||24;

      for(var i=0; i < size; i++){
        Vue.set(getters.getBags,'#'+i,{})
      }*/

      console.log('initBags',getters.getConfig.size);

      var ledTemplate = [
      3,2,1,0,12,13,14,15,
      7,6,5,4,16,17,18,19,
      11,10,9,8,20,21,22,23];

      getters.getConfig.bags = [...new Array(Number(getters.getConfig.size)||24)].map((x,i) => { 
        return {ppi:'#'+i,led:ledTemplate[i%24],ppn:null,wpi:{},batch:[]}
      });

      getters.getConfig.leds = [...new Array(getters.getConfig.size/24)].map((x,i) => { 
        return '192.168.10.10'
      });
      getters.getLastBag.isErrorBag = true;
  
    // TODO Rewrite to Promise Chain
    /*
    dispatch('salesAdd',cart).then(()=>{

      commit(types.CHECKOUT_CART, cart)
      commit(types.SALE_SEQ_INCREMENT)
      commit(types.FISCALIZE_PENDING)
    })
    */
  },
  
  $save({ commit, dispatch, state, getters }){
    dispatch('settingsUpdate',getters.getSettingsSelected);
  },
  $fillBags ({ commit, dispatch, state, getters },{plan}) {
      /*Object.entries(plan).forEach((k)=>{
        renameEmptyKey(getters.getBags,k[0])
        // getters.getBags[k[0]] = {toIndex:k[1]};
      });*/
      // var bags = new Array();
      
      // plan.forEach((item,i)=>{
      //   return bags.push({ppi:item.techindex,led:null,ppn:item.nameRu,wpi:{}});
      // })

      var bags = getters.getConfig.bags;

      bags.forEach((item,i)=>{
        if(plan[i]) getters.getConfig.bags[i] = { ...item, ppi:plan[i].techindex,ppn:plan[i].nameRu, wpi:{} };
      }),

      dispatch('$save');

  },
  $fetchSortplan({ commit, dispatch, state, getters },{depcode}){
    return $smartsort.sortplan(depcode).then((resp)=>{
      state.sortplan = resp.data.parentPostIndexes
      console.log("sortplan",state.sortplan)
      Vue.set(getters.getConfig,'sortplan',state.sortplan);
      dispatch('$save');
      return resp;
    }).catch((error)=>{
      state.sortplan = null
      state.status = 'error';
      state.error = error;
      throw error;
    });
  },
  $login({ commit, dispatch, state, getters },{user}){
    return $smartsort.auth(user,getters.getDepcode).then((resp)=>{
       state.status = 'login';
       Vue.set(getters.getConfig,'user',{login:user,name:resp.data.name});
       dispatch('$save');
    }).catch((error)=>{
      state.status = 'error';
      state.loginResponse = error;
      throw error;
    });
  },
  $logout({ commit, dispatch, state, getters }){
      Vue.set(getters.getConfig,'user',null);
      state.status = 'logout';
      dispatch('$save');
  },
  $fetchDemoRPO({ commit, dispatch, state, getters }){
    return $smartsort.fetchDemoRPO(getters.getDepcode).then((resp)=>{
       state.demoBarcodes = resp.data.mails;
       console.log('fetchRPO',state.demoBarcodes);
    }).catch((error)=>{
      state.status = 'error';
      state.error = error;
      throw error;
    });
  },
  $registerDepcode({ commit, dispatch, state, getters },{depcode}){
    getters.getConfig.depcode = depcode;
    console.log('$registerdepcode',depcode);
    state.status = 'registerpoint';
    dispatch('$save');
    dispatch('$fetchSortplan',{depcode});
    
  },
  $togleDemo({ commit, dispatch, state, getters },{val}){
    // console.log('togleDemo',val)
    // console.log('demo1',val,getters.getConfig.isDemo);
    if(val !== undefined)
      getters.getConfig.isDemo = val
    else
      getters.getConfig.isDemo = !getters.getConfig.isDemo;
    // console.log('demo2',val,getters.getConfig.isDemo);
    return dispatch('$save');

  },
  $togleLed({ commit, dispatch, state, getters },{val}){
    if(val !== undefined)
      getters.getConfig.isLedOn = val
    else 
      getters.getConfig.isLedOn = !getters.getConfig.isLedOn;

    return dispatch('$save');
  },
  $setColor({ commit, dispatch, state, getters },color){
    console.log('$setColor',color);
      state.color = color
  }
}

// mutations
const mutations = {
}

export default {
    state,
    getters,
    actions,
    mutations
  }