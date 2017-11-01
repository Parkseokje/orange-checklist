import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import { sync } from 'vuex-router-sync'
import store from './store'
import SimpleVueValidation from 'simple-vue-validator'
import * as VueGoogleMaps from 'vue2-google-maps'

// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import vSelect from 'vue-select'
import InputTag from 'vue-input-tag'

// Vue.prototype.$http = axios
Vue.use(BootstrapVue)
Vue.use(SimpleVueValidation)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCg6IbxG5vJfJuDMdgp71hRiZtVQuPMg0o',
    libraries: 'places' // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
  }
})
// Vue.config.productionTip = false

Vue.component('v-select', vSelect)
Vue.component('input-tag', InputTag)

sync(store, router)

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
