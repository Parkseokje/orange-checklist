const pool = require('../../../database')

exports.list = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = 'SELECT * FROM `categories` WHERE `company_id` = ? AND `active` = 1; '
    connection.query(sql, [ req.decoded.company_id ], (err, rows) => {
      connection.release()
      
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
    depth,
    parent_id,
    name
  } = req.body

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql =
      'INSERT INTO `categories` (company_id, depth, parent_id, name) ' +
      'VALUES (?, ?, ?, ?); '

    connection.query(sql, [ req.decoded.company_id, depth, parent_id, name ], (err, rows) => {
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
    name
  } = req.body

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql =
      'UPDATE `categories` SET ' +
      '   name = ? ' +
      ' WHERE id = ?; '

    let q = connection.query(sql, [ name, id ], (err, rows) => {
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
      'DELETE FROM `categories` ' +
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