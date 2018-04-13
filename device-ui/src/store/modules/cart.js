import shop from '@/store/api/shop'
import * as types from '@/store/types'
import { uuid } from 'vue-idb'
import Vue from 'vue'
import { obfuscate, ArrayRemoveElement, ArrayClone } from '@/misc/utils'


// export default (db) => {


  var PAY_LIST_DEFAULT = [];
  const state = {
    checkoutStatus: null,
  }

  // getters
  const getters = {
    checkoutStatus: state => state.checkoutStatus,
    _payerContact(state,getters){ 
      return getters.getOrdersSelected.buyList.contact 
    },
    _buyList(state,getters){ 
      return getters.getOrdersSelected.buyList.items 
    },
    _payList(state,getters){ 
      return getters.getOrdersSelected.payList.items 
    },
    _buyTotal(state,getters,){

      if(!getters.getOrdersSelected.buyList.items) {
        return 0
      }
      return getters.getOrdersSelected.buyList.items.reduce(function (a, b) {
        if(b.ui.disabled) 
          return a
        else
          return a + b.sum
      }, 0);
    },
    _payTotal(state,getters){
      if(!getters.getOrdersSelected.payList.items) return 0

      // autoCalc Cash sum ( including Card Payment ) 
      if(getters.getOrdersSelected.payList.items && getters.getOrdersSelected.payList.items[0] && getters.getOrdersSelected.payList.items[0].ui && !getters.getOrdersSelected.payList.items[0].ui.manualEnter){
        var dif = getters._buyTotal - (getters.getOrdersSelected.payList.items[1]?getters.getOrdersSelected.payList.items[1].sum:0)
        // console.log('syncPaymentsum 2 ',dif, total, cardsum);
        if(dif >= 0){
          // console.log('syncPaymentsum 3', dif);
          getters.getOrdersSelected.payList.items[0].sum = dif
        } else {
          getters.getOrdersSelected.payList.items[0].sum = 0
        }
      }

      return getters.getOrdersSelected.payList.items.reduce(function (a, b) {
        if(b.ui.disabled) 
          return a
        else
          return a + b.sum
      }, 0);
    },
    _excess: (state,getters) => { 
      return getters._payTotal - getters._buyTotal
    },
    _cardsum: (state,getters) => {
      return getters.getOrdersSelected.payList.items[1].sum
    }
  }


  // actions
  const actions = {
    itemsReset({ commit, dispatch, state, getters }){


      console.log('itemsReset');

      return dispatch('itemsSelect',{
        name:"Позиция",
        sum:null,
        discount:0,
        discountLabel:null,
        type_:"product",
        quantity:1,
        price:null,
        ui:{ disabled: false, manualEnter:true }
      });

    },
    ordersReset ({ commit, dispatch, state, getters }) {

      console.log('ordersReset');

      // const savedCartItems = [...state.buyList]
      // commit(types.CHECKOUT_REQUEST)
      // TODO Rewrite to Promise Chain
      var no = Number(localStorage.getItem('orderSeq'))||1;
      var _uuid = localStorage.getItem('orderUUID');

      //if(!_uuid){
        _uuid = uuid()
        console.log('create cart',_uuid);
        localStorage.setItem('orderUUID',_uuid)
      //} else {
        //console.log('reusing cart',_uuid);
      //}

      return dispatch('ordersSelect',{
          uuid: _uuid,
          no: no,
          cmd:"SALE",
          status:'draft',
          meta_:{ 
            created: new Date(),
            accounted:null,
            owner:getters.currentUserKey,
            code:obfuscate(no)
          },        
          buyList:{
            total:0,
            contact:getters.buyerContact,
            items:[]
          },
          payList:{
            total:99,
            excess:99,
            contact:null,
            items:ArrayClone(PAY_LIST_DEFAULT)
          },
          app:{}
        });

    },
    checkout ({ commit, dispatch, state, getters }, order) {

      order = order ? order : getters.getOrdersSelected

      console.log('checkout',getters.getOrdersSelected);

      order.meta_.accounted = new Date()
      order.meta_.owner = getters.currentUserKey
      order.buyList.contact = getters.buyerContact
      order.buyList.total = getters._buyTotal
      order.payList.total = getters._payTotal
      order.status = "checkout"

      return dispatch('fiscalize',order).then((fiscal)=>{

        console.log('fiscalize dispatched!!!!!!!!!!', fiscal);

        Vue.set(order, 'app' , { fiscal });
        order.status = "fiscalized"

        return dispatch('ordersUpdate',order).then(()=>{
          commit(types.SALE_SEQ_INCREMENT)
          localStorage.setItem('orderUUID','') 
        })
      })

    },
    Zfiscalize({commit,getters}) {
      console.log('fiscalize secondary!!!!!!!!!!!!');
      return Promise.resolve({'test':'test'})
    },
    orderSeqIncrement ({commit,getters}) {
      commit(types.SALE_SEQ_INCREMENT)
    },
    addItemToOrder ({ commit,getters }, item) {

      item = item?item:getters.itemsSelected

      // console.log('---->push',item);

      const record = getters.getOrdersSelected.buyList.items.find(p => p.name === item.name)

      if (!record) {
        getters.getOrdersSelected.buyList.items.push(addUIData(item))
        
      } else {
        record.quantity++ 
      }
    },
    removeFromOrder ({ commit,getters }, item) {
      item = item?item:getters.itemsSelected
      ArrayRemoveElement(getters.getOrdersSelected.buyList.items,item);
    },
    addPaymentToOrder ({ commit }, item) {
      item = item?item:getters.itemsSelected
      getters.getOrdersSelected.payList.items.push(addUIData(item))
    },
    removePaymentFromOrder ({ commit,getters }, item) {
      item = item?item:getters.itemsSelected
      ArrayRemoveElement(getters.getOrdersSelected.payList,item);
    },
    setPayerContact({ commit },contact) {
      commit(types.SET_PAYER_CONTACT,contact)
    },
    hydrateCart ({commit,getters, dispatch}, db) {

      // FOR DEMO, AFTER PAGE LOAD creating blank default order items

      db.items.where('type_').equalsIgnoreCase("money").limit(2).sortBy("meta_.basket").then(r=>{
        getters.getOrdersSelected.payList.items = r.map((c,i)=>{
          c.sum = 0
          c.ui = { disabled:false, manualEnter:false, locked:false }
          return c
        });
        PAY_LIST_DEFAULT = ArrayClone(getters.getOrdersSelected.payList.items) 
      }).then(()=>{
        // For DEBUG load 2 items automaticaly
        db.items.where('type_').equalsIgnoreCase("product").limit(2).toArray().then(r=>{
        //db.items.limit(2).toArray().then(r=>{
          getters.getOrdersSelected.buyList.items = r.map((c,i)=>{
            c.quantity = 1
            c.sum = c.price
            c.discount = 0
            c.ui = { disabled:false, manualEnter:false }
            // this.add(c)
            return c
          });
        });
      });

      return dispatch('ordersUpdate',getters.getOrdersSelected);

    },
    // async actionA ({ commit }) {
    //   commit('gotData', await getData())
    // },
    // async actionB ({ dispatch, commit }) {
    //   await dispatch('actionA') // wait for actionA to finish
    //   commit('gotOtherData', await getOtherData())
    // }
  }

  // mutations
  const mutations = {

    [types.SALE_SEQ_INCREMENT] (state) {
      localStorage.setItem('orderSeq',state.orderSeq)
    },

    [types.CHECKOUT_CART] (state, cart) {
      // state.receipt = cart
    },
    [types.CHECKOUT_UPDATE_CART] (state, cart) {
      // state.receipt = cart
      console.log('CHECKOUT_UPDATE_CART',cart);
    },

    [types.SET_PAYER_CONTACT] (state, item) {
      state.payerContact = item;
    },

    [types.RESET_CART] (state) {
      
      state.checkoutStatus = null
    },

    [types.CHECKOUT_REQUEST] (state) {
      // clear cart
      state.checkoutStatus = null
    },

    [types.CHECKOUT_SUCCESS] (state) {
      state.checkoutStatus = 'successful'
    },

    [types.CHECKOUT_FAILURE] (state, { savedCartItems }) {
      state.checkoutStatus = 'failed'
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

function removeUIData(l){
  return l.reduce((a, b)=>{
    if(!b.ui.disabled && b.sum > 0){
      delete b.ui
      a.push(Object.assign({},b)) // ?? WHY I CLONE THIS
    }
    return a
  },[]);
}

function addUIData(i) {
  if(i) {
    i = Object.assign({},i)
  }
  if(!i.ui) i.ui = { disabled:false, manualEnter:false, locked:false }
  if(!i.name) i.name = "Позиция"
  if(!i.discount) i.discount = 0
  if(!i.discountLabel) i.discountLabel = null
  if(!i.sum && i.price) i.sum = i.price
  if(!i.price && i.sum) i.price = i.sum
  if(!i.quantity) i.quantity = 1
  if(!i.type_) i.type_ = "product"

  return i
}
/*
function _syncCashPaymentsum(payList, total, cardsum){
  // console.log('syncPaymentsum',payList[0]);
  if(payList && payList[0] && payList[0].ui && !payList[0].ui.manualEnter){
    var dif = total - cardsum
    // console.log('syncPaymentsum 2 ',dif, total, cardsum);
    if(dif >= 0){
      // console.log('syncPaymentsum 3', dif);
      payList[0].sum = dif
    } else {
      payList[0].sum = 0
    }
  }
}*/