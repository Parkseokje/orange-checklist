<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="체크리스트 목록">
        <br><br>
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
          <template slot="shop_name" scope="row">
            <a @click.prevent="selectedShop = row.item.shop_id" v-b-modal.modalShopInfo href="#">{{ row.item.shop_name }}</a>
          </template>
          <template slot="from_date" scope="row">
            {{ row.item.from_date | moment('YYYY-MM-DD')  }}
          </template>
          <template slot="to_date" scope="row">
            {{ row.item.to_date | moment('YYYY-MM-DD')  }}
          </template>
          <template slot="updated_dt" scope="row">
            <span v-if="row.item.updated_dt">
              {{ row.item.updated_dt | moment('YYYY-MM-DD HH:mm')  }}
            </span>
          </template>
          <template slot="status" scope="row">
            {{ row.item.status  }}
          </template>
          <template slot="actions" scope="row">
            <b-btn v-if="row.item.status !== '종료'" variant="outline-info" size="sm" @click.stop="startChecklist(row.item,row.index,$event.target)">시작하기</b-btn>
            <b-btn v-if="row.item.status === '종료'" variant="outline-success" size="sm" @click.stop="showResult(row.item,row.index,$event.target)">결과보기</b-btn>
          </template>
        </b-table>
      </b-card>
    </div>

    <b-modal id="modalShopInfo" title="점포 정보" ok-only ok-title="확인">
      <shop-detail :id="selectedShop"></shop-detail>
    </b-modal>
  </div>
</template>

<script>
import ShopDetail from './ShopDetail'
import { mapGetters, mapActions } from 'vuex'

const fields = {
  title: { label: '체크리스트명', sortable: true, 'class': 'text-center' },
  shop_name: { label: '점포명', sortable: true, 'class': 'text-center' },
  from_date: { label: '시작일자', sortable: true, 'class': 'text-center' },
  to_date: { label: '종료일자', sortable: true, 'class': 'text-center' },
  updated_dt: { label: '최종 수정일시', sortable: true, 'class': 'text-center' },
  status: { label: '상태' },
  actions: { label: '행동' }
}

export default {
  name: 'user-checklist',

  components: {
    ShopDetail
  },

  created () {
    this.fetchUserCheckList()
  },

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
      selectedShop: null
    }
  },

  methods: {
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    startChecklist (item, index, button) {
      this.$router.push({name: '체크리스트 시작', params: { id: item.checklist_user_id }})
    },

    ...mapActions([
      'fetchUserCheckList'
    ])
  },

  computed: {
    ...mapGetters({
      items: 'getAllUserChecklist',
      messages: 'messages'
    })
  }
}
</script>