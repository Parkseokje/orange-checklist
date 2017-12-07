import Vue from 'vue'
import {
  SET_CHECKLISTS,
  SET_CHECKLIST_RESULT,
  SET_CHECKLIST_RESULT_DETAILS,
  SET_CHECKLIST_RESULT_DETAILS_EXCEL,
  SET_USER_CHECKLIST,
  SET_USER_CHECKLIST_DETAILS,
  UPDATE_CHECKLIST,
  UPDATE_CHECKLIST_ITEM_ANSWER,
  DELETE_CHECKLIST,
  API_FAILURE
} from '../mutation-types'
import Checklist from '../../services/ChecklistService'

const checklistModule = {
  state: {
    checklists: [],
    checklist_results: [],
    checklist_results_excel: [],
    user_checklist: [],
    user_checklist_details: []
  },

  getters: {
    getAllChecklists: state => {
      return state.checklists
    },

    getAllChecklistResult: state => {
      return state.checklist_results
    },

    getAllChecklistResultExcel: state => {
      return state.checklist_results_excel
    },

    getAllChecklistResultExcelByChecklistUserId: state => {
      return id => state.checklist_results_excel.filter(item => {
        return item.checklist_user_id === id
      })
    },

    getAllUserChecklist: state => {
      return state.user_checklist
    },

    getAllUserChecklistDetails: state => {
      return state.user_checklist_details
    },

    fiterChecklistById: state => {
      return id => state.checklists.filter(checklist => {
        return checklist.id === id
      })
    },

    fiterUserChecklistById: state => {
      return id => state.user_checklist.filter(checklist => {
        return checklist.checklist_user_id === id
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

    fetchCheckListResult ({ commit }, { id, view = 'month', checklistUserId = null }) {
      Checklist.getChecklistResult({ id, view, checklistUserId },
        (data) => commit(SET_CHECKLIST_RESULT, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    fetchCheckListResultDetailsExcel ({ commit }, { id, view = 'month', checklistUserId = null }) {
      Checklist.getChecklistResultDetailsExcel({ id, view, checklistUserId },
        (data) => commit(SET_CHECKLIST_RESULT_DETAILS_EXCEL, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    fetchCheckListResultDetails ({ commit }, id) {
      Checklist.getChecklistResultDetails(id,
        (data) => commit(SET_CHECKLIST_RESULT_DETAILS, { id, data }),
        (err) => commit(API_FAILURE, err)
      )
    },

    fetchUserCheckList ({ commit }) {
      Checklist.getUserChecklist(
        (data) => commit(SET_USER_CHECKLIST, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    fetchUserCheckListDetails ({ commit }, id) {
      Checklist.getUserChecklistDetails(id,
        (data) => commit(SET_USER_CHECKLIST_DETAILS, data),
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

    updateChecklistItemAnswer ({ commit }, answer) {
      Checklist.updateChecklistItemAnswer(answer,
        (data) => {
          if (!answer.item_answer_id) {
            answer.item_answer_id = data.item_answer_id
          }
          commit(UPDATE_CHECKLIST_ITEM_ANSWER, answer)
        },
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

    [SET_CHECKLIST_RESULT] (state, result) {
      state.checklist_results = result
    },

    [SET_CHECKLIST_RESULT_DETAILS] (state, { id, data }) {
      const foundIndex = state.checklist_results.findIndex(x => x.checklist_user_id === id)
      Vue.set(state.checklist_results[foundIndex], 'details', data)
    },

    [SET_CHECKLIST_RESULT_DETAILS_EXCEL] (state, data) {
      state.checklist_results_excel = data
    },

    [SET_USER_CHECKLIST] (state, checklists) {
      state.user_checklist = checklists

      if (Vue.router.history.current.path !== '/user-checklist') {
        Vue.router.push('/user-checklist')
      }
    },

    [SET_USER_CHECKLIST_DETAILS] (state, data) {
      state.user_checklist_details = data
    },

    [UPDATE_CHECKLIST] (state, checklist) {
      const foundIndex = state.checklists.findIndex(x => x.id === checklist.id)
      Vue.set(state.checklists, foundIndex, checklist)

      Vue.router.push('/checklist')
    },

    [UPDATE_CHECKLIST_ITEM_ANSWER] (state, answer) {
      const foundIndex = state.user_checklist_details.findIndex(x => x.item_id === answer.item_id)
      Vue.set(state.user_checklist_details, foundIndex, answer)
    },

    [DELETE_CHECKLIST] (state, id) {
      const foundIndex = state.checklists.findIndex(x => x.id === id)
      state.checklists.splice(foundIndex, 1)
    }
  }
}

export default checklistModule
