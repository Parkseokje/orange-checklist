import Vue from 'vue'

export default {
  getUsers (cb, errorCb) {
    Vue.axios.get('/api/user/list')
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getUserById (id) {
    return Vue.axios.get(`/api/user/${id}`)
  },

  createUser (user, cb, errorCb) {
    return Vue.axios.post(`/api/user`, {
      company_id: 1,
      shop_id: null,
      role: user.role,
      name: user.name,
      phone: user.phone,
      email: user.email,
      password: user.password,
      memo: user.memo,
      active: user.active
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  updateUser (user, cb, errorCb) {
    return Vue.axios.put(`/api/user`, user)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  initPassword (id, cb, errorCb) {
    return Vue.axios.put(`/api/user/init-password`, { id })
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  deleteUserById (id, cb, errorCb) {
    return Vue.axios.delete(`/api/user/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  }
}
