<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="mb-3">
        <b-btn :pressed="showCollapse" v-b-toggle.collapseNotice :variant="showCollapse ? 'danger' : 'primary'">공지사항 {{ showCollapse ? '닫기' : '보기' }}</b-btn>
        <b-collapse id="collapseNotice" class="mt-2" v-model="showCollapse">
          <b-alert v-if="checklist" show variant="info">
            <h4 class="alert-heading">{{checklist.title}}</h4>
            <hr>
            <div v-html="checklist.memo"></div>
          </b-alert>
        </b-collapse>
      </div>
      <!-- <b-row class="my-2">
        <b-col>
          <b-form-input
            :placeholder="'평가 항목명을 입력하세요'"
            v-model="searchText">
          </b-form-input>
        </b-col>
      </b-row> -->
      <!--<b-container fluid>-->
        <b-row>
          <b-col lg="3" :key="item.id" v-for="item in items">
            <checklist-item :info="getWrappedInfo(item)"></checklist-item>
          </b-col>
        </b-row>
      <!--</b-container>-->
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import ChecklistItem from '../components/ChecklistItem'
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
      filteredNumbers: [],
      numbers: [ 1, 2, 3, 4, 5 ],
      showCollapse: true,
      form: {
        items: []
      }
    }
  },

  // watch: {
  //   searchText () {
  //     if (!this.searchText) {
  //       this.filteredNumbers = []
  //     }
  //   }
  // },

  methods: {
    onFilter () {
      this.filteredNumbers = this.numbers.filter(value => {
        return value.toString() === this.searchText
      })
    },

    getWrappedInfo (item) {
      return {
        list_id: this.checklist.list_id,
        example1_title: this.checklist.example1_title,
        example2_title: this.checklist.example2_title,
        notice1_title: this.checklist.notice1_title,
        notice2_title: this.checklist.notice2_title,
        scoring: JSON.parse('[' + this.checklist.scroring + ']'),
        item: item
      }
    },

    ...mapActions([
      'fetchUserCheckListDetails'
    ])
  },

  computed: {
    items () {
      if (this.searchText) {
        return this.numbers.filter(value => {
          return value.toString() === this.searchText
        })
      } else {
        return this.numbers
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