const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token
  const secret = req.app.get('jwt-secret')

  if (!token) {
    return res.status(401).json({
      success: false,
      info: {
        message: '토큰이 존재하지 않습니다.'
      }
    })
  }

  const jwtVerifyToken = new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err)
      resolve(decoded)
    })
  })

  jwtVerifyToken
    .then((decoded) => {
      req.decoded = decoded
      next()
    })
    .catch((err) => {
      res.send(401).json({
        success: false,
        info: {
          message: err.message
        }
      })
    })
}

module.exports = authMiddleware