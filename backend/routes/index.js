const express = require('express')
const router = express.Router()
const fs = require('fs')
const request = require('request')
const archiver = require('archiver')

// const join = require('path').join
// const AWS = require('aws-sdk')
// const s3Client = new AWS.S3({ apiVersion: '2012-10-17', region: 'ap-northeast-2' })
// const AWSConfig = require('../aws.config.json')
// const s3Zip = require('s3-zip')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile(join(__dirname, '../public', 'index.html'))
})

router.post('/zip-images', (req, res, next) => {
  const images = [
    'https://s3.ap-northeast-2.amazonaws.com/orange-checklist/images-resized/1511414734320.300',
    'https://s3.ap-northeast-2.amazonaws.com/orange-checklist/images-resized/1511510040003.900'
  ]

  request.get(images[1]).pipe(res)
})

module.exports = router
