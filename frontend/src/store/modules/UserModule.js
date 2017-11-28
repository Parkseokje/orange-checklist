import Vue from 'vue'
import {
  SET_USERS,
  UPDATE_USER,
  DELETE_USER,
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

    filterUserList: state => {
      return role => state.users.filter(user => {
        return user.role === role
      })
    },

    fiterUserById: state => {
      return id => state.users.filter(user => {
        return user.id === id
      })
    },

    filterUserByRole: state => {
      return role => state.users.filter(user => {
        return user.role === role
      })
    }
  },

  actions: {
    fetchUserList ({ commit, dispatch }) {
      User.getUsers(
        (data) => commit(SET_USERS, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    createUser ({ dispatch, commit }, user) {
      User.createUser(user,
        (data) => dispatch('fetchUserList'),
        (err) => commit(API_FAILURE, err)
      )
    },

    updateUser ({ commit }, user) {
      User.updateUser(user,
        (data) => commit(UPDATE_USER, user),
        (err) => commit(API_FAILURE, err)
      )
    },

    deleteUser ({ commit }, id) {
      User.deleteUserById(id,
        (data) => commit(DELETE_USER, id),
        (err) => commit(API_FAILURE, err)
      )
    },

    requestPasswordInit ({ commit }, id) {
      User.initPassword(id,
        data => true,
        err => commit(API_FAILURE, err)
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
