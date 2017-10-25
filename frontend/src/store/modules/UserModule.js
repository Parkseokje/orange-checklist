import {
  SET_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER
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
    async fetchUserLists ({ commit }) {
      const response = await User.getUsers()

      commit(SET_USERS, response.data)
    },
    async createUser ({ commit }, user) {
      const response = await User.createUser(user)

      if (response.data.success) {
        commit(CREATE_USER, user)
      }
    },
    async updateUser ({ commit }, user) {
      const response = await User.updateUser(user)

      if (response.data.success) {
        commit(UPDATE_USER, user)
      }
    },
    async deleteUser ({ commit }, id) {
      const response = await User.deleteUserById(id)

      if (response.data.success) {
        commit(DELETE_USER, id)
      }
    }
  },

  mutations: {
    [SET_USERS] (state, users) {
      state.users = users
    },
    [CREATE_USER] (state, user) {
      state.users.push(user)
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
