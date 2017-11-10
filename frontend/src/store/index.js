import Vue from 'vue'
import Vuex from 'vuex'
import state from './states'
import * as actions from './actions'
import mutations from './mutations'
import * as getters from './getters'
import modules from './modules'
import { createVuexLoader } from 'vuex-loading'
import VuexPersist from 'vuex-persist'
// import createPersistedState from 'vuex-persistedstate'
// import * as Cookies from 'js-cookie'
import {
  LOGIN_SUCCESS,
  LOGOUT
} from './mutation-types'

const VuexLoading = createVuexLoader({
  moduleName: 'loading',
  componentName: 'v-loading',
  className: 'v-loading'
})

const vuexLocalStorage = new VuexPersist({
  key: 'vuex',
  storage: localStorage,
  reducer: state => ({
    AuthModule: state.AuthModule
  }),
  filter: mutation => (mutation.type === LOGIN_SUCCESS || mutation.type === LOGOUT)
})

Vue.use(Vuex)
Vue.use(VuexLoading)

const store = new Vuex.Store({
  state,
  actions,
  mutations,
  getters,
  modules,
  plugins: [
    VuexLoading.Store,
    vuexLocalStorage.plugin
    // createPersistedState({
    //   storage: {
    //     getItem: key => Cookies.get(key),
    //     setItem: (key, value) => Cookies.set(key, value, { expires: 3, secure: true }),
    //     removeItem: key => Cookies.remove(key)
    //   }
    // })
  ]
  // strict: true
})

export default store
