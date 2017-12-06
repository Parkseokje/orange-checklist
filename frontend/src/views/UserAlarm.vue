<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="알림 목록">
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
          :items="allAlarms"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @filtered="onFiltered"
        >
          <template slot="created_dt" scope="row">
            {{ row.item.created_dt | moment('YYYY-MM-DD HH:mm')  }}
          </template>
          <template slot="actions" scope="row">
            <b-btn variant="outline-info" size="sm" @click.stop="details(row.item,row.index,$event.target)">보기</b-btn>
          </template>
        </b-table>
      </b-card>
    </div>
    <!-- 정보 보기 모달 -->
    <b-modal v-if="modalDetails" id="modalShowInfo" ok-title="확인" cancel-title="닫기" @ok="updateAlarm(modalDetails)">
      <h5 slot="modal-header">{{ modalDetails.title }}</h5>
      <p>{{ modalDetails.memo }}</p>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

const fields = {
  // alarm_type: { label: '구분', sortable: true, 'class': 'text-center' },
  title: { label: '제목', sortable: true, 'class': 'text-center' },
  creator_name: { label: '전송자', sortable: true, 'class': 'text-center' },
  created_dt: { label: '전송일시', sortable: true, 'class': 'text-center' },
  actions: { label: '행동' }
}

export default {
  name: 'alarm',

  created () {
    if (this.allAlarms.length === 0) {
      this.fetchAlarmList()
    }
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
      modalDetails: null
    }
  },

  methods: {
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    details (item, index, button) {
      this.modalDetails = Vue.util.extend({}, item)

      setTimeout(() => {
        this.$root.$emit('bv::show::modal', 'modalShowInfo', button)
      }, 300)
    },

    ...mapActions([
      'fetchAlarmList',
      'updateAlarm'
    ])
  },

  computed: {
    ...mapGetters({
      messages: 'messages',
      allAlarms: 'getAllAlarms'
    })
  }
}
</script>