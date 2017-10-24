<template>
  <div class="animated fadeIn">
    <b-modal id="modalShowInfo"
      @hide="resetModal"
    >
      <h4 slot="modal-header">Index: {{ modalDetails.index }}</h4>
      <pre>{{ modalDetails.data }}</pre>
    </b-modal>
    <div class="row">
      <div class="col-12">
        <b-card header="사용자 목록">
          <b-button href="#" variant="primary">사용자 등록</b-button>
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
</template>

<script>
const fields = {
  user_type: { label: '구분', sortable: true, 'class': 'text-center' },
  name: { label: '이름', sortable: true, 'class': 'text-center' },
  cell_no: { label: '핸드폰', 'class': 'text-center' },
  actions: { label: 'Actions' }
}

export default {
  name: 'user',
  created () {
    this.$http.get('/api/users')
      .then((response) => {
        this.items = response.data
        this.totalRows = this.items.length
      })
  },
  data () {
    return {
      fields: fields,
      items: [],
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
      modalDetails: { index: '', data: '' }
    }
  },
  methods: {
    details (item, index, button) {
      this.modalDetails.data = JSON.stringify(item, null, 2)
      this.modalDetails.index = index
      this.$root.$emit('bv::show::modal', 'modalShowInfo', button)
    },
    resetModal () {
      this.modalDetails.data = ''
      this.modalDetails.index = ''
    },
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  }
}
</script>