<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="row">
        <div class="col-12">
          <b-card header="체크리스트 목록">
            <b-btn v-b-modal.modalAddCategory variant="primary">분류 등록</b-btn>
            <b-btn v-b-modal.modalAddChecklist variant="primary">체크리스트 등록</b-btn>
          </b-card>
        </div>
      </div>
    </div>
    <!-- 분류 등록 -->
    <b-modal id="modalAddCategory" title="분류등록" size="lg"
      :header-bg-variant="modalVariants.headerBgVariant"
      :header-text-variant="modalVariants.headerTextVariant"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      :ok-only="true"
      ok-title="닫기"
    >
      <b-tabs pills>
        <b-tab title="대분류" active>
          <category :category-type="categoryTypes.big.key"></category>
        </b-tab>
        <b-tab title="중분류">
          <category :category-type="categoryTypes.middle.key"></category>
        </b-tab>
        <b-tab title="소분류">
          <category :category-type="categoryTypes.small.key"></category>
        </b-tab>
      </b-tabs>
    </b-modal>
  </div>
</template>

<script>
import Category from '../components/Category'
import { mapGetters } from 'vuex'

export default {
  name: 'checklist',

  components: {
    Category
  },

  data () {
    return {
    }
  },

  methods: {
  },

  computed: {
    ...mapGetters({
      categoryTypes: 'categoryTypes',
      modalVariants: 'modalVariants'
    })
  }
}
</script>