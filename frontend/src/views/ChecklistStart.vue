<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-row class="my-2">
        <b-col>
          <b-form-input
            :placeholder="'평가 항목명을 입력하세요'"
            autofocus="true"
            v-model="searchText">
          </b-form-input>
        </b-col>
      </b-row>
      <!--<b-container fluid>-->
        <b-row>
          <b-col lg="3" v-for="n in items">
            <checklist-item></checklist-item>
          </b-col>
        </b-row>
      <!--</b-container>-->
    </div>
  </div>
</template>


<script>
import ChecklistItem from '../components/ChecklistItem'

export default {
  name: 'checklist-start',

  components: {
    ChecklistItem
  },

  data () {
    return {
      searchText: null,
      filteredNumbers: [],
      numbers: [ 1, 2, 3, 4, 5 ]
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
    }
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
    }
  }
}
</script>