import axios from 'axios'

export default {
  getShops (cb, errorCb) {
    axios.get('/api/shops')
      .then(response => {
        if (response.status === 200 && response.data.length > 0) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  getShopById (id) {
    return axios.get(`/api/shops/${id}`)
  },

  createShop (shop, cb, errorCb) {
    return axios.post(`/api/shops`, {
      name: shop.name,
      address: shop.address,
      tel_no: shop.tel_no,
      lat: shop.lat,
      lng: shop.lng,
      memo: shop.memo,
      is_active: shop.is_active
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  updateShop (user, cb, errorCb) {
    return axios.put(`/api/shops`, user)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  deleteShopById (id, cb, errorCb) {
    return axios.delete(`/api/shops/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  }
}
