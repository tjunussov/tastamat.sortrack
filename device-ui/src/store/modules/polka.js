import Vue from 'vue'
import {$smartsort,$http,$device} from '@/store/api/http'

const state = {
  sortplan:null,
  barcode:null,
  response:null,
  closeResponse:null,
  loginResponse:null,
  error:null,
  calibrating:false,
  selected:null,
  status:null,
  index:null,
  demoBarcodes:null
}

// getters
const getters = {
  config : (state,getters) => getters.getSettingsSelected,
  getBags : (state,getters) => getters.getSettingsSelected?getters.getSettingsSelected.bags:null,
  getConfig : (state,getters) => getters.config,
  getSortplan : (state) => state.sortplan,
  getBarcode : (state) => state.barcode,
  getDepcode : (state,getters) => getters.config?getters.config.depcode:null,
  getLedOn : (state,getters) => getters.config?getters.config.isLedOn:null,
  getDemo : (state,getters) => getters.config?getters.config.isDemo:null,
  getDemoBarcodes: (state) => state.demoBarcodes,
  getCalibrating : (state) => state.calibrating,
  getStatus : (state) => state.status,
  getUser : (state,getters) => getters.config?getters.config.user:null,
  getError : (state) => state.error,
  getResponse : (state) => state.response,
  getCloseResponse : (state) => state.closeResponse,
  getLoginResponse : (state) => state.loginResponse,
  
  getSelected : (state) => state.selected,
  getLastBag: (state,getters) => {
    if(getters.config.bags)
      return getters.config.bags[getters.config.bags.length - 1];
    return null
  },
  getSelectedBag: (state,getters) => {
    if(state.selected) return getters.getBags[getters.cursor]
  },
  cursor : (state,getters) => {
    if(state.selected) return getters.getBags.findIndex((key)=>{return state.selected == key.ppi})
  },
  thor : (state,getters) => {
      if(typeof getters.cursor !== 'undefined') return  Math.floor(getters.cursor/24)
  },
  bagMetaData : (state,getters) => {
    if(getters.getSelectedBag){
      return getters.getSelectedBag.wpi[Object.keys(getters.getSelectedBag.wpi)[0]]
    }
  }

}

// actions
const actions = {
  $onHydrated({ commit, dispatch, state, getters }){
    dispatch('settingsSelect',getters.getSettings[0]);
    if(!getters.getBags) dispatch('$initBags');
    dispatch('$initSettings');
  },
  $initSettings({ commit, dispatch, state, getters }){
    $http.defaults.baseURL = getters.config.apiUrl;


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
        return {ppi:'#'+i,led:ledTemplate[i%24],ppn:null,wpi:{}}
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
  $clear ({ commit, dispatch, state, getters }) {
    state.response = null;
    state.closeResponse = null;
    state.barcode = null;
    state.status = null;
    state.error = null;
    state.selected = null;
  },
  $selectBag({ commit, dispatch, state, getters },{ppi}) {
    return new Promise((resolve,reject)=>{
      try{
        findBag(getters.getBags,ppi);
        state.selected = ppi
        // state.selected.bag = this.bags[ppi];
        state.status = 'selectbag';
        resolve(ppi)
      } catch(e){
        state.error = e
        state.status = 'error';
        reject(e);
      }
    });
  },
  $deselectBag({ commit, dispatch, state, getters }) {
    state.status = 'deselectbag';
    // state.selected = null
    window.setTimeout(()=>{
      state.selected = null
    },50);
  },
  $removeWpi({ commit, dispatch, state, getters },{barcode}){

    console.log('removeWpi',barcode);
    
    if(confirm('Вы уверены что хотите удалить ' + barcode)) {
      Vue.delete(getters.getSelectedBag.wpi,barcode);
      state.status = 'pull';
      dispatch('$save');
    }
  },
  $forcePutToBag({ commit, dispatch, state, getters },{barcode}){

    

    if(barcode in getters.getSelectedBag.wpi){
      state.status = 'pull';
      Vue.delete(getters.getSelectedBag.wpi,barcode);
      dispatch('$save');
    } else {
      state.status = 'forcepush';

      var val = {}; val[barcode] = {"forcepush":true};
      var currentVal = getters.getSelectedBag.wpi;
          val = {...val,...currentVal};
      Vue.set(getters.getSelectedBag,'wpi',val)
      dispatch('$save');
    }

  },
  $putToBag ({ commit, dispatch, state, getters },{barcode}) {

      dispatch('$clear');

      state.barcode = barcode
      state.status = 'search';


      // console.log('$smartsort.putToBag',state.barcode,state.depcode,state.user);

      //$http.get(this.barcode).then((resp)=>{
      return $smartsort.putToBag(state.barcode,getters.getDepcode,getters.getUser?getters.getUser.login:null)
      .then((resp)=>{

        // console.log('putToBag',resp);

        resp = resp.data 

        console.log('1 ZputToBag barcode',state.barcode,resp.parentPostIndex);

        // checking if bag is found in plan
        findBag(getters.getBags,resp.parentPostIndex);

        state.response = resp
        state.status = 'push';
        state.selected = resp.parentPostIndex
        // ложим посылку в корзину


        console.log('2 ZputToBag barcode',state.barcode,state.selected);

        //////////////// ARRAY MANAGMENT

            var val = {}; val[barcode] = resp;

            var pos = getters.cursor;

            if(pos > -1){
              var currentVal = getters.getSelectedBag.wpi;
              val = {...val,...currentVal};
            } else {
              pos = renameEmptyKey(getters.getBags,state.selected);
            }

            Vue.set(getters.getBags[pos],'wpi',val)

            dispatch('$save');

        /////////////


        return resp;

      }).catch((error)=>{
        state.status = 'error';
        state.error = error.message?error.message:error;

        // console.log('errorzzz',error);

        var val = {}; val[barcode] = state.error;
        var currentVal = getters.getLastBag.wpi;
            val = {...val,...currentVal};
        Vue.set(getters.getLastBag,'wpi',val)
        dispatch('$save');

        throw error;
        // this.status = 'notfound';
        // this.status = 'notbind';
        // this.status = 'notfoundnextplan';
      });

    // TODO Rewrite to Promise Chain
    /*
    dispatch('salesAdd',cart).then(()=>{

      commit(types.CHECKOUT_CART, cart)
      commit(types.SALE_SEQ_INCREMENT)
      commit(types.FISCALIZE_PENDING)
    })
    */

        
  },
  $closeBag ({ commit, dispatch, state, getters },{ppi,wpi,weight,sendmeth,plomba,bagType,taraType,comment}) {

    console.debug('closeBag',ppi,wpi,weight,sendmeth,plomba,bagType,taraType,comment);

    // weight = String(weight).replace(".","").replace(",","");
    weight = String(Number(weight)*1000);


    return $smartsort.closeBag(
        ppi,wpi,weight,String(sendmeth),getters.getDepcode,getters.getUser.login,String(plomba),
        String(bagType),String(taraType),comment
        ).then((resp)=>{

        state.closeResponse = resp.data

        // Печатаем на принтере
        // $leds.$printBag(document.getElementById('bagPrintData').innerText);

        Vue.set(getters.getSelectedBag,'wpi',{})
        Vue.set(getters.getSelectedBag,'closeResponse',state.closeResponse)
        
        // state.selected = ppi
        state.status = 'closebag';
        dispatch('$save');

        return resp.data
        
      }).catch((error)=>{
        console.error('error',error);
        state.status = 'error';
        state.error = error.response?error.response.data:error.message
        return Promise.reject(state.error);
        // state.closeResponse = error.response?error.response.data:{"error":"catch"}
      });

    
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
       console.log('login',user,getters.getDepcode,resp);
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
  }
  // $remapSelectedBag({ commit, dispatch, state, getters },{ppi,led}){
  //   // findBag(getters.getBags,ppi);// just for check
  //   console.log('remapSelectedBag',getters.getSelectedBag,led)
  //   getters.getSelectedBag.led = led
  //   getters.getSelectedBag.ppi = ppi
  //   dispatch('$saveConfig');
  // },


}

// mutations
const mutations = {
  ['PUSH_TO_BAG'] (state,ppi,barcode,data) {

  },
  ['CLEAR_BAG'] (state,ppi) {
    Vue.set(state.bags,ppi,{})
  }
}

function findBag(bags,ppi){
  var indx = bags.findIndex((key)=>{return ppi == key.ppi});
  if(indx < 0) indx = renameEmptyKey(bags,ppi) // Пытаюсь найти свободную ячейку
  if(indx < 0) throw `Индекс назначения ${ppi} не привязан ни к одной корзине!`;
  return indx
}

function renameEmptyKey(obj,newKey){
  var indx = obj.findIndex((e)=>{return e.ppi.startsWith('#')})
  if(indx > -1) {
    obj[indx].ppi = newKey
  }
  return indx
}

  // return {

export default {
    state,
    getters,
    actions,
    mutations
  }