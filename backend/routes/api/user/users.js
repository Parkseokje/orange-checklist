const express = require('express');
const router = express.Router();
const users = require('../mockup/mock_users.json');
const jwt = require("jsonwebtoken");

router.get('/', (req, res, next) => {
  res.send(users)

  // 오류 테스트
  // res.status(500).send('Something broken!')
  // res.send({ success: false })
  // res.send({})
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10)
  const users = users.filter((user) => {
    return user.id === id
  });

  res.send(users)
});

router.put('/', (req, res, next) => {
  return res.send({
    success: true
  })
})

router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id)
  // const foundIndex = users.findIndex(x => x.id === 1)

  // users.splice(foundIndex, 1)

  return res.send({
    success: true
  })
})

module.exports = router;
