const express = require('express');
const router = express.Router();
const users = require('../mockup/users.json');

router.get('/', (req, res, next) => {
  res.send(users)
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10)
  const users = users.filter((user) => {
    return user.id === id
  });

  res.send(users)
});

router.post('/', (req, res, next) => {
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
  return res.send({
    success: true
  })
})

module.exports = router;
