import Vue from 'vue'
import {
  LOGIN_SUCCESS,
  LOGOUT,
  API_FAILURE
} from '../mutation-types'
import Auth from '../../services/AuthService'

const AuthModule = {
  state: {
    isAuthenticated: false,
    profile: null
  },

  getters: {
    isAuthenticated: state => {
      return state.isAuthenticated
    },

    getProfile: state => {
      return state.profile ? state.profile : ''
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
      commit(LOGOUT)
    }
  },

  mutations: {
    [LOGIN_SUCCESS] (state, { name, email, token }) {
      localStorage.setItem('token', token)
      state.isAuthenticated = true
      state.profile = { name, email }

      Vue.router.push('/dashboard')
    },

    [LOGOUT] (state) {
      localStorage.removeItem('token')
      state.isAuthenticated = false
      state.profile = null

      Vue.router.push('/login')
    }
  }
}

export default AuthModule
