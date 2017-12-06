<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="mb-3">
        <b-btn size="sm" :pressed="showCollapse" v-b-toggle.collapseNotice :variant="showCollapse ? 'danger' : 'primary'">공지 및 전달사항 {{ showCollapse ? '닫기' : '보기' }}</b-btn>
        <b-collapse id="collapseNotice" class="mt-2" v-model="showCollapse">
          <b-alert v-if="checklist" show variant="success">
            <h5 class="alert-heading">{{checklist.title}}</h5>
            <div v-if="checklist.memo">
              <hr>
              <h6>공지사항</h6><br>
              <div v-html="checklist.memo"></div>
            </div>
            <div v-if="checklist.user_memo">
              <hr>
              <h6>전달사항</h6><br>
              <div v-html="checklist.user_memo"></div>
            </div>
          </b-alert>
        </b-collapse>
      </div>
      <b-row class="my-2">
        <b-col>
          <b-form-input
            :placeholder="'평가 항목명을 입력하세요'"
            v-model="searchText">
          </b-form-input>
        </b-col>
      </b-row>
      <!--<b-container fluid>-->
        <b-row>
          <b-col lg="3" :key="item.id" v-for="item in filteredItems ">
            <checklist-item :info="getWrappedInfo(item)"></checklist-item>
          </b-col>
        </b-row>
      <!--</b-container>-->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ChecklistItem from './UserChecklistItem'
import { mapGetters, mapActions } from 'vuex'
// import ChecklistService from '../services/ChecklistService'
// import { API_FAILURE } from '../store/mutation-types'

export default {
  name: 'checklist-start',

  components: {
    ChecklistItem
  },

  created () {
    if (this.$route.params.id && !this.checklist) {
      // 수정상태에서 새로고침 시 체크리스트를 다시 가져와야 하므로 부모 라우트로 이동시킴
      Vue.router.push('/user-checklist')
    } else {
      const id = this.$route.params.id
      this.fetchUserCheckListDetails(id)
    }
  },

  data () {
    return {
      searchText: null,
      // filteredItems: null,
      showCollapse: true,
      form: {
        items: []
      }
    }
  },

  // watch: {
  //   searchText () {

  //   }
  // },

  methods: {
    getWrappedInfo (item) {
      const info = {
        list_id: this.checklist.list_id,
        example1_title: this.checklist.example1_title,
        example2_title: this.checklist.example2_title,
        notice1_title: this.checklist.notice1_title,
        notice2_title: this.checklist.notice2_title,
        scoring: JSON.parse('[' + this.checklist.scoring + ']'),
        item: item
      }

      return info
    },

    ...mapActions([
      'fetchUserCheckListDetails'
    ])
  },

  computed: {
    filteredItems () {
      if (this.searchText) {
        return this.items.filter(item => {
          return (item.category2_name || '').concat(item.category3_name || '').concat(item.title).toLowerCase().indexOf(this.searchText.toLowerCase()) > -1
        })
      } else {
        return this.items
      }
    },

    checklist () {
      return this.fiterUserChecklistById(this.$route.params.id)[0]
    },

    ...mapGetters({
      fiterUserChecklistById: 'fiterUserChecklistById',
      items: 'getAllUserChecklistDetails'
    })
  }
}
</script>