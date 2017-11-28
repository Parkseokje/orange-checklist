const express = require('express')
const router = express.Router()
const fs = require('fs')
const request = require('request')
const archiver = require('archiver')
const async = require('async')

// const join = require('path').join
// const AWS = require('aws-sdk')
// const s3Client = new AWS.S3({ apiVersion: '2012-10-17', region: 'ap-northeast-2' })
// const AWSConfig = require('../aws.config.json')
// const s3Zip = require('s3-zip')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.sendFile(join(__dirname, '../public', 'index.html'))
})

router.put('/zip-images', (req, res, next) => {
  const images = [
    'https://s3.ap-northeast-2.amazonaws.com/orange-checklist/images-resized/1511769811270.jpeg'
  ]

  // request.get(images[1]).pipe(res)
  const zipUrls = (name, urls, output) => {
    output.attachment(name + '.zip')

    let archive = archiver('zip')

    archive.on('error', (err) => {
      archive.abort()
      console.log(err)
      return output.status(500).send('Error while zipping')
    })

    archive.on('end', () => {
      console.log('Archive finished')
    })

    archive.pipe(output)

    async.each(urls, (url, done) => {
      let stream = request.get(url)

      stream.on('error', (err) => {
        return done(err)
      })
      .on('end', () => {
        return done()
      })

      archive.append(stream, { name: url.replace(/^.*\//g, '') }) // 파일명만 추출한다.
    }, (err) => {
      if (err) throw err

      archive.finalize()
    })
  }

  zipUrls('download', images, res)
})

module.exports = router
