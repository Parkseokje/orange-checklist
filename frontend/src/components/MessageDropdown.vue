<template>
  <b-nav-item-dropdown right no-caret>
    <template slot="button-content">
      <i class="icon-bell"></i>
      <b-badge v-if="alarms.length !== 0" pill variant="danger">{{alarms.length}}</b-badge>
    </template>
    <b-dropdown-header tag="div" class="text-center"><strong>알림</strong></b-dropdown-header>
    <b-dropdown-item @click="moveToAlarmBoard('board')"><i class="fa fa-envelope-o"></i> 나의 게시판<b-badge variant="success">{{boardAlarms.length}}</b-badge></b-dropdown-item>
    <b-dropdown-item @click="moveToAlarmBoard('checklist')"><i class="fa fa-tasks"></i> 나의 체크리스트<b-badge variant="success">{{checklistAlarms.length}}</b-badge></b-dropdown-item>
  </b-nav-item-dropdown>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default {
  name: 'header-dropdown',

  props: ['alarms'],

  data: () => {
    return {}
  },

  methods: {
    moveToAlarmBoard (alarmType) {
      Vue.router.push('/user-alarm')
      // Vue.router.push({name: '나의 알림', params: { alarmType }})
    }
  },

  computed: {
    boardCount () {
      return this.data
    },

    boardAlarms () {
      return this.filterAlarmsByType('board')
    },

    checklistAlarms () {
      return this.filterAlarmsByType('checklist')
    },

    ...mapGetters({
      filterAlarmsByType: 'filterAlarmsByType'
    })
  }
}
</script>