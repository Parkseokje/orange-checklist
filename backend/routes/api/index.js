const router = require('express').Router()
const authMiddleware = require('../../middlewares/auth')

const auth = require('./auth')
const user = require('./user')
const shop = require('./shop')
const category = require('./category')
const checklist = require('./checklist')

router.use('/auth', auth)

router.use('/user', authMiddleware)
router.use('/user', user)

router.use('/shop', authMiddleware)
router.use('/shop', shop)

router.use('/category', authMiddleware)
router.use('/category', category)

router.use('/checklist', authMiddleware)
router.use('/checklist', checklist)

module.exports = router