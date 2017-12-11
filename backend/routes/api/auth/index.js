const router = require('express').Router();
const controller = require('./controller')
const authMiddleware = require('../../../middlewares/auth')

router.post('/signup', controller.signup)
router.post('/signin', controller.signin)

router.get('/forgot-password', (req, res) => {
  res.render('index', { title: 'Hey', message: 'Hello World' })
})
router.post('/forgot-password', controller.forgotPassword)
router.post('/reset-password', controller.resetPassword)

router.use('/verify', authMiddleware)
router.get('/verify', controller.verify)

module.exports = router