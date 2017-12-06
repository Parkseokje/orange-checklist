const pool = require('../../../database')
const async = require('async')
const fs = require('fs')
const request = require('request')
const archiver = require('archiver')

/**
 * 게시판 관리 > 게시판 목록 조회
 */
exports.list = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
    SELECT @id := id AS id
         , title
         , memo
         , created_dt
         , (SELECT COUNT(*) FROM board_contents WHERE board_id = @id) AS content_cnt
      FROM boards
     WHERE company_id = ?
       AND active = 1
     ORDER BY created_dt DESC; `

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

/**
 * 게시판 관리 > 게시판 목록 조회
 */
exports.listUsers = (req, res) => {
  const { id } = req.params

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
    SELECT u.id AS user_id
         , u.role AS user_role
         , u.name AS user_name
         , bu.write_access
      FROM boards AS b
     INNER JOIN board_users AS bu
        ON b.id = bu.board_id
     INNER JOIN users AS u
        ON bu.user_id = u.id
     WHERE b.id = ? `

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

/**
 * 게시판 관리 > 게시판 생성
 */
exports.create = (req, res) => {
  const {
    title,
    memo,
    users
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

      const insertBoard = callback => {
        const sql =
          'INSERT INTO `boards` (company_id, title, memo) ' +
          'VALUES (?, ?, ?); '

        connection.query(sql, [ req.decoded.company_id, title, memo ], (err, result) => {
          callback(err, result.insertId)
        })
      }

      const insertBoardUsers = (boardId, callback) => {
        let usersArray = users.map(user => [
          boardId,
          user.user_id,
          user.write_access
        ])

        const sql = `
          INSERT INTO board_users (
            board_id,
            user_id,
            write_access
          )
          VALUES ?;
        `

        connection.query(sql, [ usersArray ], (err, result) => {
          callback(err, null)
        })
      }

      async.waterfall([
        insertBoard,
        insertBoardUsers
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

/**
 * 게시판 관리 > 게시판 수정
 */
exports.update = (req, res) => {
  const {
    id,
    title,
    memo,
    users
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

      const updateBoard = callback => {
        const sql =
          'UPDATE `boards` SET title = ?, memo = ?, updated_dt = NOW() ' +
          ' WHERE id = ?; '

        connection.query(sql, [ title, memo, id ], (err, result) => {
          callback(err, result)
        })
      }

      const deleteBoardUsers = callback => {
        const sql = `
          DELETE FROM board_users
           WHERE board_id = ?;
        `

        connection.query(sql, [ id ], (err, result) => {
          callback(err, result)
        })
      }

      const insertBoardUsers = callback => {
        let usersArray = users.map(user => [
          id,
          user.user_id,
          user.write_access
        ])

        const sql = `
          INSERT INTO board_users (
            board_id,
            user_id,
            write_access
          )
          VALUES ?;
        `

        connection.query(sql, [ usersArray ], (err, result) => {
          callback(err, null)
        })
      }

      async.series([
        updateBoard,
        deleteBoardUsers,
        insertBoardUsers
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
 * 게시판 관리 > 게시판 삭제
 */
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

      const deleteBoardContentFiles = callback => {
        const sql = `DELETE FROM board_content_files WHERE board_id = ?; `

        connection.query(sql, [ id ], (err, result) => {
          callback(err, result)
        })
      }

      const deleteBoardContents = callback => {
        const sql = `DELETE FROM board_contents WHERE board_id = ?; `

        connection.query(sql, [ id ], (err, result) => {
          callback(err, result)
        })
      }

      const deleteBoardUsers = callback => {
        const sql = `DELETE FROM board_users WHERE board_id = ?; `

        connection.query(sql, [ id ], (err, result) => {
          callback(err, result)
        })
      }

      const deleteBoard = callback => {
        const sql = `DELETE FROM boards WHERE id = ?; `

        connection.query(sql, [ id ], (err, data) => {
          callback(err, data)
        })
      }

      async.series([
        deleteBoardContentFiles,
        deleteBoardContents,
        deleteBoardUsers,
        deleteBoard
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
 * 나의 게시판 > 게시판 목록 조회
 */
exports.userList = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
    SELECT @id := b.id AS board_id
         , b.title, b.memo
         , bu.*
         , (SELECT COUNT(*) FROM board_contents WHERE board_id = @id) AS content_cnt
      FROM boards AS b
     INNER JOIN board_users AS bu
        ON b.id = bu.board_id
       AND bu.user_id = ?
     WHERE b.active = 1
     ORDER BY b.created_dt DESC; `

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
 * 나의 게시판 > 모든 게시글 조회
 */
exports.selectAllPosts = (req, res) => {
  const {
    board_id
  } = req.query

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
    SELECT b.title, b.memo
         , bc.*
      FROM boards AS b
     INNER JOIN boards_contents AS bc
        ON b.id = bc.board_id
     WHERE b.board_id = ?
       AND b.company_id = ?
       AND b.active = 1
     ORDER BY bc.group_id DESC, bc.group_seq; `

    connection.query(sql, [ board_id, req.decoded.company_id ], (err, rows) => {
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
 * 나의 게시판 > 내 모든 게시글 조회
 */
exports.selectUserPosts = (req, res) => {
  const {
    board_id
  } = req.query

  pool.getConnection((err, connection) => {
    if (err) {
      console.log(error)
    };

    const sql = `
    SELECT b.title AS board_title, b.memo AS board_memo
         , u.name AS creator
         , @board_id := b.id AS board_id
         , @group_id := bc.group_id AS group_id
         , bc.group_seq
         , bc.depth
         , bc.title
         , bc.content
         , bu.write_access
         , bc.id AS content_id
         , bc.user_id
         , (SELECT COUNT(*) FROM board_contents WHERE board_id = @board_id AND group_id = @group_id AND id <> bc.id) AS reply_cnt
         , bcf.file_name
         , bcf.access_url
         , bc.created_dt
         , bc.updated_dt
         , CASE WHEN bc.user_id = ? THEN 1 ELSE 0 END AS is_owner
         , bc.active
      FROM boards AS b
     INNER JOIN board_users AS bu
        ON b.id = bu.board_id
       AND bu.user_id = ?
     INNER JOIN users AS u
        on bu.user_id = u.id
     INNER JOIN board_contents AS bc
        ON b.id = bc.board_id
      LEFT JOIN board_content_files AS bcf
        ON bc.id = bcf.board_content_id
     WHERE b.active = 1
     ORDER BY bc.board_id, bc.group_id DESC, bc.group_seq;
    `

    connection.query(sql, [ req.decoded.id, req.decoded.id ], (err, rows) => {
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
 * 나의 게시판 > 게시글/덧글 생성
 */
exports.createUserPost = (req, res) => {
  const {
    board_id,
    title,
    content,
    file_name = null,
    access_url = null,
    parent_group_id,
    parent_group_seq,
    parent_depth
  } = req.body

  console.log(req.body)

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

      const updateBoardContent = callback => {
        if (parent_group_id) {
          const sql = `
          UPDATE board_contents SET group_seq = group_seq + 1
           WHERE board_id = ?
             AND group_id = ?
             AND group_seq > ?; `

          connection.query(sql, [ board_id, parent_group_id, parent_group_seq ], (err, result) => {
            callback(err, null)
          })
        } else {
          callback(null, null)
        }
      }

      const insertBoardContent = (data, callback) => {
        if (parent_group_id) {
          const sql = `
          INSERT INTO board_contents (board_id, user_id, group_id, group_seq, depth, title, content)
          SELECT ?, ?, ?, ?, ?, ?, ?; `

          connection.query(sql, [ board_id, req.decoded.id, parent_group_id, parent_group_seq + 1, parent_depth + 1, title, content ], (err, result) => {
            callback(err, result.insertId)
          })
        } else {
          const sql = `
            INSERT INTO board_contents (board_id, user_id, group_id, group_seq, depth, title, content)
            SELECT ?, ?, (SELECT IFNULL(MAX(group_id), 0) + 1 FROM board_contents WHERE board_id = ?), 1, 0, ?, ?; `

          connection.query(sql, [ board_id, req.decoded.id, board_id, title, content ], (err, result) => {
            callback(err, result.insertId)
          })
        }
      }

      // 파일 추가
      const insertBoardContentFile = (board_content_id, callback) => {
        if (!file_name) {
          callback(null, null)
        } else {
          const sql = `
            INSERT INTO board_content_files (
              board_id,
              user_id,
              board_content_id,
              file_name,
              access_url
            )
            VALUES (?,?,?,?,?);
          `

          connection.query(sql, [
            board_id,
            req.decoded.id,
            board_content_id,
            file_name,
            access_url
          ], (err, result) => {
            callback(err, null)
          })
        }
      }

      async.waterfall([
        updateBoardContent,
        insertBoardContent,
        insertBoardContentFile
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

/**
 * 나의 게시판 > 게시판 수정
 */
exports.updateUserPost = (req, res) => {
  const {
    board_id,
    content_id,
    title,
    content,
    file_name = null,
    access_url = null
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

      const updateBoardContent = callback => {
        const sql = `
        UPDATE board_contents SET title = ?, content = ?, updated_dt = NOW()
         WHERE id = ?; `

        connection.query(sql, [ title, content, content_id ], (err, result) => {
          callback(err, result)
        })
      }

      const deleteBoardContentFiles = callback => {
        if (!file_name) {
          callback(null, null)
        } else {
          const sql = `DELETE FROM board_content_files WHERE board_content_id = ?; `

          connection.query(sql, [ content_id ], (err, result) => {
            callback(err, result)
          })
        }
      }

      // 파일 추가
      const insertBoardContentFile = callback => {
        if (!file_name) {
          callback(null, null)
        } else {
          const sql = `
            INSERT INTO board_content_files (
              board_id,
              user_id,
              board_content_id,
              file_name,
              access_url
            )
            VALUES (?,?,?,?,?);
          `

          connection.query(sql, [
            board_id,
            req.decoded.id,
            content_id,
            file_name,
            access_url
          ], (err, result) => {
            callback(err, null)
          })
        }
      }

      async.series([
        updateBoardContent,
        deleteBoardContentFiles,
        insertBoardContentFile
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
 * 게시판 관리 > 게시판 삭제
 */
exports.deleteUserPost = (req, res) => {
  const {
    id: board_content_id
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

      const deleteBoardContentFiles = callback => {
        const sql = `DELETE FROM board_content_files WHERE board_content_id = ?; `

        connection.query(sql, [ board_content_id ], (err, result) => {
          callback(err, result)
        })
      }

      const deleteBoardContents = callback => {
        // const sql = `DELETE FROM board_contents WHERE id = ?; `
        const sql = `UPDATE board_contents SET active = 0 WHERE id = ?; `

        connection.query(sql, [ board_content_id ], (err, result) => {
          callback(err, result)
        })
      }

      async.series([
        deleteBoardContentFiles,
        deleteBoardContents
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

exports.zipUrls = (req, res) => {
  const rows = req.body
  // Not used
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
      let stream = request.get(row.access_url)

      stream.on('error', (err) => {
        console.log('Stream error:', err)
        return done(err)
      })
      .on('end', () => {
        console.log('Stream finished')
        return done()
      })

      // 폴더규칙: /download/파일명
      archive.append(stream, { name: `/download/${row.file_name}` })
    }, (err) => {
      if (err) {
        console.log('Async error:', err)
      }

      archive.finalize()
    })
  }
  const downloadUrl = (row, output) => {
    output.attachment(row.file_name)

    let stream = request.get(row.access_url)

    stream.pipe(output)

    stream.on('error', (err) => {
      console.log('Stream error:', err)
    })
    .on('end', () => {
      console.log('Stream finished')
    })
  }

  console.log(rows.length)

  if (rows.length > 1) {
    zipUrls('download', rows, res)
  } else {
    downloadUrl(rows[0], res)
  }

  // pool.getConnection((err, connection) => {
  //   if (err) {
  //     console.log(error)
  //   };

  //   const sql = `
  //     SELECT file_name, access_url
  //       FROM board_content_files
  //      WHERE id = ?;
  //   `
  //   connection.query(sql, [ id ], (err, rows) => {
  //     connection.release()

  //     if (err) {
  //       console.log(err)
  //       res.sendStatus(400)
  //     } else {
  //       if (rows.length > 0) {
  //         zipUrls('download', rows, res)
  //       } else {
  //         downloadUrl(rows[0], res)
  //       }
  //     }
  //   })
  // })
}