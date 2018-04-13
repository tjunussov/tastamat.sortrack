import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
import VueIdb from './idb'

// import * as actions from './actions'
// import * as getters from './getters'

import cart from './modules/cart'

const debug = false; //process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hydrated: false,
  },
  // actions,
  mutations: {
    'DELETE_INDEXED_DB'(){},
  },
  modules: {
    ...VueIdb.modules,
    cart
  },
  getters: {
    hydrated: state => state.hydrated
  },
  plugins: debug ? [createLogger(),VueIdb.plugin ] : [VueIdb.plugin ],
  strict: debug
  // strict: false
})


// import library from './modules/library'
// import items from './modules/items'
// import contacts from './modules/contacts'
// import ledger from './modules/ledger'

// export default new Vuex.Store({
//   actions,
//   getters,
//   modules: {
//     library,
//     items,
//     contacts,
//     ledger
//   },
//   strict: debug,
//   plugins: debug ? [createLogger()] : []
// })
