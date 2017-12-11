<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="navItems"/>
      <main class="main">
        <breadcrumb :list="list"/>
        <div class="container-fluid">
          <v-loading loader="worker">
            <template slot="spinner">
              <pulse-loader :color="spinner.color" :height="spinner.height" :width="spinner.width"></pulse-loader>
            </template>
          </v-loading>
          <router-view v-show="!$isLoading('worker')"></router-view>
        </div>
      </main>
      <AppAside/>
    </div>
    <AppFooter/>

    <!-- set progressbar -->
    <vue-progress-bar></vue-progress-bar>
  </div>
</template>

<script>
import nav from '../_nav'
import { Header as AppHeader, Sidebar, Aside as AppAside, Footer as AppFooter, Breadcrumb } from '../components/'
import { mapGetters } from 'vuex'

export default {
  name: 'full',

  components: {
    AppHeader,
    Sidebar,
    AppAside,
    AppFooter,
    Breadcrumb
  },

  data () {
    return {
      nav: nav.items
    }
  },

  methods: {
    checkRedirect () {
      // 로그인 후 디폴트 라우터에 대한 접근권한이 없을 경우, 첫 번째 라우트로 리다이렉트
      // created 시 role 이 없을 경우는 redirect 제외
      if (this.profile.role === undefined) {
        return false
      }

      const foundIndex = this.navItems.findIndex(x => x.url === this.$route.path)

      if (foundIndex < 0) {
        this.$router.push(this.navItems[0].url)
      }
    }
  },

  computed: {
    ...mapGetters({
      spinner: 'spinner',
      profile: 'getProfile'
    }),

    name () {
      return this.$route.name
    },

    list () {
      return this.$route.matched
    },

    navItems () {
      let result = nav.items.filter(obj => {
        if (obj.roles === 'all') {
          return obj
        } else {
          let index = obj.roles.findIndex(role => role === this.profile.role)

          if (index > -1) {
            return obj
          }
        }
      })

      return result
    }
  },

  watch: {
    'profile.role' (val) {
      this.checkRedirect()
    }
  },

  created () {
    this.$Progress.start()

    this.checkRedirect()
  },

  mounted () {
    this.$Progress.finish()
  }
}
</script>


