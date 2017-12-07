const pool = require('../../../database')
const async = require('async')
const MessageService = require('../../../services/MessageService')

/**
 * 나의 알림 목록 조회
 */
exports.list = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
    SELECT a.id
         , a.alarm_type
         , a.title
         , a.memo
         , a.creator
         , u.name AS creator_name
         , a.active
         , a.created_dt
         , a.updated_dt
      FROM alarms AS a
      LEFT JOIN users AS u
        ON a.creator = u.id
     WHERE a.receiver = ?
       AND a.active = 1
     ORDER BY a.created_dt DESC; `

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

/**
 * 알림 생성
 */
exports.create = (req, res) => {
  const {
    alarm_type,
    title: memo_param,
    board_id = null,
    users = [],
    send_message = false // SMS 사용 시 true 로 변경할 것
  } = req.body

  let userIds = users.map(a => a.user_id);
  userIds = userIds.join(',')

  let title, memo
  switch (alarm_type) {
    case 'checklist':
      title = '체크리스트 추가/변경 알림'
      memo = `'${memo_param}' 체크리스트가 추가 또는 변경되었습니다.`
      break

    case 'board-new':
      title = '게시판 추가 알림'
      memo = `'${memo_param}' 게시판이 추가되었습니다.`
      break

    case 'board-modify':
      title = '게시판 수정 알림'
      memo = `'${memo_param}' 게시판이 수정되었습니다.`
      break

    case 'board-new-post':
      title = '게시판 게시글 등록 알림'
      memo = `'${memo_param}' 글이 추가되었습니다.`
      break

    case 'board-modify-post':
      title = '게시판 게시글 수정 알림'
      memo = `'${memo_param}' 글이 수정되었습니다.`
      break

    case 'board-new-reply':
      title = '게시판 답글 추가 알림'
      memo = `'${memo_param}' 글에 답글이 추가되었습니다.`
      break

    case 'board-modify-reply':
      title = '게시판 답글 수정 알림'
      memo = `'${memo_param}' 글에 답글이 수정되었습니다.`
      break

    default:
      break
  }

  const filterPhones = (users) => {
    let phones = users.map(a => a.phone)
    return phones.join(',')
  }

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    connection.beginTransaction(err => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: err
        })
      }

      const selectBoardUsers = callback => {
        if (board_id) {
          const sql = `
          SELECT u.id AS user_id
               , u.phone
            FROM boards AS b
           INNER JOIN board_users AS bu
              ON b.id = bu.board_id
           INNER JOIN users AS u
              ON bu.user_id = u.id
             AND u.active = 1
             AND u.id <> ?
           WHERE b.id = ? `

          connection.query(sql, [ req.decoded.id, board_id ], (err, rows) => {
            callback(err, rows)
          })
        } else {
          callback(err, users)
        }
      }

      const insertAlarm = (user, callback) => {
        const sql =
          'INSERT INTO `alarms` (company_id, alarm_type, title, memo, creator, receiver) ' +
          'VALUES (?,?,?,?,?,?); '

        connection.query(sql, [ req.decoded.company_id, alarm_type, title, memo, req.decoded.id, user.user_id ], (err, result) => {
          callback(err, result)
        })
      }

      const insertAlarmMap = (alarmUsers, callback) => {
        async.map(alarmUsers, insertAlarm, (err, result) => {
          callback(err, alarmUsers)
        })
      }

      const selectUserPhones = (receivers, callback) => {
        let userPhones

        if (board_id) {
          userPhones = filterPhones(receivers)
          callback(err, userPhones)
        } else {
          const sql = `
            SELECT phone
              FROM users
              WHERE id IN (${userIds})
          `

          connection.query(sql, [], (err, rows) => {
            userPhones = filterPhones(rows)
            callback(err, userPhones)
          })
        }
      }

      const sendMessages = (phones, callback) => {
        if (send_message && phones !== '') {
          MessageService.sendMessage({ phones, msg: '알림이 도착하였습니다.' }, result => {
            callback(null, null)
          })
        } else {
          callback(err, null)
        }
      }

      async.waterfall([
        selectBoardUsers,
        insertAlarmMap,
        selectUserPhones,
        sendMessages
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

/**
 * 알림 수정
 */
exports.update = (req, res) => {
  const {
    id
  } = req.body

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

      const updateAlarm = callback => {
        const sql =
          'UPDATE alarms SET active = 0, updated_dt = NOW() WHERE id = ?; '

        connection.query(sql, [ id ], (err, result) => {
          callback(err, result)
        })
      }

      async.series([
        updateAlarm
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