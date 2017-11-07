const router = require('express').Router()
const authMiddleware = require('../../middlewares/auth')
const auth = require('./auth')
const user = require('./user')
const shop = require('./shop')
const category = require('./category')

router.use('/auth', auth)

router.use('/user', authMiddleware)
router.use('/user', user)

router.use('/shop', authMiddleware)
router.use('/shop', shop)

router.use('/category', authMiddleware)
router.use('/category', category)

module.exports = router