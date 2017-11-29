import axios from 'axios'

export default {
  getBoards (cb, errorCb) {
    axios.get('/api/board/list')
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getBoardUsers (id, cb, errorCb) {
    axios.get(`/api/board/${id}/users`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getUserBoards (cb, errorCb) {
    axios.get('/api/board/user')
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getUserPosts (cb, errorCb) {
    axios.get('/api/board/user/posts')
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  getAllPosts (cb, errorCb) {
    axios.get('/api/board/posts')
      .then(response => {
        if (response.status === 200) {
          cb(response.data.info.list)
        }
      })
      .catch(error => errorCb(error))
  },

  createBoard (board, cb, errorCb) {
    return axios.post(`/api/board`, {
      title: board.title,
      memo: board.memo,
      users: board.users
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  createUserPost (post, cb, errorCb) {
    return axios.post(`/api/board/user/post`, {
      board_id: post.board_id,
      title: post.title,
      content: post.content,
      file: post.file,
      parent_group_id: post.parent_group_id,
      parent_group_seq: post.parent_group_seq,
      parent_depth: post.parent_depth
    })
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  updateBoard (board, cb, errorCb) {
    return axios.put(`/api/board`, board)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  updateUserPost (post, cb, errorCb) {
    return axios.put(`/api/board/user/post`, post)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  deleteBoardById (id, cb, errorCb) {
    return axios.delete(`/api/board/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  },

  deleteUserPostById (id, cb, errorCb) {
    return axios.delete(`/api/board/user/post/${id}`)
      .then(response => {
        if (response.status === 200) {
          cb(response.data)
        }
      })
      .catch(error => errorCb(error))
  }
}
