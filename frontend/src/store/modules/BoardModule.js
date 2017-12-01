import Vue from 'vue'
import {
  SET_BOARDS,
  SET_BOARD_USERS,
  SET_USER_BOARDS,
  SET_POSTS,
  SET_USER_POSTS,
  UPDATE_BOARD,
  UPDATE_USER_POST,
  DELETE_BOARD,
  DELETE_USER_POST,
  API_FAILURE
} from '../mutation-types'
import Board from '../../services/BoardService'

const boardModule = {
  state: {
    boards: [],
    user_boards: [],
    posts: [],
    user_posts: []
  },

  getters: {
    getAllBoards: state => {
      return state.boards
    },

    getAllUserBoards: state => {
      return state.user_boards
    },

    getAllPosts: state => {
      return state.posts
    },

    getAllUserPosts: state => {
      return state.user_posts
    },

    getAllUserRootPosts: state => {
      return state.user_posts.filter(post => {
        return post.depth === 0
      })
    },

    getAllUserSubPosts: state => {
      return (parent) => {
        let result = []

        for (const post of state.user_posts) {
          if (
            post.depth === parent.depth + 1 &&
            post.board_id === parent.board_id &&
            post.group_id === parent.group_id &&
            post.group_seq > parent.group_seq
          ) {
            result.push(post)
          } else if (
            post.content_id !== parent.content_id &&
            post.group_seq > parent.group_seq &&
            post.depth === parent.depth
          ) {
            break
          }
        }

        return result
        // return (parent) => state.user_posts.filter(post => {
        //   if (post.depth < parent.depth + 1) {}
        //   return (
        //     post.depth === parent.depth + 1 &&
        //     post.board_id === parent.board_id &&
        //     post.group_id === parent.group_id &&
        //     post.group_seq > parent.group_seq
        //   )
        // })
      }
    },

    filterBoardById: state => {
      return id => state.boards.filter(board => {
        return board.id === id
      })
    },

    filterUserPost: state => {
      return id => state.user_posts.filter(post => {
        return post.content_id === id
      })
    }
  },

  actions: {
    fetchBoardList ({ commit, getters }) {
      Board.getBoards(
        (data) => commit(SET_BOARDS, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    fetchBoardUsers ({ commit, getters }, id) {
      Board.getBoardUsers(id,
        (data) => commit(SET_BOARD_USERS, { id, data }),
        (err) => commit(API_FAILURE, err)
      )
    },

    fetchUserBoardList ({ commit, getters }) {
      Board.getUserBoards(
        (data) => commit(SET_USER_BOARDS, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    fetchPosts ({ commit, getters }) {
      Board.getAllPosts(
        (data) => commit(SET_POSTS, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    fetchUserPosts ({ commit, getters }) {
      Board.getUserPosts(
        (data) => commit(SET_USER_POSTS, data),
        (err) => commit(API_FAILURE, err)
      )
    },

    createBoard ({ dispatch, commit }, board) {
      Board.createBoard(board,
        (data) => dispatch('fetchBoardList'),
        (err) => commit(API_FAILURE, err)
      )
    },

    createUserPost ({ dispatch, commit }, post) {
      Board.createUserPost(post,
        (data) => dispatch('fetchUserPosts'),
        (err) => commit(API_FAILURE, err)
      )
    },

    updateBoard ({ commit }, board) {
      Board.updateBoard(board,
        (data) => commit(UPDATE_BOARD, board),
        (err) => commit(API_FAILURE, err)
      )
    },

    updateUserPost ({ commit }, post) {
      Board.updateBoard(post,
        (data) => commit(UPDATE_USER_POST, post),
        (err) => commit(API_FAILURE, err)
      )
    },

    deleteBoard ({ dispatch, commit }, id) {
      Board.deleteBoardById(id,
        (data) => commit(DELETE_BOARD, id),
        (err) => commit(API_FAILURE, err)
      )
    },

    deleteUserPost ({ dispatch, commit }, id) {
      Board.deleteUserPostById(id,
        (data) => commit(DELETE_USER_POST, id),
        (err) => commit(API_FAILURE, err)
      )
    }
  },

  mutations: {
    [SET_BOARDS] (state, boards) {
      state.boards = boards
    },

    [SET_BOARD_USERS] (state, { id, data }) {
      const foundIndex = state.boards.findIndex(x => x.id === id)
      Vue.set(state.boards[foundIndex], 'users', data)
    },

    [SET_USER_BOARDS] (state, boards) {
      state.user_boards = boards
    },

    [SET_POSTS] (state, posts) {
      state.posts = posts
    },

    [SET_USER_POSTS] (state, posts) {
      state.user_posts = posts
    },

    [UPDATE_BOARD] (state, board) {
      const foundIndex = state.boards.findIndex(x => x.id === board.id)
      Vue.set(state.boards, foundIndex, board)
    },

    [UPDATE_USER_POST] (state, post) {
      const foundIndex = state.user_posts.findIndex(x => x.id === post.id)
      Vue.set(state.user_posts, foundIndex, post)
    },

    [DELETE_BOARD] (state, id) {
      const foundIndex = state.boards.findIndex(x => x.id === id)
      state.boards.splice(foundIndex, 1)
    },

    [DELETE_USER_POST] (state, id) {
      const foundIndex = state.user_posts.findIndex(x => x.id === id)
      state.user_posts.splice(foundIndex, 1)
    }
  }
}

export default boardModule
