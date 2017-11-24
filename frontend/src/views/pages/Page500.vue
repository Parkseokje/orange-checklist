<template>
  <div class="app flex-row align-items-center">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="clearfix">
            <h1 class="float-left display-3 mr-4">{{data.status}}</h1>
            <h4 class="pt-3">죄송합니다</h4>
            <p class="text-muted">
              찾으시는 페이지는 일시적으로 접근이 불가한 상태입니다.
              <p v-if="response">
                <b-alert show variant="danger">{{data.error_messages}}</b-alert>
              </p>
              <button class="btn btn-info" type="button" @click="goBack">돌아가기</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { LOGOUT } from '../../store/mutation-types'

export default {
  name: 'Page404',

  props: ['response'],

  methods: {
    goBack () {
      if (this.data.status === 401) {
        this.logout()
      } else {
        this.$router.push('/')
      }
    },

    ...mapMutations({
      logout: LOGOUT
    })
  },

  computed: {
    data () {
      if (this.response) {
        return {
          status: this.response.status,
          error_messages: this.response.data
        }
      } else {
        return {
          status: 500,
          error_messages: null
        }
      }
    }
  }
}
</script>