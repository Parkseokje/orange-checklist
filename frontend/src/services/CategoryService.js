import axios from 'axios'

export default {
  getCategories (cb, errorCb) {
    axios.get('/api/categories')
      .then(response => {
        if (response.status === 200 && response.data.length > 0) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  getCategoryById (id) {
    return axios.get(`/api/categories/${id}`)
  },

  createCategory (category, cb, errorCb) {
    return axios.post(`/api/categories`, {
      name: category.name,
      parent_id: category.parent_id,
      depth: category.depth,
      is_active: category.is_active
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  updateCategory (category, cb, errorCb) {
    return axios.put(`/api/categories`, category)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  deleteCategoryById (id, cb, errorCb) {
    return axios.delete(`/api/categories/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  }
}
