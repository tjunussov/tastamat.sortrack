import Vue from 'vue'
import {$leds,$smartsort,$http,$sound} from '@/store/api/http'
import * as types from '@/store/types'

const state = {
  barcode:null,
  
  response:null,
  closeResponse:null,
  error:null,
  selected:null,
  inserted:null,
  status:null,
  index:null, 

  consoles:{
    'R':{ req:null, color:'R', bgColor:'danger' },
    // 'G':{ req:null, color:'G', bgColor:'success'},
    // 'B':{ req:null, color:'B', bgColor:'primary' }
  }
}

// getters
const getters = {
  getConsoles : (state,getters) => state.consoles,
  getBags : (state,getters) => getters.getSettingsSelected?getters.getSettingsSelected.bags:null,
  // getBarcode : (state) => state.barcode,
  // getStatus : (state) => state.status,
  // getError : (state) => state.error,
  getResponse : (state) => state.response,
  getCloseResponse : (state) => state.closeResponse,
  getSelected : (state) => state.selected,
  getWeight : (state,getters) => { 
    if(getters.getSelectedBag)
      return Object.values(getters.getSelectedBag.wpi).reduce((t,k)=> t + (k.weight?k.weight:0),0)
    else return null
  },  
  
  getSelectedBag: (state,getters) => {
    if(state.selected) return getters.getBags[getters.cursor]
  },
  getInserted : (state,getters) => {
    if(state.inserted||state.selected) return getters.getBags.findIndex((key)=>{return (state.selected?state.selected:state.inserted) == key.ppi}) 
  },
  cursor : (state,getters) => {
    if(state.selected) return getters.getBags.findIndex((key)=>{return state.selected == key.ppi})
  },
  thor : (state,getters) => {
    return  (typeof getters.getInserted !== 'undefined')?Math.floor(getters.getInserted/24):0
  },
  bagMetaData : (state,getters) => {
    if(getters.getSelectedBag){
      return getters.getSelectedBag.wpi[Object.keys(getters.getSelectedBag.wpi)[0]]
    }
  }

}

// actions
const actions = {
  $clear ({ commit, dispatch, state, getters }) {
    console.debug('clearing');
    state.response = null;
    // state.closeResponse = null; #после закрытия мешка, через 10 сек, удалался ярлык
    state.barcode = null;
    state.status = null;
    state.error = null;

    // dispatch('$clearInserted');
    // state.selected = null; // если очищать selected то если модалка открыта, и если произошла ошибка то он тоже очищается,
  },
  $clearSelected({ commit, dispatch, state, getters }){
    state.selected = null;
  },
  $clearInserted({ commit, dispatch, state, getters }){
    getters.getBags.forEach((bag,i)=>{
      Vue.delete(bag,'color');
    })
  },
  $clearCloseResponse({ commit, dispatch, state, getters }){
    state.closeResponse = null;
  },
  $selectBag({ commit, dispatch, state, getters },{ppi}) {
    return new Promise((resolve,reject)=>{
      try{
        findBag(getters.getBags,ppi);
        state.selected = ppi
        state.inserted = ppi
        $leds.xon({status:'selectbag',color:'all',led:getters.getSelectedBag.led,thor:getters.thor});
        // state.selected.bag = this.bags[ppi];
        // state.status = 'selectbag';
        dispatch('$consoleStatus',{color:'R',req:{status:'selectbag'}});
        resolve(ppi)
      } catch(e){
        state.error = e
        state.status = 'error';
        reject(e);
      }
    });
  },
  $deselectBag({ commit, dispatch, state, getters }) {
    // state.status = 'deselectbag';

    dispatch('$consoleStatus',{color:'all',req:{status:'deselectbag'}});

    $leds.xon({status:'deselectbag',color:'all',led:getters.getSelectedBag.led,thor:getters.thor});
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
  $removeB({ commit, dispatch, state, getters },{b}){

    console.log('removeB',b);
    
    if(confirm('Вы уверены что хотите удалить ' + b)) {
      // Vue.delete(getters.getSelectedBag.batch,b);
      getters.getSelectedBag.batch.splice(b, 1);
      state.status = 'pull';
      dispatch('$save');
    }
  },
  
  $forcePutToBag({ commit, dispatch, state, getters },{barcode}){

    barcode = barcode.toUpperCase().replace(/\s/g,"");

    // state.barcode = barcode
    // state.status = 'search';

    if(barcode in getters.getSelectedBag.wpi){
      state.status = 'pull';
      Vue.delete(getters.getSelectedBag.wpi,barcode);
      dispatch('$save');
    } else {


      var response;

      
      
      return $smartsort.forcePutToBag(barcode,getters.getDepcode,getters.getUser?getters.getUser.login:null)
      .then((resp)=>{

        checkUniqueBarcode(getters.getBags,barcode);
        response = resp.data

        dispatch('$consoleStatus',{color:'R',req:{status:'forcepush',response}});

        console.debug('2 forcePutToBag barcode',barcode,response.parentPostIndex);

        /*var val = {}; val[barcode] = response; val[barcode].forcepush = true;
        var currentVal = getters.getSelectedBag.wpi;
          val = {...val,...currentVal};
        Vue.set(getters.getSelectedBag,'wpi',val)*/


        var selectBag = getters.getSelectedBag;

        getters.getBags.forEach((bag,i)=>{
          if(bag.ppi == selectBag.ppi){
            response.forcepush = true;
            Vue.set(bag.wpi,barcode,response);
          }
        })

        dispatch('$save');

        return response;

      }).catch((error)=>{
        error = error.message?error.message:error.resultInfo;
        dispatch('$consoleStatus',{color,req:{barcode,status:'error',response:error,error}});
      });

      
    }

  },
  $putToBag ({ commit, dispatch, state, getters },{barcode,color}) {

      barcode = barcode.toUpperCase().replace(/\s/g,"");
      dispatch('$consoleStatus',{color,req:{status:'search',response:null,barcode}});

      return $smartsort.putToBag(barcode,getters.getDepcode,getters.getUser?getters.getUser.login:null)
      .then((resp)=>{

        resp = resp.data 
        // checking if bag is found in plan
        checkUniqueBarcode(getters.getBags,barcode);
        // Laizy Initialization of Bags, TODO! Need to rename it
        findBag(getters.getBags,resp.parentPostIndex,barcode);
        // setting console
        dispatch('$consoleStatus',{color,req:{status:'push',response:resp}});

        // Putting to bug
        getters.getBags.forEach((bag,i)=>{
          if(bag.color && bag.color[color]){
            Vue.delete(bag.color,color); // removing color
          }
          if(bag.ppi == resp.parentPostIndex){
            state.inserted = bag.ppi
            Vue.set(bag.wpi,barcode,resp);
            if(!bag.color) Vue.set(bag,'color',{}) // initialize color
            Vue.set(bag.color,color,kolor(color));
            // $leds.xon({status:'push',color:bag.color,led:bag.led,thor:getters.thor});

            $leds.xon({status:'push',color,led:bag.led,thor:getters.thor});
          }  
        })

        dispatch('$save');

        return resp;

      }).catch((error)=>{

        error = error.message?error.message:error
        dispatch('$consoleStatus',{color,req:{barcode,status:'error',response:null,error}});

        // Putting to error bags
        getters.getBags.forEach((bag,i)=>{
          if(bag.isErrorBag) {
            state.inserted = bag.ppi;
            Vue.set(bag.wpi,barcode,error);
            if(!bag.color) Vue.set(bag,'color',{}) // initialize color
            Vue.set(bag.color,color,kolor(color));

            $leds.xon({status:'error',color,led:bag.led,thor:getters.thor});
          }
        });

        dispatch('$save');

        throw error;
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
  $formBag ({ commit, dispatch, state, getters },{ppi,wpi,weight,sendmeth,plomba,bagType,taraType,comment}) {

    console.debug('formBag',ppi,wpi,weight,sendmeth,plomba,bagType,taraType,comment);

    // weight = String(weight).replace(".","").replace(",","");
    weight = (Number(weight)*1000).toFixed(0);


    return $smartsort.formBag(
        ppi,wpi,weight,String(sendmeth),getters.getDepcode,getters.getUser.login,String(plomba),
        String(bagType),String(taraType),comment
        ).then((resp)=>{

        state.closeResponse = resp.data

        // Печатаем на принтере
        // $leds.$printBag(document.getElementById('bagPrintData').innerText);

        Vue.set(getters.getSelectedBag,'wpi',{})
        Vue.set(getters.getSelectedBag,'closeResponse',state.closeResponse)

        // Vue.set(getters.getSelectedBag,'batch',{})
        
        // state.selected = ppi
        state.status = 'formbag';
        dispatch('$save');

        return resp.data
        
      }).catch((error)=>{
        console.error('error',error);
        state.status = 'error';
        state.error = error.response?error.response.data:error.message||error
        return Promise.reject(state.error);
        // state.closeResponse = error.response?error.response.data:{"error":"catch"}
      });

    
  },
  $formBagByPacklist({ commit, dispatch, state, getters },{ppi,packList,weight,sendmeth,plomba,bagType,taraType,comment}) {

    console.debug('formBagByPacklist',ppi,packList,weight,sendmeth,plomba,bagType,taraType,comment);

    // weight = String(weight).replace(".","").replace(",","");
    weight = (Number(weight)*1000).toFixed(0);


    return $smartsort.formBagByPacklist(
        ppi,packList,weight,String(sendmeth),getters.getDepcode,getters.getUser.login,String(plomba),
        String(bagType),String(taraType),comment
        ).then((resp)=>{

        console.log(resp.data);

        state.closeResponse = resp.data

        // Печатаем на принтере
        // $leds.$printBag(document.getElementById('bagPrintData').innerText);

        Vue.set(getters.getSelectedBag,'batch',[])
        Vue.set(getters.getSelectedBag,'closeResponse',state.closeResponse)

        // Vue.set(getters.getSelectedBag,'batch',{})
        
        // state.selected = ppi
        state.status = 'formbagbypacklist';
        dispatch('$save');

        return resp.data
        
      }).catch((error)=>{
        console.error('error',error);
        state.status = 'error';
        state.error = error.response||error.message||error
        return Promise.reject(state.error);
        // state.closeResponse = error.response?error.response.data:{"error":"catch"}
      });

    
  },
  $formB({ commit, dispatch, state, getters },{ppi,wpi}) {

    // weight = String(Number(weight)*1000);

    console.debug('formB',ppi,wpi,wpi.length);

    return $smartsort.formB(
        ppi,wpi,wpi.length,String(getters.getWeight),getters.getDepcode,getters.getUser.login
        ).then((resp)=>{

          // var val = {}; val[resp.data.packetListNo] = resp.data;
          // var currentBatchVal = getters.getSelectedBag.batch;
          //   val = {...val,...currentBatchVal};

          // Vue.set(getters.getSelectedBag,'batch',val)

          if(getters.getSelectedBag.batch == null) getters.getSelectedBag.batch = [];

          getters.getSelectedBag.batch.push(resp.data);
          Vue.set(getters.getSelectedBag,'wpi',{})

          state.response = resp.data
          state.status = 'formb';
          dispatch('$save');

          return resp.data
        }).catch((error)=>{
          console.error('error',error);
          state.status = 'error';
          state.error = error.response||error.message||error
          return Promise.reject(state.error);
          // state.closeResponse = error.response?error.response.data:{"error":"catch"}
      });

  },
  $remapPpi({ commit, dispatch, state, getters },{i,ppi}){

    console.debug('calibrateMapBagBarcode',ppi,i);

    Vue.set(getters.getConfig.bags[i],'ppi',ppi);

    state.status = 'bindinline';

    if(getters.getConfig.sortplan){
      var ppn = getters.getConfig.sortplan.find((k)=>{
        return k.techindex == ppi
      })
      if(ppn)
        Vue.set(getters.getConfig.bags[i],'ppn',ppn.nameRu);
      else
        console.debug('calibrateMapBagBarcode not found ppi in sortplan',ppi);
    }

  },
  $consoleStatus({ commit, dispatch, state, getters },{color,req}){

    // var led = getters.selectedBag && getters.selectedBag.led !== null ? getters.selectedBag.led : getters.cursor;
    console.debug('consoleStatus',color,req.status);

    $sound.play(req.status);

    if(color == 'all') return;

    commit(types.CONSOLE_SET,{color,req});

    // commit(types.LED_SET,{thor:getters.thor,led,color,status:req.status});

    state.consoles[color].timeout = setTimeout(() => {
      commit(types.CONSOLE_CLEAR,color);
      getters.getBags.forEach((bag,i)=>{
        if(bag.color && bag.color[color])
          Vue.delete(bag.color,color);
      })
    },req.error?5000:10000);
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
  },
  ['STATUS_SET'] (state,status) {
    // console.debug('consoleStatus',color,status,led,getters.thor);
    // var led = getters.selectedBag && getters.selectedBag.led !== null ? getters.selectedBag.led : getters.cursor;
    // if(getters.ledOn) $leds.on(status,led,getters.thor,color);
  },
  ['CONSOLE_SET'] (state,payload) {

    //Lazy init consoles
    if(!state.consoles[payload.color]){
      Vue.set(state.consoles,payload.color,{
        req:null, color:payload.color, bgColor:kolor(payload.color)
      })
    }

    // Autotimeout
    if(state.consoles[payload.color] && state.consoles[payload.color].timeout) clearTimeout(state.consoles[payload.color].timeout);

    state.consoles[payload.color].req = payload.req;

    // state.consoles[payload.color].timeout = setTimeout((s,c) => {
    //   s.consoles[c] = null
    // },10000,state,payload.color);
  },
  ['CONSOLE_CLEAR'] (state,color) {
    if(state.consoles[color] && state.consoles[color].timeout) clearTimeout(state.consoles[color].timeout);
    state.consoles[color].req = null;
  },
  
}

function findBag(bags,ppi,barcode){
  var indx = bags.findIndex((key)=> ppi == key.ppi );
  if(indx < 0) indx = renameEmptyKey(bags,ppi) // Пытаюсь найти свободную ячейку
  if(indx < 0) throw `Индекс назначения ${ppi} не привязан ни к одной корзине!`;
  return indx
}

function checkUniqueBarcode(bags,barcode){
  console.debug('checkUniqueBarcode',barcode);
  bags.every((key)=> {
    if(key.wpi[barcode]) {
      console.debug('found dublicate checkUniqueBarcode-->',key.wpi,barcode,key.wpi[barcode])
      throw `Отправление ${barcode} уже лежит в ячейке ${key.ppi} !`;
    }
    return true;
  });
}


function renameEmptyKey(obj,newKey){
  var indx = obj.findIndex((e)=>{return e.ppi.startsWith('#')})
  if(indx > -1) {
    obj[indx].ppi = newKey
  }
  return indx
}


export function kase(val,map,els){
  // console.log('kase',val);
  if(val)
    return map[val] || els;
  else 
    return els;
}

export function kolor(val){ return kase(val,{'G':'success','B':'primary','random':'dark'},'danger') };

export default {
    state,
    getters,
    actions,
    mutations
  }