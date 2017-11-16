import Vue from 'vue'
import {
  SET_CHECKLISTS,
  SET_USER_CHECKLIST,
  UPDATE_CHECKLIST,
  DELETE_CHECKLIST,
  API_FAILURE
} from '../mutation-types'
import Checklist from '../../services/ChecklistService'

const checklistModule = {
  state: {
    checklists: [],
    user_checklist: []
  },

  getters: {
    getAllChecklists: state => {
      return state.checklists
    },

    getAllUserChecklist: state => {
      return state.user_checklist
    },

    fiterChecklistById: state => {
      return id => state.checklists.filter(checklist => {
        return checklist.id === id
      })
    },

    fiterUserChecklistById: state => {
      return id => state.user_checklist.filter(checklist => {
        return checklist.list_id === id
      })
    }
  },

  actions: {
    fetchCheckList ({ commit }) {
      Checklist.getChecklists(
        (data) => commit(SET_CHECKLISTS, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    fetchUserCheckList ({ commit }) {
      Checklist.getUserChecklist(
        (data) => commit(SET_USER_CHECKLIST, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    createChecklist ({ dispatch, commit }, checklist) {
      Checklist.createChecklist(checklist,
        (data) => dispatch('fetchCheckList'),
        (err) => commit(API_FAILURE, err)
      )
    },

    updateChecklist ({ commit }, checklist) {
      Checklist.updateChecklist(checklist,
        (data) => commit(UPDATE_CHECKLIST, checklist),
        (err) => commit(API_FAILURE, err)
      )
    },

    deleteChecklist ({ commit }, id) {
      Checklist.deleteChecklistById(id,
        (data) => commit(DELETE_CHECKLIST, id),
        (err) => commit(API_FAILURE, err)
      )
    }
  },

  mutations: {
    [SET_CHECKLISTS] (state, checklists) {
      state.checklists = checklists

      if (Vue.router.history.current.path !== '/checklist') {
        Vue.router.push('/checklist')
      }
    },

    [SET_USER_CHECKLIST] (state, checklists) {
      state.user_checklist = checklists

      if (Vue.router.history.current.path !== '/user-checklist') {
        Vue.router.push('/user-checklist')
      }
    },

    [UPDATE_CHECKLIST] (state, checklist) {
      const foundIndex = state.checklists.findIndex(x => x.id === checklist.id)
      Vue.set(state.checklists, foundIndex, checklist)

      Vue.router.push('/checklist')
    },

    [DELETE_CHECKLIST] (state, id) {
      const foundIndex = state.checklists.findIndex(x => x.id === id)
      state.checklists.splice(foundIndex, 1)
    }
  }
}

export default checklistModule
