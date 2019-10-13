import Vue from 'vue'
import {$smartsort,$leds,$sounds} from '@/store/api/http'

const state = {
  sortplan:null,
  barcode:null,
  response:null,
  closeResponse:null,
  error:null,
  depcode:'055990'||localStorage.getItem('depcode'),
  user:'test.alm21.rpo1'||localStorage.getItem('user'),
  demo:false||(localStorage.getItem('demo') === 'true'),
  ledOn: false||(localStorage.getItem('ledOn') === 'true'),
  selected:null,
  status:null,
  index:null
}

// getters
const getters = {
  config : (state,getters) => getters.getSettings[0],
  getBags : (state,getters) => getters.getSettings[0]?getters.getSettings[0].bags:null,
  getConfig : (state,getters) => getters.config,
  getSortplan : (state) => state.sortplan,
  getBarcode : (state) => state.barcode,
  getDepcode : (state) => state.depcode ? state.depcode : state.autoDepcode,
  getAutoDepcode : (state) => state.depcode ? state.depcode : state.autoDepcode,  
  getLedOn : (state) => state.ledOn,
  getDemo : (state) => state.demo,
  getStatus : (state) => state.status,
  getUser : (state) => state.user,
  getError : (state) => state.error,
  getResponse : (state) => state.response,
  getCloseResponse : (state) => state.closeResponse,
  getSelected : (state) => state.selected,
  getSelectedBag: (state,getters) => {
    if(state.selected) return getters.getBags[getters.cursor]
  },
  cursor : (state,getters) => {
    if(state.selected) return getters.getBags.findIndex((key)=>{return state.selected == key.ppi})
  },
  bagMetaData : (state,getters) => {
    if(getters.getSelectedBag){
      return getters.getSelectedBag.wpi[Object.keys(getters.getSelectedBag.wpi)[0]]
    }
  }

}

// actions
const actions = {
  $initBags ({ commit, dispatch, state, getters }) {

    

      /*getters.getSettings[0].bags = {};
      var size = getters.getSettings[0].size||24;

      for(var i=0; i < size; i++){
        Vue.set(getters.getBags,'#'+i,{})
      }*/

      console.log('initBags',getters.getConfig.size);

      getters.getConfig.bags = [...new Array(Number(getters.getConfig.size)||24)].map((x,i) => { 
        return {ppi:'#'+i,led:null,ppn:'#'+i,wpi:{}}
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
  $saveConfig({ commit, dispatch, state, getters }){
    dispatch('settingsUpdate',getters.getSettings[0]);
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
  $putToBag ({ commit, dispatch, state, getters },{barcode}) {

      dispatch('$clear');

      state.barcode = barcode
      state.status = 'search';


      // console.log('$smartsort.putToBag',state.barcode,state.depcode,state.user);

      //$http.get(this.barcode).then((resp)=>{
      return $smartsort.putToBag(state.barcode,getters.getDepcode,state.user)
      .then((resp)=>{

        // console.log('putToBag',resp);

        resp = resp.data 

        console.log('1 ZputToBag barcode',state.barcode,resp.parentPostIndex);

        // checking if bag is found in plan
        findBag(getters.getBags,resp.parentPostIndex);

        state.response = resp
        state.status = 'push';
        state.selected = resp.parentPostIndex
        state.autoDepcode = resp.postIndex // проставляем автоматический индекс пользователя
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

            dispatch('settingsUpdate',getters.getSettings[0]);

        /////////////


        return resp;

      }).catch((error)=>{
        state.status = 'error';
        state.error = error.message?error.message:error;

        console.log('errorzzz',error);

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
  $closeBag ({ commit, dispatch, state, getters },{ppi,wpi,weight,sendmeth}) {

    console.log('closeBag',ppi,wpi,weight,sendmeth);


    return $smartsort.closeBag(ppi,wpi,String(weight),String(sendmeth),state.depcode,state.user).then((resp)=>{

        state.closeResponse = resp.data

        // Печатаем на принтере
        // $leds.$printBag(document.getElementById('bagPrintData').innerText);

        Vue.set(getters.getSelectedBag,'wpi',{})
        // state.selected = ppi
        state.status = 'closebag';

        return resp.data
        
      }).catch((error)=>{
        console.log('error',error);
        state.status = 'error';
        state.closeResponse = error.response?error.response.data:{"error":"catch"}
      });

    
  },
  $fillBags ({ commit, dispatch, state, getters },{plan}) {
      /*Object.entries(plan).forEach((k)=>{
        renameEmptyKey(getters.getBags,k[0])
        // getters.getBags[k[0]] = {toIndex:k[1]};
      });*/
      var bags = new Array();
      
      plan.forEach((item,i)=>{
        return bags.push({ppi:item.techindex,led:null,ppn:item.nameRu,wpi:{}});
      })

      getters.getConfig.bags = bags;

      dispatch('$saveConfig');

  },
  $fetchSortplan({ commit, dispatch, state, getters },{depcode}){
    return $smartsort.sortplan(depcode).then((resp)=>{

      state.sortplan = resp.data.parentPostIndexes
      console.log("sortplan",state.sortplan)
      return resp;
    })
  },
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