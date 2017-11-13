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
      </b-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Category from '../components/Category'
import { mapGetters } from 'vuex'

export default {
  name: 'checklist',

  components: {
    Category
  },

  data () {
    return {
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
    }
  },

  computed: {
    ...mapGetters({
      categoryTypes: 'categoryTypes',
      modalVariants: 'modalVariants'
    }),

    collapseCategoryVariant () {
      return this.collapseCategoryPressed ? 'danger' : 'primary'
    }
  }
}
</script>