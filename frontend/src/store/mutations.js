import {
  API_FAILURE
} from './mutation-types'
import router from '../router'

export default {
  [API_FAILURE] (state, message) {
    router.push('/error')
  }
}
