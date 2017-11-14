<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card class="mb-1">
        <b-row class="pb-2">
          <b-col>
            <h6>
              <b-badge variant="primary">식사중 응대 / 테이블관리</b-badge>
              <b-badge variant="danger">5점</b-badge>
            </h6>
          </b-col>
        </b-row>
        <b-row class="pb-2">
          <b-col lg="3">
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
              <b-btn :pressed.sync="btnShowFileInput" size="sm" variant="outline-dark" v-b-toggle.collapse-file-input><i class="icon-camera"></i></b-btn>
              <b-btn :pressed.sync="btnShowTextInput" size="sm" variant="outline-dark" v-b-toggle.collapse-text-input><i class="icon-pencil"></i></b-btn>
              <b-btn :pressed.sync="btnShowHelpMessages" size="sm" variant="outline-dark" v-b-toggle.collapse-card-body><i class="icon-question"></i></b-btn>
            </b-button-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-collapse id="collapse-text-input">
              <b-card>
                <b-form-group label="기재사항">
                  <b-form-input></b-form-input>
                </b-form-group>
              </b-card>
            </b-collapse>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <b-collapse id="collapse-file-input">
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
            <b-collapse id="collapse-card-body">
              <b-card>
                <carousel
                  :perPage="1"
                  :navigationEnabled="true"
                  :navigationClickTargetSize="4">
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
        <!--</b-card-body>-->
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
      btnShowFileInput: false,
      btnShowTextInput: false,
      btnShowHelpMessages: false,
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
    runFileInput () {
      // console.log(this.$refs.fileInput)
      this.$refs.fileInput1.click()
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
</style>