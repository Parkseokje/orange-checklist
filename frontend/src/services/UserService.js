import axios from 'axios'

export default {
  getUsers (cb, errorCb) {
    axios.get('/api/users')
      .then(response => {
        if (response.status === 200 && response.data.length > 0) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },
  getUserById (id) {
    return axios.get(`/api/users/${id}`)
  },
  createUser (user, cb, errorCb) {
    return axios.post(`/api/users`, {
      user_type: user.user_type.value,
      name: user.name.value,
      cell_no: user.cell_no.value,
      email: user.email.value,
      password: user.password.value,
      memo: user.memo.value,
      is_active: user.is_active
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },
  updateUser (user) {
    return axios.put(`/api/users`, user)
  },
  deleteUserById (id, cb, errorCb) {
    return axios.delete(`/api/users/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  }
}
