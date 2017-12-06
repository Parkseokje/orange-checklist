import Vue from 'vue'
import {
  SET_CATEGORIES,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  API_FAILURE
} from '../mutation-types'
import Category from '../../services/CategoryService'

const categoryModule = {
  state: {
    categories: []
  },

  getters: {
    getAllCategories: state => {
      return state.categories
    },

    // 대분류
    getBigCategories: state => {
      if (state.categories.length > 0) {
        return state.categories.filter(category => category.depth === 1)
      } else {
        return []
      }
    },

    // 중분류
    getMiddleCategories: state => {
      return parentId => state.categories.filter(category => {
        return category.parent_id === parentId && category.depth === 2
      })
    },

    // 소분류
    getSmallCategories: state => {
      return parentId => state.categories.filter(category => {
        return category.parent_id === parentId && category.depth === 3
      })
    },

    fiterCategoryById: state => {
      return id => state.categories.filter(category => {
        return category.id === id
      })
    }
  },

  actions: {
    fetchCategoryList ({ commit, getters }) {
      Category.getCategories(
        (data) => commit(SET_CATEGORIES, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    createCategory ({ dispatch, commit }, category) {
      Category.createCategory(category,
        (data) => dispatch('fetchCategoryList'),
        (err) => commit(API_FAILURE, err)
      )
    },

    updateCategory ({ commit }, category) {
      Category.updateCategory(category,
        (data) => commit(UPDATE_CATEGORY, category),
        (err) => commit(API_FAILURE, err)
      )
    },

    deleteCategory ({ dispatch, commit }, id) {
      Category.deleteCategoryById(id,
        (data) => commit(DELETE_CATEGORY, id),
        (err) => commit(API_FAILURE, err)
      )
    }
  },

  mutations: {
    [SET_CATEGORIES] (state, categories) {
      state.categories = categories
    },

    [UPDATE_CATEGORY] (state, category) {
      const foundIndex = state.categories.findIndex(x => x.id === category.id)
      Vue.set(state.categories, foundIndex, category)
    },

    [DELETE_CATEGORY] (state, id) {
      const foundIndex = state.categories.findIndex(x => x.id === id)
      state.categories.splice(foundIndex, 1)
    }
  }
}

export default categoryModule
