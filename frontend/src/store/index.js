import Vue from 'vue'
import Vuex from 'vuex'
import state from './states'
import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'
import modules from './modules'
import { createVuexLoader } from 'vuex-loading'

const VuexLoading = createVuexLoader({
  moduleName: 'loading',
  componentName: 'v-loading',
  className: 'v-loading'
})

Vue.use(Vuex)
Vue.use(VuexLoading)

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules,
  plugins: [ VuexLoading.Store ],
  strict: true
})

export default store
