<template>
  <div class="app flex-row align-items-center animated fadeIn">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-body">
                <h2>비밀번호 재설정</h2>
                <p class="text-muted">올바른 암호를 입력해주세요.</p>
                <b-form @submit.prevent="onSubmit">
                  <b-input-group class="mb-2">
                    <b-input-group-addon><i class="icon-lock"></i></b-input-group-addon>
                    <b-form-input v-model="credentials.newPassword" type="text" placeholder="새로운 암호를 입력하세요" autofocus="true"></b-form-input>
                  </b-input-group>
                  <b-input-group class="mb-2">
                    <b-input-group-addon><i class="icon-lock"></i></b-input-group-addon>
                    <b-form-input v-model="credentials.verifyPassword" type="text" placeholder="다시 암호를 입력하세요" autofocus="true"></b-form-input>
                  </b-input-group>
                  <b-row>
                    <b-col>
                      <b-btn type="submit" variant="primary">재설정</b-btn>
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
  name: 'reset-password',

  mounted () {
    this.credentials.token = this.$route.query.token
  },

  validators: {
    'credentials.newPassword' (value) {
      return Validator.value(value).required('필수입력').minLength(6, '6자리 이상')
    },

    'credentials.verifyPassword, credentials.newPassword': function (repeat, password) {
      if (this.validation.isTouched('credentials.verifyPassword')) {
        return Validator.value(repeat).required().match(password)
      }
    }
  },

  data () {
    return {
      credentials: {
        newPassword: null,
        verifyPassword: null,
        token: null
      }
    }
  },

  methods: {
    onSubmit () {
      this.$validate()
        .then(success => {
          if (success) {
            Auth.resetPassword(this.credentials,
              data => console.log(data),
              err => console.error(err)
            )
          } else {
            alert('암호를 다시 확인해주세요.')
          }
        })
    }
  }
}
</script>