import Vue from 'vue'
import Vuex from 'vuex'
import state from './states'
import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'
import modules from './modules'
import * as types from './mutation-types'
import { createVuexLoader } from 'vuex-loading'

const VuexLoading = createVuexLoader({
  moduleName: 'loading', // The Vuex module name, 'loading' by default.
  componentName: 'v-loading', // The Vue component name, 'v-loading' by default.
  className: 'v-loading' // Vue component class name, 'v-loading' by default.
})

const mutationWatcher = store => {
  store.subscribe((mutation, state) => {
    switch (mutation.type) {
      case types.API_START:
        store.dispatch('startLoader')
        break

      case types.SET_SHOPS:
      case types.UPDATE_SHOP:
      case types.DELETE_SHOP:
      case types.SET_USERS:
      case types.UPDATE_USER:
      case types.DELETE_USER:
      case types.API_FAILURE:
        store.dispatch('endLoader')
        break

      default:
        break
    }
  })
}

Vue.use(Vuex)
Vue.use(VuexLoading)

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules,
  plugins: [ VuexLoading.Store, mutationWatcher ],
  strict: true
})

export default store
