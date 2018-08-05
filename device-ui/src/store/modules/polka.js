import Vue from 'vue'
import {$smartsort,$leds,$sounds} from '@/store/api/http'

const state = {
  sortplan:null,
  barcode:null,
  response:null,
  closeResponse:null,
  error:null,
  depcode:null||localStorage.getItem('depcode'),
  autoDepcode:'200088',
  user:'SCNEVGENIA'||localStorage.getItem('user'),
  demo:false||(localStorage.getItem('demo') === 'true'),
  ledOn: false||(localStorage.getItem('ledOn') === 'true'),
  selected:null,
  status:null,
  index:null
}

// getters
const getters = {
  getBags : (state,getters) => getters.getSettings[0].bags,
  getSortplan : (state) => state.sortplan,
  getBarcode : (state) => state.barcode,
  getDepcode : (state) => state.depcode,
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
    if(state.selected) return getters.getBags[state.selected]
  },
  ledIndex : (state,getters) => {
    if(state.selected){
      return Object.keys(getters.getBags).findIndex((key)=>{return state.selected == key});
    }
  },
  bagMetaData : (state,getters) => {
    if(getters.getSelectedBag){
      return getters.getSelectedBag[Object.keys(getters.getSelectedBag)[0]]
    }
  }

}

// actions
const actions = {
  $initBags ({ commit, dispatch, state, getters }) {
    if(!getters.getBags){

      getters.getSettings[0].bags = {};
      var size = getters.getSettings[0].size||24;

      for(var i=0; i < size; i++){
        Vue.set(getters.getBags,'#'+i,{})
      }
    }

    // TODO Rewrite to Promise Chain
    /*
    dispatch('salesAdd',cart).then(()=>{

      commit(types.CHECKOUT_CART, cart)
      commit(types.SALE_SEQ_INCREMENT)
      commit(types.FISCALIZE_PENDING)
    })
    */
  },
  $clear ({ commit, dispatch, state, getters }) {
    state.response = null;
    state.closeResponse = null;
    state.barcode = null;
    state.status = null;
    state.error = null;
    state.selected = null;
  },
  $selectBag({ commit, dispatch, state, getters },{bagno}) {
    state.selected = bagno
    // state.selected.bag = this.bags[bagno];
    state.status = 'selectbag';
  },
  $deselectBag({ commit, dispatch, state, getters }) {
    state.status = 'deselectbag';
    window.setTimeout(()=>{
      state.selected = null
    },50);
  },
  $putToBag ({ commit, dispatch, state, getters },{barcode}) {

      dispatch('$clear');

      state.barcode = barcode
      state.status = 'search';

      //$http.get(this.barcode).then((resp)=>{
      return $smartsort.putToBag(state.barcode,state.depcode,state.user)
      .then((resp)=>{

        state.status = 'push';
        state.response = resp.data
        state.selected = resp.data.next.bagNo
        state.autoDepcode = resp.data.p_depcode // проставляем автоматический индекс пользователя
        // ложим посылку в корзину


        //////////////// ARRAY MANAGMENT

            var val = {}; val[barcode] = resp.data;

            if(getters.getBags[state.selected]){
              var currentVal = getters.getBags[state.selected];
              val = {...val,...currentVal};
            } else {
              renameEmptyKey(getters.getBags,state.selected);
            }

            Vue.set(getters.getBags,state.selected,val)

        /////////////


        return resp.data;

      }).catch((error)=>{
        state.status = 'error';
        state.error = error;

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
  $closeBag ({ commit, dispatch, state, getters },{bagno,weight,sendmeth}) {

    console.log('closeBag',bagno,weight,sendmeth);

    return $smartsort.closeBag(bagno,weight,sendmeth,state.depcode,state.user).then((resp)=>{

        state.closeResponse = resp.data

        // PARSING XML
        try {
        state.closeResponse.cli_info = xmlToJson(
          new DOMParser().parseFromString(
            state.closeResponse.cli_info, 'text/xml')
        ).CLIINFO;

      } catch(e){
        console.error('xml',e);
      }

        // Печатаем на принтере
        // $leds.$printBag(document.getElementById('bagPrintData').innerText);

        Vue.set(getters.getBags,bagno,{})
        // state.selected = bagno
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
      var bags = {}
      Object.entries(plan).forEach((item)=>{
        return bags[item[0]] = {};
      })
      getters.getSettings[0].bags = bags;

      dispatch('settingsUpdate',getters.getSettings[0]);

  },
  $fetchSortplan({ commit, dispatch, state, getters },{depcode}){
    return $smartsort.sortplan(depcode).then((resp)=>{
      state.sortplan = resp.data
      return resp;
    })
  },
  $remapSelectedBag({ commit, dispatch, state, getters },{bagno}){
    renameKey(getters.getBags,bagno,state.selected)
  }
}



// mutations
const mutations = {
  ['PUSH_TO_BAG'] (state,bagno,barcode,data) {

  },
  ['CLEAR_BAG'] (state,bagno) {
    Vue.set(state.bags,bagno,{})
  }
}


function renameEmptyKey(obj,newKey){
  var oldKey = Object.keys(obj).find((e)=>{return e.startsWith('#')})
  if(oldKey) renameKey(obj,newKey,oldKey)
}

function renameKey(obj,newKey,oldKey){
  Vue.set(obj,newKey,obj[oldKey])
  Vue.delete(obj,oldKey)
}

function xmlToJson(xml) {
  var obj = {};

  if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  // If just one text node inside
  if (xml.hasChildNodes() && xml.childNodes.length === 1 && xml.childNodes[0].nodeType === 3) {
    obj = xml.childNodes[0].nodeValue;
  }
  else if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}


  // return {

export default {
    state,
    getters,
    actions,
    mutations
  }