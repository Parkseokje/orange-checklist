const pool = require('../../../database')
const jwt = require("jsonwebtoken");
const async = require('async')
const crypto = require('crypto')
const path = require('path')

const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const config = require('../../../config')

const transporter = nodemailer.createTransport(smtpTransport({
  service: config.mailer.provider,
  auth: {
    user: config.mailer.auth.user,
    pass: config.mailer.auth.pass
  }
}))

const handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('views/'),
  extName: '.html'
}

transporter.use('compile', hbs(handlebarsOptions))

exports.verify = (req, res) => {
  res.json({
    success: true,
    info: {
      decoded: req.decoded
    }
  })
}

exports.signup = (req, res) => {
  res.send('signup router is working')
}

exports.signin = (req, res) => {
  const { email, password } = req.body
  const jwtSecret = req.app.get('jwt-secret')
  const pwdSecret = req.app.get('pwd-secret')

  const encryptedPassword =
    crypto.createHmac('sha1', pwdSecret)
      .update(password)
      .digest('base64')

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const verifyCredetials = (callback) => {
      const sql = `
      SELECT u.id, u.name, u.email, u.phone, u.role
           , u.company_id, u.password
           , c.name AS company_name
        FROM users AS u
       INNER JOIN companies AS c
          ON c.id = u.company_id
       WHERE u.email = ?;
      `
      connection.query(sql, [ email, password ], (err, row) => {
        connection.release()

        if (encryptedPassword !== row[0].password) {
          callback({ message: '암호가 일치하지 않습니다.' })
        } else {
          callback(err, row[0])
        }
      })
    }

    const jwtSign = (user, callback) => {
      if (user) {
        jwt.sign(
          {
            id: user.id,
            name: user.name,
            phone: user.phone,
            role: user.role,
            company_id: user.company_id
          },
          jwtSecret,
          {
            expiresIn: '7d',
            issuer: 'edu1004.kr',
            subject: 'userInfo'
          },
          (err, token) => {
            callback(err, { user, token })
          }
        )
      } else {
        callback({
          message: '사용자 정보가 없습니다.'
        }, null)
      }
    }

    async.waterfall([
      verifyCredetials,
      jwtSign
    ], (err, results) => {
      if (err) {
        console.log(err)
        res.status(401).json({
          success: false,
          info: {
            message: err.message
          }
        })
      } else {
        res.send({
          success: true,
          info: {
            name: results.user.name,
            email: results.user.email,
            role: results.user.role,
            token: results.token,
            company_name: results.user.company_name
          }
        })
      }
    })
  })
}

exports.forgotPassword = (req, res) => {
  const {
    email,
    send = false
  } = req.body

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const findEmail = callback => {
      const sql = `SELECT id, name, email FROM users WHERE email = ?; `
      connection.query(sql, [ email ], (err, row) => {
        if (row[0]) {
          callback(err, row[0])
        } else {
          callback({
            message: '존재하지 않는 이메일입니다.'
          }, null)
        }
      })
    }

    const createToken = (user, callback) => {
      crypto.randomBytes(20, (err, buffer) => {
        const token = buffer.toString('hex');

        callback(err, user, token)
      })
    }

    const updateUserToken = (user, token, callback) => {
      const sql = `
      UPDATE users SET
             reset_password_token = ?,
             reset_password_expires = DATE_ADD(NOW(), INTERVAL 1 DAY)
      WHERE id = ?; `

      connection.query(sql, [ token, user.id ], (err, result) => {
        callback(err, user, token)
      })
    }

    const sendEmail = (user, token, callback) => {
      if (!send) {
        callback(null, token)
      } else {
        const email = {
          to: user.email,
          from: config.mailer.email,
          template: 'forgot-password-email',
          subject: '암호 재설정',
          context: {
            url: `${req.protocol}://${req.headers.host}/reset-password?token=${token}`,
            name: user.name
          }
        }

        transporter.sendMail(email, err => {
          callback(err, token)
        })
      }
    }

    async.waterfall([
      findEmail,
      createToken,
      updateUserToken,
      sendEmail
    ], (err, result) => {
      if (err) {
        console.log(err)
        res.status(400).json({
          success: false,
          info: {
            message: err.message
          }
        })
      } else {
        res.send({
          success: true,
          info: {
            message: '이메일을 확인하세요.',
            token: result
          }
        })
      }
    })
  })
}

exports.resetPassword = (req, res) => {
  const {
    token: reset_password_token,
    newPassword,
    verifyPassword,
    send = false
  } = req.body

  if (newPassword !== verifyPassword) {
    return res.status(422).send({
      success: false,
      info: {
        message: '암호가 일치하지 않습니다.'
      }
    })
  }

  const secret = req.app.get('pwd-secret')
  const encryptedPassword =
  crypto.createHmac('sha1', secret)
    .update(newPassword)
    .digest('base64')

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const findUser = callback => {
      const sql = `
      SELECT id, name, email
        FROM users
       WHERE reset_password_token = ?
         AND NOW() <= reset_password_expires
      `
      connection.query(sql, [ reset_password_token ], (err, row) => {
        callback(err, row[0])
      })
    }

    const updateUserToken = (user, callback) => {
      if (!user) {
        callback({
          message: '토큰이 잘못되었거나 유효기간이 만료되었습니다.'
        }, user)
      } else {
        const sql = `
        UPDATE users SET
               password = ?,
               reset_password_token = NULL,
               reset_password_expires = NULL
         WHERE id = ?; `

        connection.query(sql, [ encryptedPassword, user.id ], (err, result) => {
          callback(err, user)
        })
      }
    }

    const sendEmail = (user, callback) => {
      if (!send) {
        callback(null, null)
      } else {
        const email = {
          to: user.email,
          from: config.mailer.email,
          template: 'reset-password-email',
          subject: '암호 변경 확인',
          context: {
            name: user.name,
            url: `${req.protocol}://${req.headers.host}/login`
          }
        }

        transporter.sendMail(email, err => {
          callback(err, null)
        })
      }
    }

    async.waterfall([
      findUser,
      updateUserToken,
      sendEmail
    ], (err) => {
      if (err) {
        console.log(err)
        res.status(400).json({
          success: false,
          info: {
            message: err.message
          }
        })
      } else {
        res.send({
          success: true,
          info: {
            message: '이메일을 확인하세요.'
          }
        })
      }
    })
  })
}