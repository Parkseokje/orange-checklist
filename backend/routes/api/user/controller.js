const pool = require('../../../database')
const crypto = require('crypto')

exports.list = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = 'SELECT * FROM `users` WHERE `company_id` = ? AND `active` = 1; '
    connection.query(sql, [ req.decoded.company_id ], (err, rows) => {
      connection.release()

      if (err) {
        console.log(err)
        res.sendStatus(500)
      } else {
        res.send({
          success: true,
          info: {
            list: rows
          }
        })
      }
    })
  })
}

exports.create = (req, res) => {
  const secret = req.app.get('pwd-secret')
  const {
    company_id,
    role,
    name,
    password,
    email,
    phone,
    memo
  } = req.body

  const encryptedPassword =
    crypto.createHmac('sha1', secret)
      .update(password)
      .digest('base64')

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql =
      'INSERT INTO `users` (company_id, role, name, password, email, phone, memo) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?); '

    connection.query(sql, [ company_id, role, name, encryptedPassword, email, phone, memo ], (err, rows) => {
      connection.release()

      if (err) {
        console.log(err)
        res.sendStatus(400)
      } else {
        res.send({
          success: true
        })
      }
    })
  })
}

exports.update = (req, res) => {
  const {
    id,
    role,
    name,
    email,
    phone,
    memo
  } = req.body

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql =
      'UPDATE `users` SET ' +
      '   role = ? ' +
      ' , name = ? ' +
      ' , email = ? ' +
      ' , phone = ? ' +
      ' , memo = ? ' +
      ' , updated_dt = NOW() ' +
      ' WHERE id = ?; '

    connection.query(sql, [ role, name, email, phone, memo, id ], (err, rows) => {
      connection.release()

      if (err) {
        console.log(err)
        res.sendStatus(400)
      } else {
        res.send({
          success: true
        })
      }
    })
  })
}

exports.delete = (req, res) => {
  const {
    id
  } = req.params

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql =
      'DELETE FROM `shops` ' +
      ' WHERE id = ?; '

    connection.query(sql, [ id ], (err, rows) => {
      connection.release()

      if (err) {
        console.log(err)
        res.sendStatus(400)
      } else {
        res.send({
          success: true
        })
      }
    })
  })
}