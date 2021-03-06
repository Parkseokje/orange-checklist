<template>
  <b-card>
    <b-row class="pb-2" v-if="isMultipleAnswer">
      <b-col>
        <h6>
          <b-badge variant="primary">{{categoryNames}}</b-badge>
          <b-badge v-if="form.score" variant="danger">{{form.score}}점</b-badge>
        </h6>
      </b-col>
    </b-row>
    <b-row class="pb-2">
      <b-col lg="12">
        <h6>{{info.item.title}}</h6>
      </b-col>
    </b-row>
    <b-row v-if="isMultipleAnswer">
      <b-col lg="12">
        <b-form-radio-group
          button-variant="outline-dark"
          v-model="form.score"
          :options="info.scoring"
          @change="onScoreChange"
        />
      </b-col>
    </b-row>
    <b-row class="pb-2" v-else>
      <b-col lg="12">
        <b-form-textarea v-model="form.answer" :rows="3"></b-form-textarea>
      </b-col>
    </b-row>
    <b-row>
      <b-col lg="12">
        <b-button-group class="pb-1">
          <b-btn v-if="showFileInput" @click="pressFileInput" :pressed="fileInputPressed" size="sm" variant="outline-dark"><i class="icon-camera"></i></b-btn>
          <b-btn v-if="showTextInput && isMultipleAnswer" @click="pressTextInput" :pressed="textInputPressed" size="sm" variant="outline-dark"><i class="icon-pencil"></i></b-btn>
          <b-btn v-if="showHelpMessages && isMultipleAnswer" @click="pressHelpMessages" :pressed="helpMessagedPressed" size="sm" variant="outline-dark"><i class="icon-question"></i></b-btn>
          <b-btn @click="closeAllCards" class="ml-1" size="sm" variant="outline-danger" v-show="showCloseAllCards"><i class="icon-close"></i></b-btn>
          <b-btn @click="saveCard" size="sm" variant="primary" :disabled="!isDirty"><i class="fa fa-save"></i></b-btn>
        </b-button-group>
      </b-col>
    </b-row>
    <b-row v-if="showFileInput">
      <b-col>
        <b-collapse id="collapseFileInput" v-model="fileInputPressed">
          <b-card>
            <dropzone v-on:complete="onFileUploadComplete"></dropzone>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
    <b-row v-if="showTextInput">
      <b-col>
        <b-collapse id="collapseTextInput" v-model="textInputPressed">
          <b-card>
            <b-form-group v-if="info.example1_title" :label="info.example1_title">
              <b-form-textarea v-model="form.example1Answer" :rows="3"></b-form-textarea>
            </b-form-group>
            <b-form-group v-if="info.example2_title" :label="info.example2_title">
              <b-form-textarea v-model="form.example2Answer" :rows="3"></b-form-textarea>
            </b-form-group>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
    <b-row v-if="showHelpMessages">
      <b-col>
        <b-collapse id="collapseHelpMessages" v-model="helpMessagedPressed">
          <b-card>
            <carousel
              :perPage="1"
              :navigationEnabled="true"
              :navigationClickTargetSize="4">
              <slide class="overflow-scroll" v-if="info.notice1_title && info.item.notice1">
                <b>{{info.notice1_title}}</b><br>
                <div v-html="info.item.notice1"></div>
              </slide>
              <slide class="overflow-scroll" v-if="info.notice2_title && info.item.notice2">
                <b>{{info.notice2_title}}</b><br>
                <div v-html="info.item.notice2"></div>
              </slide>
            </carousel>
          </b-card>
        </b-collapse>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
import Vue from 'vue'
import { Carousel, Slide } from 'vue-carousel'
import Dropzone from '../components/Dropzone'
import { mapActions } from 'vuex'

export default {
  name: 'checklist-item',

  props: {
    info: {
      type: Object
    }
  },

  components: {
    Carousel,
    Slide,
    Dropzone
  },

  data () {
    return {
      fileInputPressed: false,
      textInputPressed: false,
      helpMessagedPressed: false,
      form: {
        score: 0,
        file: null,
        answer: null,
        example1Answer: null,
        example2Answer: null
      },
      isDirty: false
    }
  },

  watch: {
    'form.score' (val) {
      if (val !== undefined && this.info.item.score !== val) {
        this.isDirty = true
      }
    },
    'form.answer' (val) {
      if (val !== undefined && this.info.item.answer !== val) {
        this.isDirty = true
      }
    },
    'form.example1Answer' (val) {
      if (val !== undefined && this.info.item.example1_answer !== val) {
        this.isDirty = true
      }
    },
    'form.example2Answer' (val) {
      if (val !== undefined && this.info.item.example2_answer !== val) {
        this.isDirty = true
      }
    }
  },

  methods: {
    pressFileInput () {
      if (!this.fileInputPressed) {
        this.closeAllCards()
        // this.$refs.fileInput.click()
      }

      this.fileInputPressed = !this.fileInputPressed
    },

    pressTextInput () {
      if (!this.textInputPressed) {
        this.closeAllCards()
      }

      this.textInputPressed = !this.textInputPressed
    },

    pressHelpMessages () {
      if (!this.helpMessagedPressed) {
        this.closeAllCards()
      }
      this.helpMessagedPressed = !this.helpMessagedPressed
    },

    closeAllCards () {
      this.fileInputPressed = false
      this.textInputPressed = false
      this.helpMessagedPressed = false
    },

    saveCard () {
      let item = Vue.util.extend({}, this.info.item)

      item.file = this.form.file
      item.answer = this.form.answer
      item.score = this.form.score
      item.example1_answer = this.form.example1Answer
      item.example2_answer = this.form.example2Answer
      item.checklist_user_id = this.$route.params.id

      this.updateChecklistItemAnswer(item)
      this.isDirty = false
    },

    onFileUploadComplete (data) {
      this.form.file = data
      // this.form.file.push(data)
      this.fileInputPressed = false
      this.saveCard()
    },

    onScoreChange (value) {
      setTimeout(() => {
        this.saveCard()
      }, 1000)
    },

    ...mapActions([
      'updateChecklistItemAnswer'
    ])
  },

  computed: {
    showCloseAllCards () {
      return this.fileInputPressed || this.textInputPressed || this.helpMessagedPressed
    },

    showFileInput () {
      return this.info.item.file_yn
    },

    showTextInput () {
      // return this.info.example1_title || this.info.example2_title
      return this.info.item.example1 || this.info.item.example2
    },

    showHelpMessages () {
      return (this.info.notice1_title && this.info.item.notice1) || (this.info.notice2_title && this.info.item.notice2)
    },

    isMultipleAnswer () {
      return this.info.item.item_type === 'multiple'
    },

    isShortAnswer () {
      return this.info.item.item_type === 'short'
    },

    categoryNames () {
      let data = this.info.item.category2_name
      if (this.info.item.category3_name) {
        data.concat(` / ${this.info.item.category3_name}`)
      }
      return data
    }
  },

  created () {
    this.form.score = this.info.item.score
    this.form.answer = this.info.item.answer
    // this.form.file = this.info.item.file || []
    this.form.example1Answer = this.info.item.example1_answer ? this.info.item.example1_answer : this.info.item.example1
    this.form.example2Answer = this.info.item.example2_answer ? this.info.item.example2_answer : this.info.item.example2
  }
}
</script>

<style scoped>
  .overflow-scroll {
    position: relative;
    max-height: 150px;
    overflow-y: scroll;
  }
</style>