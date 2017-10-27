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
      hide-footer
      no-enforce-focus
    >
      <b-form @submit.prevent="onSubmit">
        <b-form-group
          label="구분"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
        >
          <b-form-select id="userTypeInput" :options="userTypes"
            :state="form.user_type.state"
            v-model="form.user_type.value"
            required placeholder="이름을 입력하세요"></b-form-select>
        </b-form-group>
        <b-form-group
          description=""
          label="이름"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
        >
          <b-form-input type="text"
            :state="form.name.state"
            :autocomplete="'off'"
            v-model="form.name.value"
            required placeholder="이름을 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description="숫자만 입력하세요(예. 01012341234)"
          label="핸드폰"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="form.cell_no.feedback"
          :state="form.cell_no.state"
        >
          <b-form-input type="text"
            :state="form.cell_no.state"
            :autocomplete="'off'"
            v-model="form.cell_no.value"
            required placeholder="핸드폰 번호를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description="user@example.com"
          label="이메일"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="form.email.feedback"
        >
          <b-form-input type="email"
            :state="form.email.state"
            :autocomplete="'off'"
            v-model="form.email.value"
            placeholder="이메일을 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description=""
          label="암호"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="form.password.feedback"
        >
          <b-form-input type="password"
            :state="form.password.state"
            v-model="form.password.value"
            required placeholder="암호를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description=""
          label="암호 재확인"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="form.password_confirm.feedback"
        >
          <b-form-input type="password"
            :state="form.password_confirm.state"
            v-model="form.password_confirm.value"
            required placeholder="암호를 다시 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description=""
          label="메모"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
        >
          <b-form-textarea id="memoInput"
            v-model="form.memo.value"
            placeholder="메모를 입력하세요"
            :rows="3"
            :max-rows="6">
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
import { mapGetters, mapActions } from 'vuex'

const fields = {
  user_type: { label: '구분', sortable: true, 'class': 'text-center' },
  name: { label: '이름', sortable: true, 'class': 'text-center' },
  // cell_no: { label: '핸드폰', 'class': 'text-center' },
  // email: { label: '이메일' },
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

    remove (item, index, button) {
      this.deleteUser(item.id)
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
        user_type: { value: null, state: null },
        name: { value: null, state: null },
        cell_no: { value: null, state: null, feedback: null },
        email: { value: null, state: null, feedback: null },
        password: { value: null, state: null, feedback: null },
        password_confirm: { value: null, state: null, feedback: null },
        memo: { value: null },
        is_active: true
      })
    },

    onSubmit () {
      if (this.form.password.value !== this.form.password_confirm.value) {
        this.form.password_confirm.state = false
        this.form.password_confirm.feedback = '암호가 일치하지 않습니다'
        return false
      } else {
        console.log('haha')
        this.form.password_confirm.state = null
        this.form.password_confirm.feedback = null
      }

      this.createUser(this.form)
      this.hideModal()
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