import axios from 'axios'
import lambdaConfig from '../lambda.config'

export default {
  getSignedURL (file, isImageUpload) {
    let endpoint

    if (!isImageUpload) {
      endpoint = lambdaConfig.AWS_LAMBDA_GETSIGNEDURL_FILE_UPLOAD_ENDPOINT
    } else {
      endpoint = lambdaConfig.AWS_LAMBDA_GETSIGNEDURL_ENDPOINT
    }

    let payload = {
      filePath: file.name,
      contentType: file.type
    }

    return axios.post(endpoint, payload)
      .then((res) => {
        return Promise.resolve(res.data || '/')
      })
      .catch((err) => {
        console.error(err)
        return Promise.resolve('/')
      })
  },

  getImagesToZipFile (files) {
    let endpoint = lambdaConfig.AWS_LAMBDA_DOWNLOAD_ZIP_ENDPOINT
    let payload = {
      folder: 'images-resized',
      files: ['1511414734320.300', '1511415403861.600']
    }

    return axios.post(endpoint, payload)
      .then((res) => {
        return Promise.resolve(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
