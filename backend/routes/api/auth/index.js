const router = require('express').Router();
const controller = require('./controller')
const authMiddleware = require('../../../middlewares/auth')

router.post('/signup', controller.signup)
router.post('/signin', controller.signin)

router.post('/forgot-password', controller.forgotPassword)
router.post('/reset-password', controller.resetPassword)

router.use('/verify', authMiddleware)
router.get('/verify', controller.verify)

module.exports = router