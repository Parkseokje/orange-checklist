import Vue from 'vue'
import {
  SET_USERS,
  UPDATE_USER,
  DELETE_USER,
  API_START,
  API_FAILURE
} from '../mutation-types'
import User from '../../services/UserService'

const userModule = {
  state: {
    users: []
  },

  getters: {
    getAllUsers: state => {
      return state.users
    },

    getUserById: (state, id) => {
      return state.users.find((user) => {
        return user.id === id
      })
    }
    // supervisorList: state => {
    //   return state.users.filter(user => user.user_type === 'SV')
    // },
    // shopperList: state => {
    //   return state.users.filter(user => user.user_type === 'MS')
    // }
  },

  actions: {
    fetchUserLists ({ commit, dispatch }) {
      commit(API_START)
      User.getUsers(
        (data) => commit(SET_USERS, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    createUser ({ dispatch, commit }, user) {
      commit(API_START)
      User.createUser(user,
        (data) => dispatch('fetchUserLists'),
        (err) => commit(API_FAILURE, err)
      )
    },

    updateUser ({ commit, dispatch }, user) {
      commit(API_START)
      User.updateUser(user,
        (data) => commit(UPDATE_USER, user),
        (err) => commit(API_FAILURE, err)
      )
    },

    deleteUser ({ dispatch, commit }, id) {
      commit(API_START)
      User.deleteUserById(id,
        (data) => commit(DELETE_USER, id),
        (err) => commit(API_FAILURE, err)
      )
    }
  },

  mutations: {
    [SET_USERS] (state, users) {
      state.users = users
    },

    [UPDATE_USER] (state, user) {
      const foundIndex = state.users.findIndex(x => x.id === user.id)
      Vue.set(state.users, foundIndex, user)
    },

    [DELETE_USER] (state, id) {
      const foundIndex = state.users.findIndex(x => x.id === id)
      state.users.splice(foundIndex, 1)
    }
  }
}

export default userModule
