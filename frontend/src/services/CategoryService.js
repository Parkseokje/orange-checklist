import axios from 'axios'

export default {
  getCategories (cb, errorCb) {
    axios.get('/api/category/list')
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getCategoryById (id) {
    return axios.get(`/api/category/${id}`)
  },

  createCategory (category, cb, errorCb) {
    return axios.post(`/api/category`, {
      name: category.name,
      parent_id: category.parent_id,
      depth: category.depth
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  updateCategory (category, cb, errorCb) {
    return axios.put(`/api/category`, category)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  deleteCategoryById (id, cb, errorCb) {
    return axios.delete(`/api/category/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  }
}
