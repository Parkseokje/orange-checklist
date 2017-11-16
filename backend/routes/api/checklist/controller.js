const pool = require('../../../database')
const async = require('async')

exports.list = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = 'SELECT * FROM `checklists` WHERE `company_id` = ? AND `active` = 1 ORDER BY `created_dt` DESC; '
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

// 사용자 체크리스트 조회
exports.userlist = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
      SELECT c.id AS list_id, c.title, c.list_type, c.scoring, c.example1_title
           , c.example2_title, c.notice1_title, c.notice2_title, c.memo
           , cu.id AS user_list_id, cu.shop_id, s.name AS shop_name, cu.user_id, cu.from_date, cu.to_date
           , cu.updated_dt
           , CASE WHEN cu.to_date <= NOW() THEN '종료'
                  WHEN cu.updated_dt IS NULL THEN '진행전'
                  ELSE '진행중'
             END AS status
        FROM checklist_users AS cu
       INNER JOIN shops AS s
          ON cu.shop_id = s.id
       INNER JOIN checklists AS c
          ON cu.list_id = c.id
       WHERE cu.user_id = ?
         AND cu.active = 1
       ORDER BY cu.from_date DESC;
      `

    connection.query(sql, [ req.decoded.id ], (err, rows) => {
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


exports.detail = (req, res) => {
  const {
    id
  } = req.params

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const getChecklistItems = callback => {
      const sql = `SELECT * FROM checklist_items WHERE company_id = ? AND list_id = ? AND active = 1 ORDER BY turn; `
      connection.query(sql, [ req.decoded.company_id, id ], (err, rows) => {
        callback(err, rows)
      })
    }

    const getChecklistUsers = (callback) => {
      const sql = `SELECT * FROM checklist_users WHERE company_id = ? AND list_id = ? AND active = 1 ORDER BY created_dt DESC; `
      connection.query(sql, [ req.decoded.company_id, id ], (err, rows) => {
        callback(err, rows)
      })
    }

    async.series([
      getChecklistItems,
      getChecklistUsers
    ], (err, results) => {
      connection.release()

      if (err) {
        console.log(err)
        return res.status(500).send({
          success: false,
          message: err
        });
      } else {
        res.send({
          success: true,
          info: {
            items: results[0],
            users: results[1]
          }
        })
      }
    }) // async.waterfall

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
          item.file_yn,
          item.turn
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
            file_yn,
            turn
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
            from_date,
            to_date
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

  const itemsToInsert = items.filter(item => {
    return !item.id
  })

  const itemsToUpdate = items.filter(item => {
    return !!item.id
  })

  const usersToInsert = users.filter(user => {
    return !user.id
  })

  const usersToUpdate = users.filter(user => {
    return !!user.id
  })

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
          UPDATE checklists SET
            title = '${title}',
            list_type = '${list_type}',
            scoring = '${scoring}',
            example1_title = '${example1_title}',
            example2_title = '${example2_title}',
            notice1_title = '${notice1_title}',
            notice2_title = '${notice2_title}',
            memo = '${memo}'
           WHERE id = '${id}';
        `
        connection.query(sql, [], (err, result) => {
          callback(err, result)
        })
      }

      const insertChecklistItems = (data, callback) => {
        if (itemsToInsert.length === 0) {
          callback(null, null)
        } else {
          let itemsArray = itemsToInsert.map(item => [
            req.decoded.company_id, // company_id 가 넘어오지 않음
            req.body.id,
            item.item_type,
            item.title,
            item.example1,
            item.example2,
            item.notice1,
            item.notice2,
            item.category1,
            item.category2,
            item.category3,
            item.file_yn,
            item.turn,
            item.active
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
              file_yn,
              turn,
              active
            )
            VALUES ?;
          `

          connection.query(sql, [ itemsArray ], (err, result) => {
            callback(err, null)
          })
        }
      }

      const updateChecklistItems = (item, callback) => {
        const sql = `
          UPDATE checklist_items SET
            item_type = ?,
            title = ?,
            example1 = ?,
            example2 = ?,
            notice1 = ?,
            notice2 = ?,
            category1_id = ?,
            category2_id = ?,
            category3_id = ?,
            file_yn = ?,
            turn = ?,
            active = ?
           WHERE id = ?;
        `

        connection.query(sql, [
          item.item_type,
          item.title,
          item.example1,
          item.example2,
          item.notice1,
          item.notice2,
          item.category1,
          item.category2,
          item.category3,
          item.file_yn,
          item.turn,
          item.active,
          item.id
        ], (err, result) => {
          callback(err, null)
        })
      }

      const updateChecklistItemsAsyncMap = (data, callback) => {
        async.map(itemsToUpdate, updateChecklistItems, (err, result) => {
          callback(err, null)
        })
      }

      const insertChecklistUsers = (data, callback) => {
        if (usersToInsert.length === 0) {
          callback(null, null)
        } else {
          let usersArray = usersToInsert.map(user => [
            req.decoded.company_id, // company_id 가 넘어오지 않음
            req.body.id,
            user.shop_id,
            user.user_id,
            user.from_date + ' ' + '00:00:00',
            user.to_date + ' ' + '23:59:59',
            user.active
          ])

          const sql = `
            INSERT INTO checklist_users (
              company_id,
              list_id,
              shop_id,
              user_id,
              from_date,
              to_date,
              active
            )
            VALUES ?;
          `

          connection.query(sql, [ usersArray ], (err, result) => {
            callback(err, null)
          })
        }
      }

      const updateChecklistUsers = (user, callback) => {
        const sql = `
          UPDATE checklist_users SET
            shop_id = ?,
            user_id = ?,
            from_date = ?,
            to_date = ?,
            active = ?
           WHERE id = ?;
        `

        connection.query(sql, [
          user.shop_id,
          user.user_id,
          user.from_date.substring(0, 10) + ' ' + '00:00:00',
          user.to_date.substring(0, 10) + ' ' + '23:59:59',
          user.active,
          user.id
        ], (err, result) => {
          callback(err, null)
        })
      }

      const updateChecklistUsersAsyncMap = (data, callback) => {
        async.map(usersToUpdate, updateChecklistUsers, (err, result) => {
          callback(err, null)
        })
      }

      async.waterfall([
        insertChecklist,
        insertChecklistItems,
        insertChecklistUsers,
        updateChecklistItemsAsyncMap,
        updateChecklistUsersAsyncMap
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

exports.delete = (req, res) => {
  const {
    id
  } = req.params

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    }

    connection.beginTransaction(err => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err
        })
      }

      // const checkUserAnswers = callback => {
      //   const sql = `SELECT COUNT(*) FROM checklist_user_item_answers WHERE list_id = ${id};`

      //   connection.query(sql, [], (err, row) => {
      //     callback(err, row)
      //   })
      // }

      const deleteChecklistUserFiles = callback => {
        const sql = `DELETE FROM checklist_user_item_files WHERE list_id = ${id};`

        connection.query(sql, [], (err, data) => {
          callback(err, data)
        })
      }

      const deleteChecklistUserAnswers = callback => {
        const sql = `DELETE FROM checklist_user_item_answers WHERE list_id = ${id};`

        connection.query(sql, [], (err, data) => {
          callback(err, data)
        })
      }

      const deleteChecklistUsers = callback => {
        const sql = `DELETE FROM checklist_users WHERE list_id = ${id};`

        connection.query(sql, [], (err, data) => {
          callback(err, data)
        })
      }

      const deleteChecklistItems = callback => {
        const sql = `DELETE FROM checklist_items WHERE list_id = ${id};`

        connection.query(sql, [], (err, data) => {
          callback(err, data)
        })
      }

      const deleteChecklist = callback => {
        const sql = `DELETE FROM checklists WHERE id = ${id};`

        connection.query(sql, [], (err, data) => {
          callback(err, data)
        })
      }

      async.series([
        deleteChecklistUserFiles,
        deleteChecklistUserAnswers,
        deleteChecklistUsers,
        deleteChecklistItems,
        deleteChecklist,
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
      }) // async.series
    }) // beginTransaction
  }) // getConnection
}