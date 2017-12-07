const router = require('express').Router();
const controller = require('./controller')

router.get('/list', controller.list)
router.get('/user', controller.userList)
router.get('/user/:id', controller.userDetail)
router.get('/result', controller.result)
router.get('/result-detail/:id', controller.resultDetail)
router.get('/result-detail-excel', controller.resultDetailExcel)
router.get('/:id', controller.detail)
router.post('', controller.create)
router.put('', controller.update)
router.get('/zip-images/:id', controller.zipImages)
router.put('/answer', controller.updateAnswer)
router.delete('/:id', controller.delete)

module.exports = router