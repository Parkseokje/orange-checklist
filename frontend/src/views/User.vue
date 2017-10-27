<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="row">
        <div class="col-12">
          <b-card header="사용자 목록">
            <b-btn v-b-modal.modalCreateUser href="#" variant="primary">사용자 등록</b-btn>
            <br><br>

            <div class="row">
              <div class="col-md-3">
                <b-form-group horizontal label="페이지당 줄수" :label-cols="6">
                  <b-form-select :options="pageOptions" v-model="perPage" />
                </b-form-group>
              </div>
              <div class="col-md-3">
                <b-form-group horizontal label="필터" :label-cols="3">
                  <b-form-input v-model="filter" placeholder="검색어 입력" />
                </b-form-group>
              </div>
              <div class="col-md-2">
                <b-button :disabled="!sortBy" @click="sortBy = null">기본정렬</b-button>
              </div>
              <div class="col-md-4">
                <b-pagination align="right" :total-rows="totalRows" :per-page="perPage" v-model="currentPage" />
              </div>
            </div>

            <b-table striped hover show-empty
              :items="items"
              :fields="fields"
              :current-page="currentPage"
              :per-page="perPage"
              :filter="filter"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @filtered="onFiltered"
            >
              <template slot="actions" scope="row">
                <b-btn variant="info" size="sm" @click.stop="details(row.item,row.index,$event.target)">보기</b-btn>
                <b-btn variant="secondary" size="sm" @click.stop="modify(row.item,row.index,$event.target)">수정</b-btn>
                <b-btn variant="danger" size="sm" @click.stop="remove(row.item,row.index,$event.target)">삭제</b-btn>
              </template>
            </b-table>
          </b-card>
        </div>
      </div>
    </div>
    <!-- 사용자 정보 보기 모달 -->
    <b-modal id="modalShowInfo"
      @hide="resetModal"
    >
      <h4 slot="modal-header">Index: {{ modalDetails.index }}</h4>
      <pre>{{ modalDetails.data }}</pre>
    </b-modal>

    <!-- 사용자 생성 모달 -->
    <b-modal id="modalCreateUser"
      title="사용자 등록"
      :header-bg-variant="modalVariants.headerBgVariant"
      :header-text-variant="modalVariants.headerTextVariant"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      @hide="initializeForm"
      hide-footer
    >
      <b-form @submit.prevent="onSubmit" novalidate>
        <b-form-group
          label="구분"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.user_type')"
        >
          <b-form-select id="userTypeInput" :options="userTypes"
            :state="!validation.firstError('form.user_type')"
            v-model="form.user_type"
            required placeholder="이름을 입력하세요"></b-form-select>
        </b-form-group>
        <b-form-group
          description=""
          label="이름"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.name')"
        >
          <b-form-input type="text"
            :state="!validation.firstError('form.name')"
            :autocomplete="'off'"
            v-model="form.name"
            required placeholder="이름을 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description="숫자만 입력하세요(예. 01012341234)"
          label="핸드폰"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.cell_no')"
        >
          <b-form-input type="text"
            :state="!validation.hasError('form.cell_no')"
            :autocomplete="'off'"
            v-model="form.cell_no"
            required placeholder="핸드폰 번호를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description="user@example.com"
          label="이메일"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.email')"
        >
          <b-form-input type="email"
            :state="!validation.hasError('form.email')"
            :autocomplete="'off'"
            v-model="form.email"
            placeholder="이메일을 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description=""
          label="암호"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.password')"
        >
          <b-form-input type="password"
            :state="!validation.hasError('form.password')"
            v-model="form.password"
            required placeholder="암호를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description=""
          label="암호 재확인"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.password_confirm')"
        >
          <b-form-input type="password"
            :state="!validation.hasError('form.password_confirm')"
            v-model="form.password_confirm"
            required placeholder="암호를 다시 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description=""
          label="메모"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.memo')"
        >
          <b-form-textarea id="memoInput"
            :state="!validation.hasError('form.memo')"
            v-model="form.memo"
            placeholder="메모를 입력하세요"
            :rows="3"
            :max-rows="6">
          </b-form-textarea>
        </b-form-group>

        <b-container>
          <b-row>
            <b-col><b-btn block variant="primary" type="submit">저장</b-btn></b-col>
            <b-col><b-btn block variant="secondary" @click="initializeForm" type="reset">초기화</b-btn></b-col>
            <b-col><b-btn block variant="danger" @click="hideModal">취소</b-btn></b-col>
          </b-row>
        </b-container>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Validator } from 'simple-vue-validator'

const fields = {
  user_type: { label: '구분', sortable: true, 'class': 'text-center' },
  name: { label: '이름', sortable: true, 'class': 'text-center' },
  cell_no: { label: '핸드폰', 'class': 'text-center' },
  email: { label: '이메일' },
  actions: { label: 'Actions' }
}

export default {
  name: 'user',
  data () {
    return {
      fields: fields,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [
        { text: 5, value: 5 },
        { text: 10, value: 10 },
        { text: 15, value: 15 }
      ],
      sortBy: null,
      sortDesc: false,
      filter: null,
      modalDetails: { index: '', data: '' },
      form: null,
      modalLabelCols: 2,
      modalInputHorizontal: true
    }
  },

  validators: {
    'form.user_type' (value) {
      return Validator.custom(() => {
        if (Validator.isEmpty(value)) {
          return '필수선택'
        }
      })
    },
    'form.name' (value) {
      return Validator.value(value).required('필수입력')
    },
    'form.email' (value) {
      return Validator.value(value).email('잘못된 형식입니다.')
    },
    'form.cell_no' (value) {
      return Validator.value(value).required('필수입력').digit('숫자만 입력').length(11, '11자리 이상')
    },
    'form.password' (value) {
      return Validator.value(value).required('필수입력').minLength(6, '6자리 이상')
    },
    'form.password_confirm, form.password' (repeat, password) {
      if (this.validation.isTouched('form.password_confirm')) {
        console.log('haha')
        return Validator.value(repeat).required('필수입력').match(password, '암호 불일치')
      }
    },
    'form.memo' (value) {
      return Validator.value(value).maxLength(40, '40자 이내')
    }
  },

  methods: {
    ...mapActions([
      'fetchUserLists',
      'createUser',
      'updateUser',
      'deleteUser'
    ]),

    details (item, index, button) {
      this.modalDetails.data = JSON.stringify(item, null, 2)
      this.modalDetails.index = index
      this.$root.$emit('bv::show::modal', 'modalShowInfo', button)
    },

    modify (item, index, button) {
      this.form.id = item.id
      this.form.user_type = item.user_type
      this.form.name = item.name
      this.form.cell_no = item.cell_no
      this.form.email = item.email
      this.form.memo = item.memo

      this.$root.$emit('bv::show::modal', 'modalCreateUser', button)
    },

    remove (item, index, button) {
      if (confirm('정말 삭제하시겠습니까?')) {
        this.deleteUser(item.id)
      }
    },

    resetModal () {
      this.modalDetails.data = ''
      this.modalDetails.index = ''
    },

    hideModal () {
      this.initializeForm()
      this.$root.$emit('bv::hide::modal', 'modalCreateUser')
    },

    initializeForm () {
      this.form = Object.assign({}, this.form, {
        id: null,
        user_type: null,
        name: null,
        cell_no: null,
        email: null,
        password: null,
        password_confirm: null,
        memo: null,
        is_active: true
      })
    },

    onSubmit () {
      this.$validate()
        .then(success => {
          if (success) {
            alert('success!')
          } else {
            console.log(this.validation.hasError('form.email.value'))
          }
        })
      // if (this.form.password.value !== this.form.password_confirm.value) {
      //   this.form.password_confirm.state = false
      //   this.form.password_confirm.feedback = '암호가 일치하지 않습니다'
      //   return false
      // } else {
      //   console.log('haha')
      //   this.form.password_confirm.state = null
      //   this.form.password_confirm.feedback = null
      // }

      // this.createUser(this.form)
      // this.hideModal()
    },

    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  },

  created () {
    this.fetchUserLists()
    this.initializeForm()
  },

  computed: {
    ...mapGetters({
      items: 'all',
      userTypes: 'userTypes',
      modalVariants: 'modalVariants'
    })
  }
}
</script>