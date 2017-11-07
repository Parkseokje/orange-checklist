const pool = require('../../../database')

exports.list = (req, res) => {
  const company_id = 1

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = 'SELECT * FROM `categories` WHERE `company_id` = ? AND `active` = 1; '
    connection.query(sql, [ company_id ], (err, rows) => {
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