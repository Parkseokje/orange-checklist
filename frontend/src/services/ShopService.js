import Vue from 'vue'

export default {
  getShops (cb, errorCb) {
    Vue.axios.get('/api/shop/list')
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb({error}))
  },

  getShopById (id) {
    return Vue.axios.get(`/api/shop/${id}`)
  },

  createShop (shop, cb, errorCb) {
    return Vue.axios.post(`/api/shop`, {
      name: shop.name,
      address: shop.address,
      tel: shop.tel,
      lat: shop.lat,
      lng: shop.lng,
      memo: shop.memo,
      active: shop.is_active
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  updateShop (user, cb, errorCb) {
    return Vue.axios.put(`/api/shop`, user)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  deleteShopById (id, cb, errorCb) {
    return Vue.axios.delete(`/api/shop/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  }
}
