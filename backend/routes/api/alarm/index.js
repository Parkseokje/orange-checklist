const router = require('express').Router();
const controller = require('./controller')

// 나의 알림
router.get('', controller.list)
router.post('', controller.create)
router.put('', controller.update)

module.exports = router
