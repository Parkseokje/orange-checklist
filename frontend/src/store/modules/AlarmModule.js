import Vue from 'vue'
import {
  SET_ALARMS,
  UPDATE_ALARMS,
  API_FAILURE
} from '../mutation-types'
import Alarm from '../../services/AlarmService'

const alarmModule = {
  state: {
    alarms: []
  },

  getters: {
    getAllAlarms: state => {
      return state.alarms.filter(alarm => {
        return alarm.active === 1
      })
    },

    // 특정 타입의 알람을 반환
    filterAlarmsByType: state => {
      return alarmType => state.alarms.filter(alarm => {
        return alarm.alarm_type.indexOf(alarmType) > -1 && alarm.active === 1
      })
    },

    fiterAlarmById: state => {
      return id => state.alarms.filter(alarm => {
        return alarm.id === id
      })
    }
  },

  actions: {
    fetchAlarmList ({ commit, getters }) {
      Alarm.getAlarms(
        (data) => commit(SET_ALARMS, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    createAlarm ({ dispatch, commit }, alarm) {
      Alarm.createAlarm(alarm,
        (data) => dispatch('fetchAlarmList'),
        (err) => commit(API_FAILURE, err)
      )
    },

    updateAlarm ({ commit }, alarm) {
      Alarm.updateAlarm(alarm,
        (data) => commit(UPDATE_ALARMS, alarm),
        (err) => commit(API_FAILURE, err)
      )
    }
  },

  mutations: {
    [SET_ALARMS] (state, alarms) {
      state.alarms = alarms
    },

    [UPDATE_ALARMS] (state, alarm) {
      const foundIndex = state.alarms.findIndex(x => x.id === alarm.id)

      alarm.active = 0

      Vue.set(state.alarms, foundIndex, alarm)
    }
  }
}

export default alarmModule
