import Vue from 'vue'

export default {
  signin ({ email, password }, cb, errorCb) {
    Vue.axios.post('/api/auth/signin', {
      email: email,
      password: password
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info)
        }
      })
      .catch(error => errorCb(error))
  }
}
