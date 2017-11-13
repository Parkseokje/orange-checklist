<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="nav"/>
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

  computed: {
    ...mapGetters({
      spinner: 'spinner'
    }),

    name () {
      return this.$route.name
    },

    list () {
      return this.$route.matched
    }
  },

  created () {
    this.$Progress.start()
  },

  mounted () {
    this.$Progress.finish()
  }
}
</script>


