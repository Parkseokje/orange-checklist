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
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VueScrollTo from 'vue-scrollto'
import moment from 'moment'
import lambdaConfig from './lambda.config'

axios.interceptors.request.use(config => {
  if (config.url !== lambdaConfig.AWS_LAMBDA_GETSIGNEDURL_ENDPOINT) {
    config.headers.common['X-access-token'] = localStorage.getItem('token')
    store.dispatch('startLoader')
  }

  return config
}, error => {
  if (error.url !== lambdaConfig.AWS_LAMBDA_GETSIGNEDURL_ENDPOINT) {
    store.dispatch('endLoader')
  }

  return Promise.reject(error)
})

axios.interceptors.response.use(config => {
  store.dispatch('endLoader')
  return config
}, error => {
  store.dispatch('endLoader')
  return Promise.reject(error)
})

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
  color: '#f9d423',
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
Vue.use(require('vue-moment'), {
  moment
})
Vue.use(VueScrollTo, {
  container: 'body',
  duration: 3000,
  easing: 'ease',
  offset: 0,
  cancelable: true,
  onDone: false,
  onCancel: false,
  x: false,
  y: true
})

Vue.component('v-select', vSelect)
Vue.component('input-tag', InputTag)
Vue.component('pulse-loader', PulseLoader)

sync(store, router)

router.beforeEach((to, from, next) => {
  if (to.meta.needsAuth && !localStorage.getItem('token')) {
    next({ path: '/login' })
  } else if (to.name === 'Login' && !!localStorage.getItem('token')) {
    next({ path: '/' })
  } else {
    next()
  }
})

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
