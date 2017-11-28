<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="게시판 목록">

        <b-form-select v-model="selectedBoard"
          :options="boardOptions" class="mb-3">
        </b-form-select>
        <!-- 테이블 toolbox -->
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
        <!-- 테이블 -->
        <b-table striped hover show-empty responsive
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
            <b-btn variant="outline-info" size="sm" @click.stop="details(row.item,row.index,$event.target)">결과보기</b-btn>
            <b-btn variant="outline-secondary" size="sm" v-if="isAdmin"@click.stop="modify(row.item,row.index,$event.target)">수정</b-btn>
            <b-btn variant="outline-danger" size="sm" v-if="isAdmin" @click.stop="remove(row.item,row.index,$event.target)">삭제</b-btn>
          </template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
const fields = {
  title: { label: '게시판명', sortable: true, 'class': 'text-center' },
  created_dt: { label: '생성일시', sortable: true, 'class': 'text-center' },
  actions: { label: '행동' }
}

export default {
  name: 'user-board',

  data () {
    return {
      collapseCreatePressed: false,
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
      selectedBoard: null
    }
  },

  methods: {
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    ...mapActions([])
  },

  computed: {
    collapseCreateVariant () {
      return this.collapseCreatePressed ? 'danger' : 'primary'
    },

    items () {
      return []
    },

    boardOptions () {
      return [
        { value: null, text: '게시판을 선택하세요.' }
      ]
    },

    ...mapGetters({
      messages: 'messages'
    })
  }
}
</script>