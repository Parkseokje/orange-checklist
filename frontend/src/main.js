import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import { sync } from 'vuex-router-sync'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'

// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import SimpleVueValidation from 'simple-vue-validator'
import * as VueGoogleMaps from 'vue2-google-maps'
import vSelect from 'vue-select'
import InputTag from 'vue-input-tag'
import VueCookie from 'vue-cookie'
import VueProgressBar from 'vue-progressbar'

// axios.interceptors.request.use(() => {
//   console.log('intercepted')
//   axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token')
//   return true
// })

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)
Vue.use(SimpleVueValidation)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCg6IbxG5vJfJuDMdgp71hRiZtVQuPMg0o',
    libraries: 'places'
  }
})
Vue.use(VueCookie)
Vue.use(VueProgressBar, {
  color: '#f9d423', // '#bffaf3',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
})

Vue.component('v-select', vSelect)
Vue.component('input-tag', InputTag)

sync(store, router)

router.beforeEach((to, from, next) => {
  if (to.meta.needsAuth && !store.getters.isAuthenticated) {
    next({ path: '/login' })
  // } else if (to.name === 'Login' && store.getters.isAuthenticated) {
  //   next({ path: '/' })
  } else {
    // Vue.axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token')
    next()
  }
})

Vue.axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token')

Vue.router = router

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App
  }
})
