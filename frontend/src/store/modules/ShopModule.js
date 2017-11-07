import Vue from 'vue'
import {
  SET_SHOPS,
  UPDATE_SHOP,
  DELETE_SHOP,
  API_FAILURE
} from '../mutation-types'
import Shop from '../../services/ShopService'

const shopModule = {
  state: {
    shops: []
  },

  getters: {
    getAllShops: state => {
      return state.shops
    },
    getShopById: (state, id) => {
      return state.shops.find(shop => {
        return shop.id === id
      })
    }
  },

  actions: {
    fetchShopLists ({ commit, dispatch }) {
      Shop.getShops(
        (data) => commit(SET_SHOPS, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    createShop ({ dispatch, commit }, shop) {
      Shop.createShop(shop,
        (data) => dispatch('fetchShopLists'),
        (err) => commit(API_FAILURE, err)
      )
    },

    updateShop ({ commit }, shop) {
      Shop.updateShop(shop,
        (data) => commit(UPDATE_SHOP, shop),
        (err) => commit(API_FAILURE, err)
      )
    },

    deleteShop ({ dispatch, commit }, id) {
      Shop.deleteShopById(id,
        (data) => commit(DELETE_SHOP, id),
        (err) => commit(API_FAILURE, err)
      )
    }
  },

  mutations: {
    [SET_SHOPS] (state, shops) {
      state.shops = shops
    },

    [UPDATE_SHOP] (state, shop) {
      const foundIndex = state.shops.findIndex(x => x.id === shop.id)
      Vue.set(state.shops, foundIndex, shop)
    },

    [DELETE_SHOP] (state, id) {
      const foundIndex = state.shops.findIndex(x => x.id === id)
      state.shops.splice(foundIndex, 1)
    }
  }
}

export default shopModule
