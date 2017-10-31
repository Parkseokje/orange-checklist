const express = require('express');
const router = express.Router();
const categories = require('../mockup/mock_categories.json');

router.get('/', (req, res, next) => {
  res.send(categories)

  // 오류 테스트
  // res.status(500).send('Something broken!')
  // res.send({ success: false })
  // res.send({})
});

router.get('/:id', (req, res, next) => {
  const id = parseInt(req.params.id, 10)
  const categories = categories.filter((category) => {
    return category.id === id
  });

  res.send(categories)
});

router.post('/', (req, res, next) => {
  categories.push(req.body)

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
