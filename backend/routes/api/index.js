const router = require('express').Router()
const authMiddleware = require('../../middlewares/auth')

const auth = require('./auth')
const user = require('./user')
const shop = require('./shop')
const category = require('./category')
const checklist = require('./checklist')
const board = require('./board')
const alarm = require('./alarm')

router.use('/auth', auth)

router.use('/user', authMiddleware)
router.use('/user', user)

router.use('/shop', authMiddleware)
router.use('/shop', shop)

router.use('/category', authMiddleware)
router.use('/category', category)

router.use('/checklist', authMiddleware)
router.use('/checklist', checklist)

router.use('/board', authMiddleware)
router.use('/board', board)

router.use('/alarm', authMiddleware)
router.use('/alarm', alarm)

module.exports = router