<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <h5 class="mt-3">
        Button style radios with <code>outline-primary</code> variant and size <code>lg</code>
      </h5>
      <b-form-radio-group id="btnradios2"
                          buttons
                          button-variant="outline-primary"
                          size="lg"
                          v-model="selected"
                          :options="options"
                          name="radioBtnOutline" />
    </div>
  </div>
</template>


<script>
export default {
  name: 'Test',

  data () {
    return {
      selected: 'radio1',
      options: [
        { text: '1', value: 'radio1' },
        { text: '2', value: 'radio2' },
        { text: '3', value: 'radio3' },
        { text: '4', value: 'radio4' },
        { text: '5', value: 'radio5' }
      ]
    }
  }
}
</script>