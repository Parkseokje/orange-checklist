const pool = require('../../../database')

exports.list = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = 'SELECT * FROM `shops` WHERE `company_id` = ? AND `active` = 1; '

    connection.query(sql, [ req.decoded.company_id ], (err, rows) => {
      if (err) {
        console.log(err)
        res.sendStatus(400)
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
  const {
    name,
    tel,
    address,
    memo,
    lat,
    lng
  } = req.body

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql =
      'INSERT INTO `shops` (company_id, name, tel, address, memo, lat, lng) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?); '

    connection.query(sql, [ req.decoded.company_id, name, tel, address, memo, lat, lng ], (err, rows) => {
      connection.release()

      if (err) {
        console.log(err)
        res.sendStatus(500)
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
    name,
    tel,
    address,
    memo,
    lat,
    lng
  } = req.body

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql =
      'UPDATE `shops` SET ' +
      '   name = ? ' +
      ' , tel = ? ' +
      ' , address = ? ' +
      ' , memo = ? ' +
      ' , lat = ? ' +
      ' , lng = ? ' +
      ' WHERE id = ?; '

    let q = connection.query(sql, [ name, tel, address, memo, lat, lng, id ], (err, rows) => {
      connection.release()

      console.log(q.sql)

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