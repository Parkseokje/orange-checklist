<template>
  <b-card>
    <b-row class="pb-2">
      <b-col>
        <h6>
          <b-badge variant="primary">식사중 응대 / 테이블관리</b-badge>
          <b-badge variant="danger">5점</b-badge>
        </h6>
      </b-col>
    </b-row>
    <b-row class="pb-2">
      <b-col lg="6">
        <h6>고객맞이 인사태도</h6>
      </b-col>
      <b-col lg="6">
        <b-form-radio-group id="btnradios2"
          button-variant="outline-dark"
          v-model="selected"
          :options="options"
          name="radioBtnOutline"
        />
      </b-col>
      <b-col>
        <b-button-group>
          <b-btn @click="pressFileInput" :pressed="showFileInput" size="sm" variant="outline-dark" v-b-toggle.collapse-file-input><i class="icon-camera"></i></b-btn>
          <b-btn @click="pressTextInput" :pressed="showTextInput" size="sm" variant="outline-dark" v-b-toggle.collapse-text-input><i class="icon-pencil"></i></b-btn>
          <b-btn @click="pressHelpMessages" :pressed="showHelpMessages" size="sm" variant="outline-dark" v-b-toggle.collapse-card-body><i class="icon-question"></i></b-btn>
          <b-btn @click="closeAllCards" class="ml-1" size="sm" variant="outline-danger" v-show="showCloseAllCards"><i class="icon-close"></i></b-btn>
          <b-btn @click="saveCard" class="ml-1" size="sm" variant="primary"><i class="fa fa-save"></i></b-btn>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-collapse id="collapse-text-input" v-model="collapseTextInput">
          <b-card>
            <b-form-group label="기재사항">
              <b-form-input ref="example1Answer"></b-form-input>
            </b-form-group>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-collapse id="collapse-file-input" v-model="collapseFileInput">
          <b-card>
            <b-form-group label="파일선택">
              <b-form-file accept="image/*" :plain="true"></b-form-file>
            </b-form-group>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-collapse id="collapse-card-body" v-model="collapseHelpMessages">
          <b-card class="overflow-scroll">
            <carousel
              :perPage="1"
              :navigationEnabled="true"
              :navigationClickTargetSize="4"
              class="p-2">
              <slide>
                <b>제재기준</b>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis asperiores, temporibus magni reiciendis blanditiis excepturi ipsum iure suscipit tempore assumenda modi consectetur voluptatem voluptatibus, officiis dolorem praesentium ipsa quisquam velit.
                </p>
              </slide>
              <slide>
                <b>평가기준</b>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Corporis asperiores, temporibus magni reiciendis blanditiis excepturi ipsum iure suscipit tempore assumenda modi consectetur voluptatem voluptatibus, officiis dolorem praesentium ipsa quisquam velit.
                </p>
              </slide>
            </carousel>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import { Carousel, Slide } from 'vue-carousel'
export default {
  name: 'checklist-item',

  components: {
    Carousel,
    Slide
  },

  data () {
    return {
      showFileInput: false,
      showTextInput: false,
      showHelpMessages: false,
      collapseFileInput: false,
      collapseTextInput: false,
      collapseHelpMessages: false,
      selected: 'radio1',
      options: [
        { text: '1', value: 'radio1' },
        { text: '2', value: 'radio2' },
        { text: '3', value: 'radio3' },
        { text: '4', value: 'radio4' },
        { text: '5', value: 'radio5' },
        { text: '6', value: 'radio6' },
        { text: '7', value: 'radio7' }
      ]
    }
  },

  methods: {
    pressFileInput () {
      if (!this.showFileInput) {
        this.closeAllCards()
      }
      this.showFileInput = !this.showFileInput
    },

    pressTextInput () {
      if (!this.showTextInput) {
        this.closeAllCards()
      }

      this.showTextInput = !this.showTextInput
      this.$refs.example1Answer.focus()
    },

    pressHelpMessages () {
      if (!this.showHelpMessages) {
        this.closeAllCards()
      }
      this.showHelpMessages = !this.showHelpMessages
    },

    closeAllCards () {
      this.showFileInput = false
      this.showTextInput = false
      this.showHelpMessages = false
      this.collapseFileInput = false
      this.collapseTextInput = false
      this.collapseHelpMessages = false
    },

    saveCard () {

    }
  },

  computed: {
    showCloseAllCards () {
      return this.showFileInput || this.showTextInput || this.showHelpMessages
    }
  }
}
</script>

<style scoped>
  .overflow-scroll {
    position: relative;
    max-height: 250px;
    overflow-y: scroll;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0
  }
</style>