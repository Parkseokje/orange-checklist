const router = require('express').Router();
const controller = require('./controller')

router.get('/list', controller.list)
router.post('', controller.create)
router.put('', controller.update)
router.delete('/:id', controller.delete)

module.exports = router