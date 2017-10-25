import axios from 'axios'

export default {
  getUsers () {
    return axios.get('/api/users')
  },
  getUserById (id) {
    return axios.get(`/api/users/${id}`)
  },
  createUser (user) {
    return axios.post(`/api/users`)
  },
  updateUser (user) {
    return axios.put(`/api/users`, user)
  },
  deleteUserById (id) {
    return axios.delete(`/api/users/${id}`)
  }
}
