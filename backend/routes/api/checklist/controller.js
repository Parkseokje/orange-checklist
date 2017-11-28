const pool = require('../../../database')
const async = require('async')
const request = require('request')
const archiver = require('archiver')
const fs = require('fs')
const join = require('path').join
const aws = require('aws-sdk')
const s3Client = new aws.S3({ apiVersion: '2012-10-17', region: 'ap-northeast-2' })
// const AWSConfig = require('../../../aws.config.json')
// const s3Zip = require('s3-zip')

// 체크리스트 목록 조회
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

// 체크리스트 결과 조회
exports.result = (req, res) => {
  const {
    id,
    byshop = parseInt(byshop),
    view = 'month',
    company_id = req.decoded.company_id
  } = req.query

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    let sql = `
      SELECT @checklist_user_id := cu.id AS checklist_user_id
           , s.name AS shop_name
           , cu.shop_id
           , u.name AS user_name
           , cu.total_score
           , cu.from_date
           , cu.to_date
           , cu.updated_dt
           , (
              SELECT group_concat(concat(i.title, '@', ia.answer) separator '|')
                FROM checklist_user_item_answers AS ia
               INNER JOIN checklist_items AS i
                  ON ia.item_id = i.id
               WHERE ia.checklist_user_id = @checklist_user_id
                 AND i.item_type = 'short'
                 AND i.active = 1
               GROUP BY ia.list_id
             ) AS opinions
           , (
              SELECT group_concat(concat(f.file_name, '@', f.access_url) separator '|')
                FROM checklist_user_item_files AS f
               INNER JOIN checklist_items AS i
                  ON f.item_id = i.id
                 AND i.active = 1
               WHERE f.checklist_user_id = @checklist_user_id
                 AND i.file_yn = 1
               GROUP BY f.list_id
             ) AS files
           , false AS _showDetails
        FROM checklist_users AS cu
       INNER JOIN shops AS s
          ON cu.shop_id = s.id
       INNER JOIN users AS u
          ON cu.user_id = u.id
       WHERE cu.company_id = ? `

    if (view === 'month') {
      sql += `  AND DATE_FORMAT(NOW(), \'%Y-%m\') BETWEEN DATE_FORMAT(cu.from_date, \'%Y-%m\') AND DATE_FORMAT(cu.to_date,\'%Y-%m\') `
    }

    if (byshop == 1) {
      sql += `  AND cu.shop_id = ? `
    } else {
      sql += `  AND cu.list_id = ? `
    }
    sql += ` ORDER BY shop_name, from_date; `

    connection.query(sql, [ company_id, id ], (err, rows) => {
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

// 체크리스트 상세결과 조회
exports.resultDetail = (req, res) => {
  const {
    id: checklist_user_id,
    company_id = req.decoded.company_id
  } = req.params

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
      SELECT ci.title, ia.score
           , example1_title, ia.example1_answer
           , example2_title, ia.example2_answer
        FROM checklist_user_item_answers AS ia
       INNER JOIN checklist_items AS ci
          ON ia.item_id = ci.id
         AND ci.item_type = 'multiple'
         AND ci.active = 1
       INNER JOIN checklists AS c
          ON ia.list_id = c.id
       WHERE ia.checklist_user_id = ?
       ORDER BY ci.turn;
    `

    connection.query(sql, [ id ], (err, rows) => {
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

// 엑셀다운로드용 체크리스트 상세결과 조회
exports.resultDetailExcel = (req, res) => {
  const {
    id: list_id,
    company_id = req.decoded.company_id
  } = req.params

  const {
    view = 'month'
  } = req.query

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    let sql = `
      SELECT ci.title, ia.score
           , example1_title, ia.example1_answer
           , example2_title, ia.example2_answer
           , notice1, notice2
           , s.name AS shop_name
           , u.name AS user_name
           , cu.id AS checklist_user_id
        FROM checklist_users AS cu
       INNER JOIN shops AS s
          ON cu.shop_id = s.id
       INNER JOIN users AS u
          ON cu.user_id = u.id
       INNER JOIN checklist_user_item_answers AS ia
          ON cu.id = ia.checklist_user_id
       INNER JOIN checklist_items AS ci
          ON ia.item_id = ci.id
         AND ci.item_type = 'multiple'
         AND ci.active = 1
       INNER JOIN checklists AS c
          ON ia.list_id = c.id
       WHERE cu.list_id = ? `

    if (view === 'month') {
      sql += `  AND DATE_FORMAT(NOW(), \'%Y-%m\') BETWEEN DATE_FORMAT(cu.from_date, \'%Y-%m\') AND DATE_FORMAT(cu.to_date,\'%Y-%m\') `
    }
    sql += ` ORDER BY shop_name, user_name, cu.id, ci.turn; `

    connection.query(sql, [ list_id ], (err, rows) => {
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
exports.userList = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
      SELECT c.id AS list_id, c.title, c.list_type, c.scoring, c.example1_title
           , c.example2_title, c.notice1_title, c.notice2_title, c.memo, cu.memo AS user_memo
           , cu.id AS checklist_user_id, cu.shop_id, s.name AS shop_name, cu.user_id, cu.from_date, cu.to_date
           , cu.updated_dt
           , CASE WHEN cu.to_date < NOW() THEN '종료'
                  WHEN cu.updated_dt IS NULL THEN '진행전'
                  ELSE '진행중'
             END AS status
           , CASE WHEN cu.to_date < NOW() THEN 'success'
                  WHEN cu.updated_dt IS NULL THEN 'danger'
                  ELSE NULL
             END AS _rowVariant
        FROM checklist_users AS cu
       INNER JOIN shops AS s
          ON cu.shop_id = s.id
       INNER JOIN checklists AS c
          ON cu.list_id = c.id
       WHERE cu.user_id = ?
         AND cu.active = 1
       ORDER BY cu.updated_dt DESC;
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

// 체크리스트 평가항목, 배정자 목록 조회
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

// 사용자 체크리스트 평가항목 자료 조회
exports.userDetail = (req, res) => {
  const {
    id: checklist_user_id
  } = req.params

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const getChecklistItems = callback => {
      const sql = `
        SELECT ci.list_id, ci.id AS item_id, cu.id AS checklist_user_id, ca.id AS item_answer_id, ci.item_type, ci.title, ci.example1, ci.example2, ci.notice1, ci.notice2, ci.file_yn
             , (SELECT name FROM categories WHERE id = ci.category1) AS category1_name
             , (SELECT name FROM categories WHERE id = ci.category2) AS category2_name
             , (SELECT name FROM categories WHERE id = ci.category3) AS category3_name
             , ca.score, ca.answer, ca.example1_answer, ca.example2_answer, ca.updated_dt
          FROM checklist_items AS ci
         INNER JOIN checklist_users AS cu
            ON ci.list_id = cu.list_id
           AND cu.id = ?
          LEFT JOIN checklist_user_item_answers AS ca
            ON cu.id = ca.checklist_user_id
           AND ci.id = ca.item_id
         WHERE ci.active = 1
         ORDER BY turn; `

      connection.query(sql, [ checklist_user_id ], (err, rows) => {
        callback(err, rows)
      })
    }

    async.series([
      getChecklistItems
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
            list: results[0]
          }
        })
      }
    }) // async.waterfall

  })
}

// 체크리스트 생성
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
          VALUES (?,?,?,?,?,?,?,?,?);
        `
        connection.query(sql, [
          company_id,
          title,
          list_type,
          scoring.toString(),
          example1_title,
          example2_title,
          notice1_title,
          notice2_title,
          memo
        ], (err, result) => {
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
            category1,
            category2,
            category3,
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
          user.to_date + ' ' + '23:59:59',
          user.memo
        ])

        const sql = `
          INSERT INTO checklist_users (
            company_id,
            list_id,
            shop_id,
            user_id,
            from_date,
            to_date,
            memo
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

// 체크리스트 수정
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
            title = ?,
            list_type = ?,
            scoring = ?,
            example1_title = ?,
            example2_title = ?,
            notice1_title = ?,
            notice2_title = ?,
            memo = ?
           WHERE id = ?;
        `
        connection.query(sql, [
          title,
          list_type,
          scoring.toString(),
          example1_title,
          example2_title,
          notice1_title,
          notice2_title,
          memo,
          id
        ], (err, result) => {
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
              category1,
              category2,
              category3,
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
            category1 = ?,
            category2 = ?,
            category3 = ?,
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
            memo = ?,
            active = ?
           WHERE id = ?;
        `

        connection.query(sql, [
          user.shop_id,
          user.user_id,
          user.from_date.substring(0, 10) + ' ' + '00:00:00',
          user.to_date.substring(0, 10) + ' ' + '23:59:59',
          user.memo,
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

// 체크리스트 평가항목별 정답 수정
exports.updateAnswer = (req, res) => {
  const {
    list_id,
    item_id,
    item_answer_id,
    checklist_user_id,
    answer,
    score,
    example1_answer,
    example2_answer,
    file = null,
    user_id = req.decoded.id,
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

      // 정답 입력
      const insertAnswer = callback => {
        const sql = `
          INSERT checklist_user_item_answers (
            company_id,
            list_id,
            item_id,
            user_id,
            checklist_user_id,
            score,
            answer,
            example1_answer,
            example2_answer
          )
          VALUES (?,?,?,?,?,?,?,?,?)
        `
        connection.query(sql, [
          company_id,
          list_id,
          item_id,
          user_id,
          checklist_user_id,
          score,
          answer,
          example1_answer,
          example2_answer
        ], (err, result) => {
          callback(err, result.insertId)
        })
      }

      // 파일 추가
      const insertFiles = (checklist_user_item_answer_id, callback) => {
        if (!file) {
          callback(null, checklist_user_item_answer_id)
        } else {
          const sql = `
            INSERT INTO checklist_user_item_files (
              company_id,
              list_id,
              item_id,
              user_id,
              checklist_user_id,
              checklist_user_item_answer_id,
              file_name,
              access_url
            )
            VALUES (?,?,?,?,?,?,?,?);
          `

          connection.query(sql, [
            company_id,
            list_id,
            item_id,
            user_id,
            checklist_user_id,
            checklist_user_item_answer_id,
            file.file_name,
            file.access_url
          ], (err, result) => {
            callback(err, null)
          })
        }
      }

      // 파일 삭제
      const deleteFiles = (checklist_user_item_answer_id, callback) => {
        if (!file) {
          callback(null, checklist_user_item_answer_id)
        } else {
          const sql = `
            DELETE FROM checklist_user_item_files
             WHERE checklist_user_item_answer_id = ?
          `

          connection.query(sql, [ checklist_user_item_answer_id ], (err, result) => {
            callback(err, checklist_user_item_answer_id)
          })
        }
      }

      // 정답 수정
      const updateAnswer = (callback) => {
        const sql = `
          UPDATE checklist_user_item_answers SET
            score = ?,
            answer = ?,
            example1_answer = ?,
            example2_answer = ?
           WHERE id = ?;
        `

        connection.query(sql, [
          score,
          answer,
          example1_answer,
          example2_answer,
          item_answer_id
        ], (err, result) => {
          callback(err, item_answer_id)
        })
      }

      // 종합정수 계산
      const updateTotalScore = (checklist_user_item_answer_id, callback) => {
        const sql = `
          UPDATE checklist_users SET
            total_score = (SELECT SUM(IFNULL(score, 0)) FROM checklist_user_item_answers WHERE checklist_user_id = checklist_users.id),
            updated_dt = NOW()
           WHERE id = ?;
        `

        connection.query(sql, [
          checklist_user_id
        ], (err, result) => {
          callback(err, checklist_user_item_answer_id)
        })
      }

      let series = []

      if (!item_answer_id) {
        series.push(insertAnswer)

        if (file) {
          series.push(insertFiles)
        }
      } else {
        series.push(updateAnswer)

        if (file) {
          series.push(deleteFiles)
          series.push(insertFiles)
        }
      }

      // 종합정수 계산
      series.push(updateTotalScore)

      async.waterfall(series, (err, checklist_user_item_answer_id) => {
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
                success: true,
                item_answer_id: checklist_user_item_answer_id
              })
            }
          })
        }
      }) // async.waterfall
    }) // beginTransaction
  }) // getConnection
}

// 체크리스트 삭제
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

exports.zipImages = (req, res, next) => {
  const { id: list_id } = req.params
  const zipUrls = (name, rows, output) => {
    output.attachment(name + '.zip')

    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level.
    })

    archive.on('error', (err) => {
      archive.abort()
      console.log('Archive error:', err)
      return output.status(500).send('Error while zipping')
    })

    archive.on('end', () => {
      console.log('Archive finished')
    })

    archive.pipe(output)

    async.each(rows, (row, done) => {
      let stream = request.get(row.url)

      stream.on('error', (err) => {
        console.log('Stream error:', err)
        return done(err)
      })
      .on('end', () => {
        return done()
      })

      // 폴더규칙: /download/체크리스트명/담당자명-점포명/파일명
      archive.append(stream, { name: `/download/${row.title}/${row.user_name}-${row.shop_name}/` + row.url.replace(/^.*\//g, '') }) // 파일명만 추출한다.
    }, (err) => {
      if (err) {
        console.log('Async error:', err)
      }

      archive.finalize()
    })
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
      SELECT c.title, s.name AS shop_name, u.name AS user_name, uif.access_url AS url
        FROM checklist_user_item_files AS uif
       INNER JOIN checklist_users AS cu
          ON uif.checklist_user_id = cu.id
       INNER JOIN checklists AS c
          ON cu.list_id = c.id
       INNER JOIN users AS u
          ON cu.user_id = u.id
       INNER JOIN shops AS s
          ON cu.shop_id = s.id
       WHERE uif.list_id = ?
    `
    connection.query(sql, [ list_id ], (err, rows) => {
      connection.release()

      if (err) {
        console.log(err)
        res.sendStatus(400)
      } else {
        zipUrls('download', rows, res)
      }
    })
  })
}