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

  getChecklistById (id) {
    return axios.get(`/api/checklist/${id}`)
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
