<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card>
      <carousel
        :perPageCustom="[[375, 1], [736, 2], [1024, 3]]"
        :navigationEnabled="true"
        :paginationEnabled="true"
      >
        <slide class="px-4">
          <h5 class="mb-4">
            Button style radios with <code>outline-primary</code> variant and size <code>lg</code>
          </h5>
          <b-form-radio-group id="btnradios2"
            buttons
            button-variant="outline-primary"
            v-model="selected"
            :options="options"
            name="radioBtnOutline" />
        </slide>
        <slide>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Sed quisquam dignissimos molestiae praesentium rerum,
            vel minus eaque fugiat deserunt adipisci assumenda et autem. Unde ratione dignissimos et eos ad numquam?
        </slide>
        <slide>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            Sed quisquam dignissimos molestiae praesentium rerum,
            vel minus eaque fugiat deserunt adipisci assumenda et autem. Unde ratione dignissimos et eos ad numquam?
        </slide>
      </carousel>
      </b-card>
    </div>
  </div>
</template>


<script>
import { Carousel, Slide } from 'vue-carousel'
export default {
  name: 'checklist-start',

  components: {
    Carousel,
    Slide
  },

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
