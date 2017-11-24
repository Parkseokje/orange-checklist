import {
  API_FAILURE
} from './mutation-types'
import router from '../router'

export default {
  [API_FAILURE] (state, error) {
    router.push({name: 'error', params: { response: error.response }})
  }
}
