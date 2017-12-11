<template>
  <div class="app flex-row align-items-center animated fadeIn">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-body">
                <h2>암호 복구</h2>
                <p class="text-muted">올바른 이메일을 입력해주세요.</p>
                <b-form @submit.prevent="onSubmit">
                  <b-input-group class="mb-2">
                    <b-input-group-addon><i class="icon-lock"></i></b-input-group-addon>
                    <b-form-input v-model="credentials.email" type="text" placeholder="이메일을 입력하세요" autofocus="true"></b-form-input>
                  </b-input-group>
                  <b-row>
                    <b-col>
                      <b-btn type="submit" variant="primary">이메일 전송</b-btn>
                      <b-btn :to="'/login'" variant="secondary">취소</b-btn>
                    </b-col>
                  </b-row>
                </b-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Validator } from 'simple-vue-validator'
import Auth from '../../services/AuthService'

export default {
  name: 'forgot-password',

  validators: {
    'credentials.email' (value) {
      return Validator.value(value).required().email('잘못된 이메일 형식입니다.')
    }
  },

  data () {
    return {
      credentials: {
        email: null,
        send: true
      }
    }
  },

  methods: {
    onSubmit () {
      this.$validate()
        .then(success => {
          if (success) {
            Auth.forgotPassword(this.credentials,
              data => {
                alert('이메일을 확인해주세요!')
                this.$router.push('/login')
              },
              err => {
                console.error(err)

                this.credentials.email = null
                alert('이메일이 존재하지 않습니다!')
              }
            )
          } else {
            alert('이메일을 다시 확인해주세요.')
          }
        })
    }
  }
}
</script>