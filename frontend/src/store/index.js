import Vue from 'vue'
import Vuex from 'vuex'
import state from './states'
import * as actions from './actions'
import * as getters from './getters'
import modules from './modules'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  actions,
  getters,
  modules,
  strict: true
})

export default store
