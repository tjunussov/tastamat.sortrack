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
  getConfig : (state,getters) => getters.getSettings[0],
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
    if(state.selected) return getters.getBags[getters.cursor]
  },
  cursor : (state,getters) => {
    if(state.selected) return getters.getBags.findIndex((key)=>{return state.selected == key.no})
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

    if(!getters.getBags){

      /*getters.getSettings[0].bags = {};
      var size = getters.getSettings[0].size||24;

      for(var i=0; i < size; i++){
        Vue.set(getters.getBags,'#'+i,{})
      }*/

      console.log('initBags');

      getters.getConfig.bags = [...new Array(getters.getConfig.size||24)].map((x,i) => { 
        return {no:'#'+i,led:null,index:'#'+i,wpi:{}}
      });

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
    return new Promise((resolve,reject)=>{
      try{
        findBag(getters.getBags,bagno);
        state.selected = bagno
        // state.selected.bag = this.bags[bagno];
        state.status = 'selectbag';
        resolve(bagno)
      } catch(e){
        state.error = e
        state.status = 'error';
        reject(e);
      }
    });
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

        // checking if bag is found in plan
        findBag(getters.getBags,resp.data.next.bagNo);

        state.response = resp.data
        state.status = 'push';
        state.selected = resp.data.next.bagNo
        state.autoDepcode = resp.data.p_depcode // проставляем автоматический индекс пользователя
        // ложим посылку в корзину


        console.log('ZputToBag barcode',state.barcode,state.selected);

        //////////////// ARRAY MANAGMENT

            var val = {}; val[barcode] = resp.data;

            var pos = getters.cursor;

            if(pos > -1){
              var currentVal = getters.getSelectedBag.wpi;
              val = {...val,...currentVal};
            } else {
              pos = renameEmptyKey(getters.getBags,state.selected);
            }

            Vue.set(getters.getBags[pos],'wpi',val)

        /////////////


        return resp.data;

      }).catch((error)=>{
        state.status = 'error';
        state.error = error;

        console.log('errorzzz');

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

        Vue.set(getters.getSelectedBag,'wpi',{})
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
      var bags = new Array();
      Object.entries(plan).forEach((item,i)=>{
        return bags.push({no:item[0],led:null,index:item[1],wpi:{}});
      })

      getters.getConfig.bags = bags;


      dispatch('settingsUpdate',getters.getSettings[0]);

  },
  $fetchSortplan({ commit, dispatch, state, getters },{depcode}){
    return $smartsort.sortplan(depcode).then((resp)=>{
      state.sortplan = resp.data
      return resp;
    })
  },
  $remapSelectedBag({ commit, dispatch, state, getters },{bagno,led}){
    findBag(getters.getBags,bagno);// just for check
    console.log('remapSelectedBag',getters.getSelectedBag,led)
    getters.getSelectedBag.no = bagno
    getters.getSelectedBag.led = led
    dispatch('settingsUpdate',getters.getSettings[0]);
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

function findBag(bags,no){
  var indx = bags.findIndex((key)=>{return no == key.no});
  if(indx < 0) throw `Отправление ${no} не привязано к плану `;
  return indx
}

function renameEmptyKey(obj,newKey){
  var indx = obj.findIndex((e)=>{return e.no.startsWith('#')})
  if(indx > -1) {
    obj[indx].no = newKey
  }
  return indx
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