<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="체크리스트 목록">
        <b-btn variant="primary" to="/checklist/create">체크리스트 등록</b-btn>
        <b-btn v-b-toggle.collapseCategory :variant="collapseCategoryVariant" :pressed.sync="collapseCategoryPressed">{{ collapseCategoryPressed ? '분류등록 취소' : '분류등록' }}</b-btn>

        <b-card border-variant="light" v-show="collapseCategoryPressed">
          <!-- 분류 등록 -->
          <b-collapse id="collapseCategory" class="mt-2">
            <b-tabs pills id="collapseCategory" v-model="tabIndex">
              <b-tab :title="categoryTypes.big.value" active>
                <category :category-type="categoryTypes.big"
                  @show-children="moveToMiddleCategory"></category>
              </b-tab>
              <b-tab :title="categoryTypes.middle.value">
                <category :category-type="categoryTypes.middle"
                  @show-children="moveToSmallCategory"
                  @clear-selected="dropdown1PassedVal = null"
                  :dropdown1-passed-val="dropdown1PassedVal"
                >
                </category>
              </b-tab>
              <b-tab :title="categoryTypes.small.value">
                <category :category-type="categoryTypes.small"
                  :dropdown1-passed-val="dropdown1PassedVal"
                  :dropdown2-passed-val="dropdown2PassedVal"
                  @clear-selected="dropdown1PassedVa2 = null"
                >
                </category>
              </b-tab>
            </b-tabs>
          </b-collapse>
        </b-card>

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
          <template slot="list_type" scope="row">
            {{checkListTypeByValue(row.item.list_type)[0].text }}
          </template>
          <template slot="actions" scope="row">
            <b-btn variant="outline-info" size="sm" @click.stop="details(row.item,row.index,$event.target)">결과보기</b-btn>
            <b-btn variant="outline-secondary" size="sm" @click.stop="modify(row.item,row.index,$event.target)">수정</b-btn>
            <b-btn variant="outline-danger" size="sm" @click.stop="remove(row.item,row.index,$event.target)">삭제</b-btn>
          </template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Category from '../components/Category'
import { mapGetters, mapActions } from 'vuex'

const fields = {
  list_type: { label: '구분', sortable: true, 'class': 'text-center' },
  title: { label: '체크리스트명', sortable: true, 'class': 'text-center' },
  actions: { label: '행동' }
}

export default {
  name: 'checklist',

  created () {
    if (this.items.length === 0) {
      this.fetchCheckList()
    }

    if (this.categories.length === 0) {
      this.fetchCategoryList()
    }

    if (this.allShops.length === 0) {
      this.fetchShopList()
    }

    if (this.allUsers.length === 0) {
      this.fetchUserList()
    }
  },

  components: {
    Category
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
      collapseCategoryPressed: false,
      tabIndex: 0,
      dropdown1PassedVal: null,
      dropdown2PassedVal: null
    }
  },

  methods: {
    moveToMiddleCategory (items) {
      this.tabIndex++
      this.dropdown1PassedVal = Vue.util.extend({}, items.dropdown1Selected)
      this.dropdown2PassedVal = null
    },

    moveToSmallCategory (items) {
      this.tabIndex++
      this.dropdown1PassedVal = Vue.util.extend({}, items.dropdown1Selected)
      this.dropdown2PassedVal = Vue.util.extend({}, items.dropdown2Selected)
    },

    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    details (item, index, button) {
      Vue.router.push({name: '체크리스트 결과', params: { id: item.id, checklist: item }})
    },

    modify (item, index, button) {
      Vue.router.push({name: '체크리스트 수정', params: { id: item.id }})
    },

    remove (item, index, button) {
      if (!confirm('삭제하시겠습니까?')) return false
      this.deleteChecklist(item.id)
    },

    ...mapActions([
      'fetchCheckList',
      'fetchCategoryList',
      'fetchShopList',
      'fetchUserList',
      'deleteChecklist'
    ])
  },

  computed: {
    ...mapGetters({
      items: 'getAllChecklists',
      categories: 'getAllCategories',
      categoryTypes: 'categoryTypes',
      allShops: 'getAllShops',
      allUsers: 'getAllUsers',
      modalVariants: 'modalVariants',
      checkListTypeByValue: 'checkListTypeByValue',
      messages: 'messages'
    }),

    collapseCategoryVariant () {
      return this.collapseCategoryPressed ? 'danger' : 'primary'
    }
  }
}
</script>