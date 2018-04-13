import shop from '@/store/api/shop'
import * as types from '@/store/types'
import { uuid } from 'vue-idb'


  const state = {
    status:null,
    fiscalStatus:null,
    
    mVisaApp: {
      staticQR:"0A48219631491CCorner Store24123439Bangalore42IN53356"
    }
  }

  // getters
  const getters = {
    payStatus : state => state.status,
    fiscalStatus: state => state.fiscalStatus,
    mVisaApp : state => state.mVisaApp,
  }

  // actions
  const actions = {
    fiscalize ({commit,getters}, cart) {
      console.log('fiscalize primary!!!!!!!!!!!!');
      commit(types.FISCALIZE_PENDING)
      if(!cart.app) cart.app = {};
      cart.app.fiscal = { 
        znk:getters.currentKKM.znk, 
        rnk:getters.currentKKM.legal.rnk  
      }
      return shop.fiscalize(cart)
        .then((c)=> { commit(types.FISCALIZE_SUCCESS); return c })
        .catch(()=> commit(types.FISCALIZE_FAILURE))
        // .then((d) => commit(types.FISCALIZE_SUCCESS),d)
        // .catch(() => commit(types.FISCALIZE_FAILURE, { cart }));
    },
    paySENIM({rootState, state}, cmd) {

      var data = {
        "klik":this.klik, 
        "merchant":this.group.name,
        "amount": this.cardSum,
      };

      state.status = 'PENDING'
      // console.log(data);
      return shop.paySENIM(data).then((data)=>{
      // this.$http.post('https://api.klik.kz/invoice',data).then((response)=>{
        console.log('senim response',data);
        state.status = data.confirm

        if(data.confirm) { getters.payList[1].ui.locked = true }

        rootState.cart = Object.assign({}, getters.cart, { 
          app: { 
           senim: { ...data}
          } 
        }) // Vue caveate

        return dispatch('ordersUpdate',getters.cart)

      }).catch((e)=>{
        console.error("Error senim",e);
      })
      
    },
    payMVISA({rootState,state}, cmd) {

      var data = {
        "klik":this.klik, 
        "merchant":this.group.name,
        "amount": this.cardSum,
      };

      state.status = 'PENDING'
      // console.log(data);
      return shop.payMVISA(data).then((data)=>{
      // this.$http.post('https://api.klik.kz/invoice',data).then((response)=>{
        console.log('mvisa response',data);
        state.status = data.confirm

        if(data.confirm) { getters.payList[1].ui.locked = true }

        rootState.cart = Object.assign({}, getters.cart, { 
          app: { 
           qazkompos: { ...data}
          } 
        }) // Vue caveate

        return dispatch('ordersUpdate',getters.cart)

      }).catch((e)=>{
        console.error("Error mvisa",e);
      })

    },
    payPOS({commit, dispatch, rootState, state, getters}) {

      var cmd = {
        command: 'PUR', 
        kkm: "01", 
        amount: getters.cardSum, 
        no: getters.orderSeq
      };

      console.log('process', cmd)
      state.status = 'PENDING'

      return shop.payPOS(cmd).then((data) => {
        console.log('receieved response ', data)

        state.status = true
        getters.payList[1].ui.locked = true

        rootState.cart.cart.app.qazkompos =  { ...data}
        rootState.cart.cart = Object.assign({}, rootState.cart.cart) // Vue caveate

        console.log('saving cart pos',rootState.cart.cart);

        return dispatch('ordersUpdate',rootState.cart.cart)

      }).catch((e) => { 
        console.log('NetWork Failed',e)
        state.status = 'ERROR'
      })

    },
    payKLIK({rootState, state}, cmd){
      
      var data = {
        "klik":this.klik, 
        "merchant":this.group.name,
        "amount": this.cardSum,
      };

      state.status = 'PENDING'
      // console.log(data);
      return shop.payKLIK(data).then((data)=>{
      // this.$http.post('https://api.klik.kz/invoice',data).then((response)=>{
        console.log('klik response',data);
        state.status = data.confirm

        if(data.confirm) { getters.payList[1].ui.locked = true }

        rootState.cart = Object.assign({}, getters.cart, { 
          app: { 
           qazkompos: { ...data}
          } 
        }) // Vue caveate

        return dispatch('ordersUpdate',getters.cart)

      }).catch((e)=>{
        console.error("Error Klik",e);
      })

    }

  }

  // mutations
  const mutations = {

    [types.INITED] (state) {
      state.inited = true
    },
    [types.AUTH_SUCCESS] (state,auth){
      state.authorization = auth
    },
    [types.FISCALIZE_PENDING] (state) {
      state.fiscalStatus = "pending"
    },
    [types.FISCALIZE_SUCCESS] (state) {
      state.fiscalStatus = "success"
    },
    [types.FISCALIZE_FAILURE] (state, item) {
      state.fiscalStatus = "error"
    },

  }

  // return {

export default {
    state,
    getters,
    actions,
    mutations
  }
// }
