import shop from '@/store/api/shop'
import populateData from '@/store/idb/data.js'
import * as types from '@/store/types'
import { uuid } from 'vue-idb'
import { obfuscate, ArrayRemoveElement, ArrayClone } from '@/misc/utils'


// export default (db) => {

  const state = {
    test:null,
    inited:null,
    authorization:null,
    ofdreceipt:null,
    balance:{balance:0, balanceInEther:0}
  }

  // getters
  const getters = {
    inited : state => state.inited,
    balance : state => state.balance,
    ofdreceipt : state => state.ofdreceipt,
    authorization: state => state.authorization,
    currentKKM: (state,getters) => { 
      if(getters.getGroupSelected && getters.getGroupSelected.kassa && getters.getConfigSelected && getters.getConfigSelected.currentKKMIndex != null){
        return getters.getGroupSelected.kassa.kkms[getters.getConfigSelected.currentKKMIndex]
      }
      return null
    },
    currentKassa: (state,getters) => { 
      if(getters.getGroupSelected && getters.getGroupSelected.kassa){
        return getters.getGroupSelected.kassa
      }
      return null
    },
    // security: (state,getters) => { 
    //   if(getters.getGroupSelected && getters.getGroupSelected.security){
    //     return getters.getGroupSelected.security
    //   }
    //   return null
    // },
    
    currentUser: (state,getters) => { 
      if(getters.getGroupSelected && getters.getGroupSelected.security && getters.getConfigSelected && getters.getConfigSelected.currentUserKey ){
        return getters.getGroupSelected.security.users[getters.getConfigSelected.currentUserKey]
      }
      return null
    },
    currentUserKey: (state,getters) => { 
      if( getters.getConfigSelected && getters.getConfigSelected.currentUserKey ){
        return getters.getConfigSelected.currentUserKey
      }
      return null
    },
    isAdmin: (state,getters) => { 
      if(getters.currentUser){
        return getters.currentUser.role && getters.currentUser.role == 'admin'
      }
      return null
    },

    buyerContact : (state,getters) => {
     if(getters.getGroupSelected && getters.getGroupSelected.kassa ){
        return getters.getGroupSelected.kassa.legal
      }
      return null
    },
    sellerContact : (state,getters) => {
     if(getters.getGroupSelected && getters.getGroupSelected.kassa && getters.getConfigSelected && getters.getConfigSelected.currentGroupIndex != null ){
        return getters.getGroupSelected.kassa.legal
      }
      return null
    },
  }

  // actions
  const actions = {
    switchKKM ({commit,dispatch,getters}, {groupIndex,kkmIndex}) {
      
        // .then((d) => commit(types.FISCALIZE_SUCCESS),d)
        // .catch(() => commit(types.FISCALIZE_FAILURE, { cart }));
      console.log('switchKKM',groupIndex,kkmIndex);

      var config = getters.getConfigSelected
          config.currentKKMIndex = kkmIndex
      // config.currentGroupIndex = user

      // dispatch('configUpdate',config)

    },
    switchUser ({commit, dispatch, getters}, {key,val,pin}) { // TODO refactor to simple
      return new Promise((resolve, reject)=>{ 
        // console.log('switchUser',key,pin);

        if(pin){
          pin = pin.hashCode()
          key = Object.entries(getters.getGroupSelected.security.users).find((item)=>{
              return item[1].pin == pin
          });
          // console.log('keyFound',key,pin);
          if(key) 
            key = key[0] // setting key of entry of USERS
          else {
            return reject("Неверный PIN")
            
          }

        } else if( val && val.pin ){
          return reject("Укажите PIN")
        } else { 

          // key is new User or Existing
          var _sec = getters.getGroupSelected.security;
          if(key && _sec.autoCreateUser && !_sec.users[key]){
            _sec.users[key] = {pin:""}
            dispatch('groupUpdate',getters.getGroupSelected)
          }

        }

        // set key
        var config = getters.getConfigSelected
            config.currentUserKey = key

        if(key) {
          shop.auth(key).then((authData)=>{
            commit(types.AUTH_SUCCESS,authData)
          })
        } else {
          shop.logout(key)
        }

        dispatch('configUpdate',config).then(()=>{
          resolve()
        })

      })
    },
    updateComethBalance({state}, balance){
      console.log('updateComethBalance',balance);
      state.balance = balance
    },
    receiptCometh({state}, receipt){
      state.ofdreceipt = receipt

    },
    switchGroup ({commit}, name) {
      // commit(types.SALE_SEQ_INCREMENT)
    },
    storeReset ({commit, dispatch, state, getters}) {
      console.log('storeReset');
      dispatch('itemsReset');
      dispatch('ordersReset');
    },
    storePopulate ({commit, dispatch, state, getters}, $db) {
      $db.on("populate",()=>{
        populateData.populate($db)
      });
    },
    storeInit ({commit, dispatch, state, getters}, $db) {

      if(getters.getConfig && getters.getConfig.length > 0){
        dispatch('configSelect',getters.getConfig[0]).then(()=>{
          if(getters.getGroup && getters.getGroup.length > 0){
            dispatch('groupSelect',getters.getGroup[getters.getConfigSelected.currentGroupIndex])
            commit(types.INITED)
          }
        }); // firstConfig
      }

      dispatch('ordersSetPage', 1)
      dispatch('itemsSetPage', 1)
      dispatch('contactsSetPage', 1)

      dispatch('hydrateCart',$db) // заполняем дефолтовые данные
    },
  }

  // mutations
  const mutations = {

    [types.INITED] (state) {
      state.inited = true
    },
    [types.AUTH_SUCCESS] (state,auth){
      state.authorization = auth
    }

  }

  // return {

export default {
    state,
    getters,
    actions,
    mutations
  }
// }
