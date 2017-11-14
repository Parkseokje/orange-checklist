const pool = require('../../../database')
const async = require('async')

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
    title,
    list_type,
    scoring,
    memo,
    example1_title,
    example2_title,
    notice1_title,
    notice2_title,
    items,
    users,
    company_id = req.decoded.company_id
  } = req.body

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    connection.beginTransaction(err => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err
        });
      }

      const insertChecklist = callback => {
        const sql = `
          INSERT INTO checklists (
            company_id,
            title,
            list_type,
            scoring,
            example1_title,
            example2_title,
            notice1_title,
            notice2_title,
            memo
          )
          VALUES (
            ${company_id},
            '${title}',
            '${list_type}',
            '${scoring}',
            '${example1_title}',
            '${example2_title}',
            '${notice1_title}',
            '${notice2_title}',
            '${memo}'
          );
        `
        connection.query(sql, [], (err, result) => {
          callback(err, result.insertId)
        })
      }

      const insertChecklistItems = (checklistId, callback) => {
        let itemsArray = items.map(item => [
          req.decoded.company_id, // company_id 가 넘어오지 않음
          checklistId,
          item.item_type,
          item.title,
          item.example1,
          item.example2,
          item.notice1,
          item.notice2,
          item.category1,
          item.category2,
          item.category3,
          item.file_yn
        ])

        const sql = `
          INSERT INTO checklist_items (
            company_id,
            list_id,
            item_type,
            title,
            example1,
            example2,
            notice1,
            notice2,
            category1_id,
            category2_id,
            category3_id,
            file_yn
          )
          VALUES ?;
        `

        connection.query(sql, [ itemsArray ], (err, result) => {
          callback(err, checklistId)
        })
      }

      const insertChecklistUsers = (checklistId, callback) => {
        let usersArray = users.map(user => [
          req.decoded.company_id, // company_id 가 넘어오지 않음
          checklistId,
          user.shop_id,
          user.user_id,
          user.from_date + ' ' + '00:00:00',
          user.to_date + ' ' + '23:59:59'
        ])

        const sql = `
          INSERT INTO checklist_users (
            company_id,
            list_id,
            shop_id,
            user_id,
            from_dt,
            to_dt
          )
          VALUES ?;
        `

        connection.query(sql, [ usersArray ], (err, result) => {
          callback(err, result)
        })
      }

      async.waterfall([
        insertChecklist,
        insertChecklistItems,
        insertChecklistUsers,
      ], (err, results) => {
        connection.release()

        if (err) {
          console.log(err)
          connection.rollback(() => {
            return res.status(500).send({
              success: false,
              message: err
            });
          });
        } else {
          connection.commit((err) => {
            if (err) {
              return res.status(500).send({
                success: false,
                message: err
              });
            } else {
              res.send({
                success: true
              })
            }
          })
        }
      }) // async.waterfall
    }) // beginTransaction
  }) // getConnection
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