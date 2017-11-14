import Vue from 'vue'
import {
  SET_CHECKLISTS,
  UPDATE_CHECKLIST,
  DELETE_CHECKLIST,
  API_FAILURE
} from '../mutation-types'
import Checklist from '../../services/ChecklistService'

const checklistModule = {
  state: {
    checklists: []
  },

  getters: {
    getAllChecklists: state => {
      return state.checklists
    },

    fiterChecklistById: state => {
      return id => state.checklists.filter(checklist => {
        return checklist.id === id
      })
    }
  },

  actions: {
    fetchCheckList ({ commit, getters }) {
      Checklist.getChecklists(
        (data) => commit(SET_CHECKLISTS, data),
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

    deleteChecklist ({ dispatch, commit }, id) {
      Checklist.deleteChecklistById(id,
        (data) => commit(DELETE_CHECKLIST, id),
        (err) => commit(API_FAILURE, err)
      )
    }
  },

  mutations: {
    [SET_CHECKLISTS] (state, checklists) {
      state.checklists = checklists
    },

    [UPDATE_CHECKLIST] (state, checklist) {
      const foundIndex = state.checklists.findIndex(x => x.id === checklist.id)
      Vue.set(state.checklists, foundIndex, checklist)
    },

    [DELETE_CHECKLIST] (state, id) {
      const foundIndex = state.checklists.findIndex(x => x.id === id)
      state.checklists.splice(foundIndex, 1)
    }
  }
}

export default checklistModule
