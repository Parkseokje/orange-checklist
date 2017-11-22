<template>
  <div class="animated fadeIn">
    <b-card :header="checklist ? checklist.title : ''">
      <!-- <b-btn v-if="isShopView" @click="onViewResult(checklist.id)" variant="primary" size="sm">전체보기</b-btn> -->
      <b-form-radio-group v-model="viewSelected"
        buttons button-variant="outline-primary" size="sm"
        @change="onViewChange"
        :options="viewOptions">
      </b-form-radio-group>
      <download-excel
        v-if="excelDataAll"
        class="btn btn-outline-primary btn-sm"
        :data= "excelDataAll"
        :fields="excelFields"
        :meta="excelMeta"
        :name= "checklist ? checklist.title : '체크리스트결과'">
        <i class="fa fa-download"></i>  엑셀
      </download-excel>
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
            <b-input-group>
              <b-form-input v-model="filter" placeholder="검색어 입력" />
              <b-input-group-button slot="right" v-if="filter">
                <b-btn @click="filter = null" variant="secondary"><i class="fa fa-remove"></i></b-btn>
              </b-input-group-button>
            </b-input-group>
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
        <template slot="from_date" scope="row">
          {{ row.item.from_date | moment('YYYY-MM-DD')  }}
        </template>
        <template slot="to_date" scope="row">
          {{ row.item.to_date | moment('YYYY-MM-DD')  }}
        </template>
        <template slot="shop_name" scope="row">
          <b-link @click.prevent="onViewShopResult(row.item.shop_name)"
            v-b-tooltip.hover title="이 점포의 결과만 보시려면 클릭하세요."
          >{{ row.item.shop_name }}</b-link>
        </template>
        <template slot="row-details" scope="row">
          <b-card class="animated fadeIn">
            <b-row class="mb-2" :key="item.key" v-for="item in convertOpinionsToArray(row.item.opinions)">
              <b-col sm="2" class="text-sm-left"><b>{{item.key}}:</b></b-col>
              <b-col><p>{{item.value}}</p></b-col>
            </b-row>
            <b-row v-if="row.item.files">
              <b-col sm="2" class="text-sm-left pb-2"><b>사진:</b></b-col>
              <b-col>
                <!-- <b-container fluid class="p-4"> -->
                  <b-row>
                    <b-col lg="2" class="pb-1" :key="item.key" v-for="item in convertFilesToArray(row.item.files)">
                      <a :href="item.value" target="_blank">
                        <b-img thumbnail rounded :src="item.value" alt="Thumbnail" />
                      </a>
                    </b-col>
                  </b-row>
                <!-- </b-container> -->
              </b-col>
            </b-row>
            <b-row class="pb-2">
              <b-col>
                <!-- <b-btn variant="outline-info" size="sm" @click.stop="detail(row.item,row.index,$event.target)"><i class="icon-magnifier"></i> 상세보기</b-btn> -->
                <!-- <download-excel v-if="row.item.details ? row.item.details.length : 0 > 0"
                  class="btn btn-outline-primary btn-sm"
                  :data= "getExcelData(row.item)"
                  :fields="excelFields"
                  :meta="excelMeta"
                  name= "data.xls">
                  <i class="fa fa-download"></i>  엑셀
                </download-excel> -->
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <!-- <b-card no-body> -->
                <!-- <b-table show-empty outlined bordered responsive class="bg-light"
                  :empty-text="messages.emptyText"
                  :items="excelDataFiltered(row.item.checklist_user_id)"
                  :fields="detailFields"
                >
                  <template slot="example_answers" scope="row">
                    <div v-if="row.item.example1_title || row.item.example2_title ">
                      <span v-if="row.item.example1_title">
                        <b>{{row.item.example1_title}}</b>: {{row.item.example1_answer}}
                      </span>
                      <span v-if="row.item.example2_title">
                        <br><b>{{row.item.example2_title}}</b>: {{row.item.example2_answer}}
                      </span>
                    </div>
                    <div v-else>
                      없음
                    </div>
                  </template>
                </b-table> -->
                <!-- </b-card> -->
                <ul class="list-unstyled">
                  <li class="news-item" :key="item.checklist_user_id" v-for="item in excelDataFiltered(row.item.checklist_user_id)">
                    <span class="score">{{ item.score }}점</span>
                    <span class="title">{{ item.title }}</span><br>
                    <span class="meta" v-if="item.example1_title || item.example2_title">
                      <span v-if="item.example1_title">
                        <b>{{item.example1_title}}</b>: {{item.example1_answer}}
                      </span>
                      <span v-if="item.example2_title">
                        <br><b>{{item.example2_title}}</b>: {{item.example2_answer}}
                      </span>
                    </span>
                  </li>
                </ul>
              </b-col>
            </b-row>
          </b-card>
        </template>
        <template slot="updated_dt" scope="row">
          <span v-if="row.item.updated_dt">
            {{ row.item.updated_dt | moment('YYYY-MM-DD HH:mm')  }}
          </span>
        </template>
        <template slot="show_details" scope="row">
          <b-form-checkbox buttons v-model="row.item._showDetails"></b-form-checkbox>
        </template>
        <!-- <template slot="actions" scope="row">
          <download-excel
            class="btn btn-outline-primary btn-sm"
            :data= "getExcelData(row.item)"
            :fields="excelFields"
            :meta="excelMeta"
            name= "data.xls">
            다운로드
          </download-excel>
          <b-btn variant="outline-info" size="sm" @click.stop="download(row.item,row.index,$event.target)">다운로드</b-btn>
        </template> -->
      </b-table>
    </b-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import downloadExcel from 'vue-json-excel'

const excelFields = {
  shop_name: '점포',
  user_name: '담당자',
  item_title: '평가항목',
  item_score: '평가점수',
  item_example_answers: '기재사항'
}

const excelMeta = [{
  key: 'charset',
  value: 'utf-8'
}]

const fields = {
  from_date: { label: '시작일자', sortable: true, 'class': 'text-center' },
  to_date: { label: '종료일자', sortable: true, 'class': 'text-center' },
  shop_name: { label: '점포', sortable: true, 'class': 'text-center' },
  user_name: { label: '담당자', sortable: true, 'class': 'text-center' },
  total_score: { label: '평가점수', sortable: true, 'class': 'text-center' },
  updated_dt: { label: '마지막 평가일시', sortable: true, 'class': 'text-center' },
  // opinions: { label: '평가의견', sortable: true, 'class': 'text-center' },
  // files: { label: '사진', sortable: true, 'class': 'text-center' },
  show_details: { label: '더보기' }
  // actions: { label: '행동' }
}

const detailFields = {
  title: { label: '평가항목', 'class': 'text-center' },
  score: { label: '평가점수', 'class': 'text-center' },
  example_answers: { label: '기재사항' }
}

export default {
  name: 'checklist-result',

  props: ['checklist'],

  components: {
    downloadExcel
  },

  data () {
    return {
      viewOptions: [
        { text: '이번 달', value: 'month' },
        { text: '전체', value: 'whole' }
      ],
      excelFields: excelFields,
      excelMeta: excelMeta,
      viewSelected: 'month',
      fields: fields,
      detailFields: detailFields,
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
      isShopView: false
    }
  },

  watch: {
    // checklist-result, checklist-shop-result 가 같은 컴포넌트를 사용하므로
    // route 변함을 감지하여 데이터를 다르게 조회한다. (TODO 추후 좀 더 좋은 방안이 있으면 수정할 것)
    '$route' (to, from) {
      this.fetchData(to)
    }
  },

  methods: {
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    onViewChange (value) {
      this.fetchCheckListResult({ id: this.$route.params.id, view: value })
      this.fetchCheckListResultDetailsExcel({ id: this.checklist.id, view: value })
    },

    download (item, index, button) {
    },

    convertOpinionsToArray (opinions) {
      let arr = []

      if (opinions) {
        let temp = opinions.split('|')

        arr = temp.map((str) => {
          return { key: str.split('@')[0], value: str.split('@')[1] }
        })
      }

      return arr
    },

    convertFilesToArray (files) {
      let arr = []

      if (files) {
        let temp = files.split('|')

        arr = temp.map((str) => {
          return { key: str.split('@')[0], value: str.split('@')[1] }
        })
      }

      return arr
    },

    detail (item, index, button) {
      this.fetchCheckListResultDetails(item.checklist_user_id)
    },

    onViewShopResult (shopName) {
      this.filter = shopName
      // this.$router.push({name: '점포별 체크리스트 결과', params: { id: shopId, checklist: this.checklist }})
    },

    onViewResult (listId) {
      this.$router.push({name: '체크리스트 결과', params: { id: listId, checklist: this.checklist }})
    },

    fetchData (route) {
      if (route.name === '점포별 체크리스트 결과') {
        this.isShopView = true
        this.fetchCheckListResult({ id: route.params.id, view: this.viewSelected, byshop: 1 })
      } else {
        this.isShopView = false
        this.fetchCheckListResult({ id: route.params.id, view: this.viewSelected })
      }
    },

    getExcelData (item) {
      const excelData = []

      if (item.details) {
        item.details.map((obj) => {
          let exampleAnswers = ''

          if (obj.example1_answer) {
            exampleAnswers = obj.example1_answer
          }

          if (obj.example2_answer) {
            exampleAnswers += ' | ' + obj.example2_answer
          }

          excelData.push({
            title: item.shop_name,
            shop_name: item.shop_name,
            user_name: item.user_name,
            item_title: obj.title,
            item_score: obj.score,
            item_example_answers: exampleAnswers
          })
        })

        console.log(excelData)
      }

      return excelData
    },

    ...mapActions([
      'fetchCheckListResult',
      'fetchCheckListResultDetails',
      'fetchCheckListResultDetailsExcel'
    ]),

    showImageWindow (url) {
      window.open(url, '_blank')
    }
  },

  computed: {
    excelDataAll () {
      let result = []

      if (this.excelData) {
        this.excelData.map((obj) => {
          let exampleAnswers = ''

          if (obj.example1_answer) {
            exampleAnswers = obj.example1_answer
          }

          if (obj.example2_answer) {
            exampleAnswers += ' | ' + obj.example2_answer
          }

          result.push({
            shop_name: obj.shop_name,
            user_name: obj.user_name,
            item_title: obj.title,
            item_score: obj.score,
            item_example_answers: exampleAnswers
          })
        })
      }

      return result
    },

    ...mapGetters({
      messages: 'messages',
      items: 'getAllChecklistResult',
      excelData: 'getAllChecklistResultExcel',
      excelDataFiltered: 'getAllChecklistResultExcelByChecklistUserId'
    })
  },

  created () {
    if (this.$route.params.id && this.checklist) {
      this.fetchData(this.$route)
      this.fetchCheckListResultDetailsExcel({ id: this.checklist.id })
    } else {
      this.$router.push('/checklist')
    }
  }
}
</script>

<style scoped>
  .result-details {
    background-color: #fff;
  }
  .news-item {
    background-color: #fff;
    padding: 20px 30px 20px 80px;
    border-bottom: 1px solid #eee;
    position: relative;
    line-height: 20px;
  }

  .news-item .score {
    color: #f60;
    font-size: 1.1em;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 0;
    width: 80px;
    text-align: center;
    margin-top: -10px;
  }

  .news-item .meta,
  .news-item .host {
    font-size: 0.85em;
    color: #828282;
  }

  .news-item .meta a,
  .news-item .host a {
    color: #828282;
    text-decoration: underline;
  }

  .news-item .meta a:hover,
  .news-item .host a:hover {
    color: #f60;
  }
</style>
