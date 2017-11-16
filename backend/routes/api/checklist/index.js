const router = require('express').Router();
const controller = require('./controller')

router.get('/list', controller.list)
router.get('/user', controller.userlist)
router.get('/:id', controller.detail)
router.post('', controller.create)
router.put('', controller.update)
router.delete('/:id', controller.delete)

module.exports = router