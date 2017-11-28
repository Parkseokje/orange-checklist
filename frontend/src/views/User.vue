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

            <b-table striped hover responsive show-empty
              :empty-text="messages.emptyText"
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
                <!--<b-btn variant="outline-info" size="sm" @click.stop="details(row.item,row.index,$event.target)">보기</b-btn>-->
                <b-btn variant="outline-secondary" size="sm" @click.stop="modify(row.item,row.index,$event.target)">수정</b-btn>
                <b-btn variant="outline-warning" size="sm" @click.stop="initPassword(row.item,row.index,$event.target)">초기화</b-btn>
                <b-btn variant="outline-danger" size="sm" @click.stop="remove(row.item,row.index,$event.target)">삭제</b-btn>
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
      :title="form.title"
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
          :feedback="validation.firstError('form.role')"
        >
          <b-form-select id="userTypeInput" :options="userTypes"
            :state="!validation.firstError('form.role')"
            v-model="form.role"
            required placeholder="이름을 입력하세요"></b-form-select>
        </b-form-group>
        <b-form-group
          label="점포"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          v-if="displayShopSelect"
        >
          <v-select label="name"
            v-model="selectedShop"
            :options="shops"
            placeholder="점포를 선택하세요"
          ></v-select>
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
          description=""
          label="핸드폰"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.phone')"
        >
          <b-form-input type="text"
            :state="!validation.hasError('form.phone')"
            :autocomplete="'off'"
            v-model="form.phone"
            required placeholder="핸드폰 번호를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description=""
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
          v-if="!form.id"
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
          v-if="!form.id"
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
  role: { label: '구분', sortable: true, 'class': 'text-center' },
  shop_name: { label: '점포', sortable: true, 'class': 'text-center' },
  name: { label: '이름', sortable: true, 'class': 'text-center' },
  phone: { label: '핸드폰', 'class': 'text-center' },
  email: { label: '이메일' },
  actions: { label: '행동' }
}

export default {
  name: 'user',
  data () {
    return {
      selectedShop: null,
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
    'form.role' (value) {
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
      return Validator.value(value).required('필수입력').email('잘못된 형식입니다.')
    },
    'form.phone' (value) {
      return Validator.value(value).required('필수입력').digit('숫자만 입력').length(11, '11자리 이상')
    },
    'form.password' (value) {
      if (this.form.id) {
        return Validator.custom(() => {
          if (!Validator.isEmpty(value)) {
            return '암호를 수정할 수 없습니다.'
          }
        })
      } else {
        return Validator.value(value).required('필수입력').minLength(6, '6자리 이상')
      }
    },
    'form.password_confirm, form.password' (repeat, password) {
      if (this.form.id) {
        return Validator.custom(() => {
          if (!Validator.isEmpty(repeat) || !Validator.isEmpty(password)) {
            return '암호를 수정할 수 없습니다.'
          }
        })
      } else {
        if (this.validation.isTouched('form.password_confirm')) {
          return Validator.value(repeat).required('필수입력').match(password, '암호 불일치')
        }
      }
    },
    'form.memo' (value) {
      return Validator.value(value).maxLength(40, '40자 이내')
    }
  },

  methods: {
    ...mapActions([
      'fetchUserList',
      'fetchShopList',
      'createUser',
      'updateUser',
      'deleteUser',
      'requestPasswordInit'
    ]),

    details (item, index, button) {
      this.modalDetails.data = JSON.stringify(item, null, 2)
      this.modalDetails.index = index
      this.$root.$emit('bv::show::modal', 'modalShowInfo', button)
    },

    modify (item, index, button) {
      this.form.title = '사용자 수정'
      this.form.id = item.id
      this.form.role = item.role
      this.form.shop_id = item.shop_id
      this.form.shop_name = item.shop_name
      this.form.name = item.name
      this.form.phone = item.phone
      this.form.email = item.email
      this.form.memo = item.memo
      this.form.password = item.password ? item.password : ''
      this.form.password_confirm = this.form.password

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
        title: '사용자 등록',
        id: null,
        role: null,
        shop_id: null,
        shop_name: null,
        name: null,
        phone: null,
        email: null,
        password: null,
        password_confirm: null,
        memo: null,
        active: true
      })
    },

    onSubmit () {
      if (this.displayShopSelect) {
        if (this.selectedShop === null) {
          alert('점포를 선택하세요.')
          return false
        } else {
          this.form.shop_id = this.selectedShop.id
          this.form.shop_name = this.selectedShop.name
        }
      }

      this.$validate()
        .then(success => {
          if (success) {
            if (confirm('저장하시겠습니까?')) {
              if (this.form.id) {
                this.updateUser(this.form)
              } else {
                this.createUser(this.form)
              }
              this.hideModal()
            }
          } else {
            alert('유효하지 않은 입력값이 존재합니다.')
          }
        })
    },

    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    initPassword (item, index, button) {
      if (!confirm('비밀번호를 초기화 하시겠습니까? \n(111111 로 초기화 됩니다.)')) return false

      this.requestPasswordInit(item.id)
    }
  },

  created () {
    if (this.items.length === 0) {
      this.fetchUserList()
    }

    if (this.shops.length === 0) {
      this.fetchShopList()
    }

    this.initializeForm()
  },

  computed: {
    ...mapGetters({
      items: 'getAllUsers',
      shops: 'getAllShops',
      userTypes: 'userTypes',
      modalVariants: 'modalVariants',
      messages: 'messages',
      spinner: 'spinner'
    }),

    displayShopSelect () {
      return !(this.form.role === null || this.form.role !== 'shopkeeper')
    }
  }
}
</script>