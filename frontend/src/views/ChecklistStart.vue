<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <checklist-item></checklist-item>
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