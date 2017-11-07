<template>
  <div class="wrapper">
    <b-btn v-b-modal.modal1>Launch demo modal</b-btn>
    <!-- Modal Component -->
    <b-modal id="modal1" title="Bootstrap-Vue">
      <b-form>
        <b-form-group label="구분" :label-cols="3" :horizontal="true">
          <b-form-select id="userTypeInput" :options="userTypes" :state="form.user_type.state" v-model="form.user_type.value" required placeholder="이름을 입력하세요"></b-form-select>
        </b-form-group>
        <b-form-group description="" label="이름" :label-cols="3" :horizontal="true">
          <b-form-input type="text" :state="form.name.state" :autocomplete="'off'" v-model="form.name.value" required placeholder="이름을 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group description="숫자만 입력하세요(예. 01012341234)" label="핸드폰" :label-cols="3" :horizontal="true" :feedback="form.cell_no.feedback" :state="form.cell_no.state">
          <b-form-input type="text" :state="form.cell_no.state" :autocomplete="'off'" v-model="form.cell_no.value" required placeholder="핸드폰 번호를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group description="user@example.com" label="이메일" :label-cols="3" :horizontal="true" :feedback="form.email.feedback">
          <b-form-input type="email" :state="form.email.state" :autocomplete="'off'" v-model="form.email.value" placeholder="이메일을 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group description="" label="암호" :label-cols="3" :horizontal="true" :feedback="form.password.feedback">
          <b-form-input type="password" :state="form.password.state" v-model="form.password.value" required placeholder="암호를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group description="" label="암호 재확인" :label-cols="3" :horizontal="true" :feedback="form.password_confirm.feedback">
          <b-form-input type="password" :state="form.password_confirm.state" v-model="form.password_confirm.value" required placeholder="암호를 다시 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group description="" label="메모" :label-cols="3" :horizontal="true">
          <b-form-textarea id="memoInput" v-model="form.memo.value" placeholder="메모를 입력하세요" :rows="3" :max-rows="6">
          </b-form-textarea>
        </b-form-group>
        <b-btn class="mt-3" block variant="primary" type="submit">저장</b-btn>
        <b-btn class="mt-3" block variant="outline-secondary" @click="initializeForm" type="reset">초기화</b-btn>
        <b-btn class="mt-3" block variant="outline-danger" @click="hideModal">취소</b-btn>
      </b-form>
    </b-modal>
  </div>
</template>


<script>
export default {
  name: 'Test',

  data () {
    return {
      userTypes: [{
        text: 'A',
        value: null
      }],
      form: null
    }
  },

  methods: {
    initializeForm () {
      this.form = Object.assign({}, this.form, {
        id: null,
        user_type: {
          value: null,
          state: null
        },
        name: {
          value: null,
          state: null
        },
        cell_no: {
          value: null,
          state: null,
          feedback: null
        },
        email: {
          value: null,
          state: null,
          feedback: null
        },
        password: {
          value: null,
          state: null,
          feedback: null
        },
        password_confirm: {
          value: null,
          state: null,
          feedback: null
        },
        memo: {
          value: null
        },
        is_active: true
      })
    },

    hideModal () {
      this.initializeForm()
      this.$root.$emit('bv::hide::modal', 'modalCreateUser')
    }
  },

  created () {
    this.initializeForm()
  }
}
</script>