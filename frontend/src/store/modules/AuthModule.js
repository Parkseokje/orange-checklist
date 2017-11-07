import Vue from 'vue'
import {
  LOGIN_SUCCESS,
  LOGOUT,
  API_FAILURE
} from '../mutation-types'
import Auth from '../../services/AuthService'

const AuthModule = {
  state: {
    isAuthenticated: !!localStorage.getItem('token')
  },

  getters: {
    isAuthenticated: state => {
      return state.isAuthenticated
    }
  },

  actions: {
    login ({ commit }, credentials) {
      Auth.signin(credentials,
        (data) => commit(LOGIN_SUCCESS, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    logout ({ commit }) {
      localStorage.removeItem('token')
      commit(LOGOUT)
    }
  },

  mutations: {
    [LOGIN_SUCCESS] (state, token) {
      localStorage.setItem('token', token)
      Vue.axios.defaults.headers.common['x-access-token'] = token
      Vue.router.push('/dashboard')
    },

    [LOGOUT] (state) {
      localStorage.removeItem('token')
      Vue.axios.defaults.headers.common['x-access-token'] = null
    }
  }
}

export default AuthModule
