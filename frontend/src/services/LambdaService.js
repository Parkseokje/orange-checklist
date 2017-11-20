import axios from 'axios'
import lambdaConfig from '../lambda.config'

export default {
  getSignedURL (file) {
    let endpoint = lambdaConfig.AWS_LAMBDA_GETSIGNEDURL_ENDPOINT
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
  }
}
