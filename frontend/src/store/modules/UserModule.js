import {
  SET_USERS,
  UPDATE_USER,
  DELETE_USER,
  API_FAILURE
} from '../mutation-types'
import User from '../../services/UserService'

const usersModule = {
  state: {
    users: []
  },

  getters: {
    all: state => {
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
    fetchUserLists ({ commit }) {
      User.getUsers(
        (data) => commit(SET_USERS, data),
        (err) => commit(API_FAILURE, err)
      )
    },
    createUser ({ dispatch, commit }, user) {
      User.createUser(user,
        (data) => dispatch('fetchUserLists'),
        (err) => commit(API_FAILURE, err)
      )
    },
    async updateUser ({ commit }, user) {
      const response = await User.updateUser(user)

      if (response.data.success) {
        commit(UPDATE_USER, user)
      }
    },
    deleteUser ({ dispatch, commit }, id) {
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
      state.users[foundIndex] = user
    },
    [DELETE_USER] (state, id) {
      const foundIndex = state.users.findIndex(x => x.id === id)
      state.users.splice(foundIndex, 1)
    }
  }
}

export default usersModule
