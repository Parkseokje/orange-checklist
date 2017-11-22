import axios from 'axios'

export default {
  getChecklists (cb, errorCb) {
    axios.get('/api/checklist/list')
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getChecklistResult ({ id, byshop, view }, cb, errorCb) {
    axios.get(`/api/checklist/result`, {
      params: {
        id,
        byshop,
        view
      }
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getChecklistResultDetails (id, cb, errorCb) {
    axios.get(`/api/checklist/result-detail/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getChecklistResultDetailsExcel ({ id, view }, cb, errorCb) {
    axios.get(`/api/checklist/result-detail-excel/${id}`, {
      params: {
        view
      }
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getChecklistDetails (id, cb, errorCb) {
    axios.get(`/api/checklist/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info)
        }
      })
      .catch(error => errorCb(error))
  },

  getUserChecklist (cb, errorCb) {
    return axios.get(`/api/checklist/user`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getUserChecklistDetails (id, cb, errorCb) {
    return axios.get(`/api/checklist/user/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  createChecklist (checklist, cb, errorCb) {
    return axios.post(`/api/checklist`, {
      title: checklist.title,
      list_type: checklist.list_type,
      scoring: checklist.scoring.toString(),
      memo: checklist.memo,
      example1_title: checklist.example1_title,
      example2_title: checklist.example2_title,
      notice1_title: checklist.notice1_title,
      notice2_title: checklist.notice2_title,
      items: checklist.items,
      users: checklist.users
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  updateChecklist (checklist, cb, errorCb) {
    return axios.put(`/api/checklist`, checklist)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  updateChecklistItemAnswer (answer, cb, errorCb) {
    return axios.put(`/api/checklist/answer`, answer)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  deleteChecklistById (id, cb, errorCb) {
    return axios.delete(`/api/checklist/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  }
}
