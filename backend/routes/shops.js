const express = require('express');
const router = express.Router();
const shops = require('../mockup/mock_shops.json');

router.get('/', (req, res, next) => {
  res.send(shops)

  // 오류 테스트
  // res.status(500).send('Something broken!')
  // res.send({ success: false })
  // res.send({})
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10)
  const users = shops.filter((user) => {
    return user.id === id
  });

  res.send(shops)
});

router.post('/', (req, res, next) => {
  shops.push(req.body)

  return res.send({
    success: true
  })
})

router.put('/', (req, res, next) => {
  return res.send({
    success: true
  })
})

router.delete('/:id', (req, res, next) => {
  const id = parseInt(req.params.id)

  return res.send({
    success: true
  })
})

module.exports = router;
