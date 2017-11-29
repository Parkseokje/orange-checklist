const pool = require('../../../database')
const crypto = require('crypto')

exports.list = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
      SELECT id
           , company_id
           , shop_id
           , role
           , name
           , email
           , phone
           , memo
           , 'false' AS write_access
        FROM users
       WHERE company_id = ?
         AND active = 1;
    `
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
    shop_id,
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
      'INSERT INTO `users` (company_id, shop_id, role, name, password, email, phone, memo) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?); '

    connection.query(sql, [ company_id, shop_id, role, name, encryptedPassword, email, phone, memo ], (err, rows) => {
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
    shop_id,
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
      '   shop_id = ? ' +
      ' , role = ? ' +
      ' , name = ? ' +
      ' , email = ? ' +
      ' , phone = ? ' +
      ' , memo = ? ' +
      ' , updated_dt = NOW() ' +
      ' WHERE id = ?; '

    connection.query(sql, [ shop_id, role, name, email, phone, memo, id ], (err, rows) => {
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

exports.initPassword = (req, res) => {
  const secret = req.app.get('pwd-secret')
  const { id: user_id } = req.body

  const encryptedPassword =
    crypto.createHmac('sha1', secret)
      .update('111111')
      .digest('base64')

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql =
      'UPDATE `users` SET password = ? ' +
      ' WHERE id = ?; '

    connection.query(sql, [ encryptedPassword, user_id ], (err, rows) => {
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