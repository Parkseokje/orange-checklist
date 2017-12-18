const router = require('express').Router();
const controller = require('./controller')

// 게시판 관리
router.get('/list', controller.list)
router.get('/:id/users', controller.listUsers)
router.post('', controller.create)
router.put('', controller.update)
router.delete('/:id', controller.delete)

// 나의 게시판
router.get('/user', controller.userList)
router.get('/user/posts', controller.selectUserPosts)
router.post('/user/post', controller.createUserPost)
router.put('/user/post', controller.updateUserPost)
router.delete('/user/post/:id', controller.deleteUserPost)
router.get('/posts', controller.selectAllPosts)

router.post('/zip-urls', controller.zipUrls)
router.post('/s3-download', controller.s3Download)

module.exports = router