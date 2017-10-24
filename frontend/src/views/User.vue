<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-12">
        <b-card header="사용자 목록">
          <b-button href="#" variant="primary">사용자 등록</b-button>
          <br><br>

          <div class="row">
            <div class="col-md-3">
              <b-form-fieldset horizontal label="페이지당 행개수" :label-cols="6">
                <b-form-select :options="pageOptions" v-model="perPage" />
              </b-form-fieldset>
            </div>
            <div class="col-md-3">
              <b-form-fieldset horizontal label="필터" :label-cols="3">
                <b-form-input v-model="filter" placeholder="검색어 입력" />
              </b-form-fieldset>
            </div>
            <div class="col-md-6">
              <b-pagination align="right" :total-rows="totalRows" :per-page="perPage" v-model="currentPage" />
            </div>
          </div>

          <b-table striped
            :items="items"
            :fields="fields">
            <template slot="actions" scope="row">
              <b-btn variant="primary" size="sm" @click.stop="details(row.item,row.index,$event.target)">보기</b-btn>
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
  user_type: { label: '구분', sortable: true },
  name: { label: '이름', sortable: true },
  cell_no: { label: '핸드폰', sortable: false },
  actions: { label: 'Actions' }
}

const items = [
  { isActive: true, user_type: 'SV', name: 'Dickerson', cell_no: '010-2009-1407', memo: 'blah blah' },
  { isActive: true, user_type: 'SV', name: 'Dickerson', cell_no: '010-2009-1407', memo: 'blah blah' },
  { isActive: true, user_type: 'SV', name: 'Dickerson', cell_no: '010-2009-1407', memo: 'blah blah' }
]

export default {
  name: 'user',
  data () {
    return {
      fields: fields,
      items: items,
      currentPage: 1,
      perPage: 5,
      totalRows: items.length,
      pageOptions: [
        { text: 5, value: 5 },
        { text: 10, value: 10 },
        { text: 15, value: 15 }
      ],
      filter: null
    }
  }
}
</script>