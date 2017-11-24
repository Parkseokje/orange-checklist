<template>
  <div class="app flex-row align-items-center animated fadeIn">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card-group mb-0">
            <div class="card p-4">
              <div class="card-body">
                <h2>로그인</h2>
                <p class="text-muted">모든 서비스는 로그인 후 이용 가능합니다.</p>
                <b-form @submit.prevent="onSubmit">
                  <b-input-group class="mb-2">
                    <b-input-group-addon><i class="icon-user"></i></b-input-group-addon>
                    <b-form-input v-model="credentials.email" type="text" placeholder="이메일을 입력하세요" autofocus="true"></b-form-input>
                  </b-input-group>
                  <b-input-group class="mb-2">
                    <b-input-group-addon><i class="icon-lock"></i></b-input-group-addon>
                    <b-form-input v-model="credentials.password" type="password" placeholder="암호를 입력하세요" autofocus="true"></b-form-input>
                  </b-input-group>

                  <b-form-checkbox class="mb-4" v-model="rememberEmail" value="accepted" unchecked-value="not_accepted">
                    이메일을 기억해주세요
                  </b-form-checkbox>

                  <b-row>
                    <b-col>
                      <b-btn type="submit" variant="primary">로그인</b-btn>
                    </b-col>
                    <b-col class="text-right">
                      <b-btn type="button" variant="link" class="px-0">암호를 잊으셨나요?</b-btn>
                    </b-col>
                  </b-row>
                </b-form>
              </div>
            </div>
            <!--<div class="card text-white bg-primary py-5 d-md-down-none" style="width:44%">
              <div class="card-body text-center">
                <div>
                  <h2>Sign up</h2>
                  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                  <button type="button" class="btn btn-primary active mt-3">Register Now!</button>
                </div>
              </div>
            </div>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Validator } from 'simple-vue-validator'
import { mapActions } from 'vuex'

export default {
  name: 'Login',

  validators: {
    'credentials.email' (value) {
      return Validator.value(value).required().email('잘못된 이메일 형식입니다.')
    },

    'credentials.password' (value) {
      return Validator.value(value).required()
    }
  },

  data () {
    return {
      credentials: {
        email: null,
        password: null
      },

      rememberEmail: 'not_accepted'
    }
  },

  watch: {
    rememberEmail (val) {
      if (val === 'accepted') {
        this.$cookie.set('remember', 'accepted', 1)
      } else {
        this.$cookie.set('remember')
        this.$cookie.delete('email')
      }
    }
  },

  methods: {
    ...mapActions([
      'login'
    ]),

    onSubmit () {
      this.$validate()
        .then(success => {
          if (success) {
            if (this.rememberEmail === 'accepted') {
              this.$cookie.set('email', this.credentials.email, { expires: '1D' })
            }

            this.login(this.credentials)
            this.$router.push('/')
          } else {
            alert('이메일/암호를 다시 확인해주세요.')
          }
        })
    }
  },

  created () {
    this.rememberEmail = this.$cookie.get('remember')

    if (this.rememberEmail === 'accepted') {
      this.credentials.email = this.$cookie.get('email')
    }
  }
}
</script>