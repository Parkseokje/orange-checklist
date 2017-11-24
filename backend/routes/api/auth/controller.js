const pool = require('../../../database')
const jwt = require("jsonwebtoken");
const async = require('async')
const crypto = require('crypto')

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
      const sql = 'SELECT `id`, `name`, `role`, `company_id`, `password` FROM `users` WHERE `email` = ?; '
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
            token: results.token
          }
        })
      }
    })
  })
}