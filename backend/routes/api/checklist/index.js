const router = require('express').Router();
const controller = require('./controller')

router.get('/list', controller.list)
router.get('/user', controller.userList)
router.get('/user/:id', controller.userDetail)
router.get('/:id', controller.detail)
router.post('', controller.create)
router.put('', controller.update)
router.put('/answer', controller.updateAnswer)
router.delete('/:id', controller.delete)

module.exports = router