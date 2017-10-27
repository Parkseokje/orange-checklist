import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router'
import { sync } from 'vuex-router-sync'
import store from './store'
import SimpleVueValidation from 'simple-vue-validator'

// import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Vue.prototype.$http = axios
Vue.use(BootstrapVue)
Vue.use(SimpleVueValidation)
// Vue.config.productionTip = false

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
