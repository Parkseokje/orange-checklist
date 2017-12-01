<template>
  <div class="wrapper">
    <b-form-group
      label="제목"
    >
      <b-form-input
        autofocus
        ref="inputTitle"
        v-model="form.title"
        size="sm"
        class="mb-2"
        type="text"
        placeholder="답글을 입력하세요"
      ></b-form-input>
    </b-form-group>
    <b-form-group
      label="내용"
    >
      <quill-editor ref="inputContent" :options="editorOption" v-model="form.content"></quill-editor>
    </b-form-group>
    <dropzone v-on:complete="onFileUploadComplete" class="mb-2"></dropzone>
    <div class="button-group mb-2">
      <b-btn size="sm" @click="save" variant="primary">저장</b-btn>
      <b-btn size="sm" @click="cancel" variant="danger">취소</b-btn>
    </div>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import { mapGetters, mapActions } from 'vuex'
import Dropzone from '../components/Dropzone'

export default {
  name: 'comment-input',

  props: ['comment'],

  watch: {
    comment (obj) {
      this.form.board_id = obj.board_id
    }
  },

  components: {
    quillEditor,
    Dropzone
  },

  mounted () {
    this.$refs.inputTitle.focus()
    this.form.board_id = this.comment.board_id
    this.form.parent_group_id = this.comment.group_id
    this.form.parent_group_seq = this.comment.group_seq
    this.form.parent_depth = this.comment.depth
  },

  data () {
    return {
      form: {
        title: null,
        content: null,
        file: null,
        board_id: null,
        parent_group_id: null,
        parent_group_seq: null,
        parent_depth: null
      }
    }
  },

  methods: {
    onFileUploadComplete (data) {
      this.form.file = data
      this.save()
    },

    save () {
      if (!this.form.title) {
        alert('제목을 입력해주세요.')
        this.$refs.inputTitle.focus()
        return false
      }

      if (!this.form.content) {
        alert('내용을 입력해주세요.')
        // this.$refs.inputContent.focus()
        return false
      }

      this.createUserPost(this.form)

      // for (const prop in this.form) {
      //   if (this.form.hasOwnProperty(prop)) {
      //     this.form[prop] = null
      //   }
      // }

      this.form.title = null
      this.form.content = null
      this.form.file = null

      this.$emit('save')
    },

    cancel () {
      this.form.title = null
      this.form.content = null
      this.form.file = null

      this.$emit('cancel')
    },

    ...mapActions([
      'createUserPost'
    ])
  },

  computed: {
    ...mapGetters({
      editorOption: 'editorOption'
    })
  }
}
</script>

<style>

</style>