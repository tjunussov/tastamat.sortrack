import api from '../../api'
import {
  SUCCESS_GET_ITEMS,
  FAILURE_GET_ITEMS
} from '../types'

const state = {
  items:[]
}

// actions
const actions = {
  getLibraryItems ({ commit }){
    api.getLibraryItems().then(response => {
      if(!response.ok){
        return commit(FAILURE_GET_ITEMS)
      }
      commit(SUCCESS_GET_ITEMS, { items: response.data.data })
    }, response => {
      commit(FAILURE_GET_ITEMS)
    })
  }
}

const mutations = {
  [FAILURE_GET_ITEMS](state){
    state.items = []
  },
  [SUCCESS_GET_ITEMS](state,payload){
    state.items = payload.items
  }
}

export default {
  state,
  actions,
  mutations
}