<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">&#9776;</button>
    <b-link class="navbar-brand" to="#"></b-link>
    <button class="navbar-toggler sidebar-toggler d-md-down-none mr-auto" type="button" @click="sidebarMinimize">&#9776;</button>
    <!-- nav -->
    <b-navbar-nav class="ml-auto">
      <message-dropdown :alarms="allAlarms" />
      <b-nav-item-dropdown right class="header-item-dropdown">
        <template slot="button-content">
          <!--<img src="static/img/avatars/6.jpg" class="img-avatar" alt="admin@bootstrapmaster.com">-->
          <i class="fa fa-user-circle"></i>
          <span class="d-md-down-none">{{profile.name}}</span>
        </template>
        <b-dropdown-item @click="changePassword"><i class="fa fa-lock fa-2"></i> 암호 변경</b-dropdown-item>
        <b-dropdown-item @click="logout"><i class="fa fa-lock fa-2"></i> 로그아웃</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
    <!-- <button class="navbar-toggler aside-menu-toggler d-md-down-none" type="button" @click="asideToggle">&#9776;</button> -->
  </header>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import MessageDropdown from './MessageDropdown.vue'
import Auth from '../services/AuthService'

export default {
  name: 'header',

  created () {
    if (this.allAlarms.length === 0) {
      this.fetchAlarmList()
    }
  },

  components: {
    MessageDropdown
  },

  methods: {
    ...mapActions([
      'logout',
      'fetchAlarmList'
    ]),

    changePassword () {
      Auth.forgotPassword(this.profile,
        data => {
          this.$router.push({path: 'reset-password', query: { token: data.token }})
        },
        err => {
          console.error(err)

          alert('이메일이 존재하지 않습니다!')
        }
      )
    },

    sidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-hidden')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('aside-menu-hidden')
    }
  },

  computed: {
    ...mapGetters({
      profile: 'getProfile',
      allAlarms: 'getAllAlarms'
    })
  }
}
</script>

<style scoped>
.header-item-dropdown {
  padding-right: 10px;
}
</style>
