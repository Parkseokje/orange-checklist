<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <!--<b-container fluid>-->
        <b-row>
          <b-col lg="4">
            <checklist-item></checklist-item>
          </b-col>
          <b-col lg="4">
            <checklist-item></checklist-item>
          </b-col>
          <b-col lg="4">
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
    }
  },

  methods: {
  },

  computed: {
  }
}
</script>