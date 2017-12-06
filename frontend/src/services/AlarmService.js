import axios from 'axios'

export default {
  getAlarms (cb, errorCb) {
    axios.get('/api/alarm')
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  createAlarm (alarmInfo, cb, errorCb) {
    return axios.post(`/api/alarm`, alarmInfo)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  updateAlarm (alarm, cb, errorCb) {
    return axios.put(`/api/alarm`, alarm)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  }
}
