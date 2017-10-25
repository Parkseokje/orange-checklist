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
                <b-form-fieldset horizontal label="페이지당 줄수" :label-cols="6">
                  <b-form-select :options="pageOptions" v-model="perPage" />
                </b-form-fieldset>
              </div>
              <div class="col-md-3">
                <b-form-fieldset horizontal label="필터" :label-cols="3">
                  <b-form-input v-model="filter" placeholder="검색어 입력" />
                </b-form-fieldset>
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
    >
      <b-form>
        <b-form-group id="userTypeInputGroup" label="구분" label-for="userTypeInput" description="">
          <b-form-select id="userTypeInput" :options="userTypes" v-model="form.selected" required placeholder="이름을 입력하세요"></b-form-select>
        </b-form-group>
        <b-form-group id="nameInputGroup" label="이름" label-for="nameInput" description="">
          <b-form-input id="name" type="text" required placeholder="이름을 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group id="cellNoInputGroup" label="핸드폰" label-for="cellNoInput" description="">
          <b-form-input id="cellNoInput" type="text" required placeholder="핸드폰 번호를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group id="passwordInputGroup" label="암호" label-for="passwordInput" description="">
          <b-form-input id="passwordInput" type="password" required placeholder="암호를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group id="passwordConfirmInputGroup" label="암호 재입력" label-for="passwordConfirmInput" description="">
          <b-form-input id="passwordConfirmInput" type="password" required placeholder="위 암호를 다시 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-textarea id="memoInput"
          placeholder="메모를 입력하세요"
          :rows="3"
          :max-rows="6">
        </b-form-textarea>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

const fields = {
  user_type: { label: '구분', sortable: true, 'class': 'text-center' },
  name: { label: '이름', sortable: true, 'class': 'text-center' },
  cell_no: { label: '핸드폰', 'class': 'text-center' },
  actions: { label: 'Actions' }
}

export default {
  name: 'user',
  data () {
    return {
      fields: fields,
      // items: [],
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
      form: {
        selected: null
      }
      // headerBgVariant: 'dark',
      // headerTextVariant: 'light'
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

    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  },
  created () {
    this.fetchUserLists()
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