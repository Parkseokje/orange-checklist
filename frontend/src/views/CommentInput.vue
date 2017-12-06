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
    <dropzone v-on:complete="onFileUploadComplete" :maxFilesize="10" :acceptedFiles="null" :isImageUpload="false" class="mb-2"></dropzone>
    <div class="button-group mb-2">
      <b-btn size="sm" @click="save" variant="primary">저장</b-btn>
      <b-btn size="sm" @click="cancel" variant="danger">취소</b-btn>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { quillEditor } from 'vue-quill-editor'
import { mapGetters, mapActions } from 'vuex'
import Dropzone from '../components/Dropzone'

export default {
  name: 'comment-input',

  props: {
    comment: {
      type: Object,
      required: true
    },

    ismodify: {
      type: Boolean,
      default: false
    }
  },

  // 최초 게시글 생성 시 게시판을 선택하므로 터요
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

    this.form = Object.assign({}, this.form, this.comment)

    if (!this.ismodify) {
      this.form.content_id = null
      this.form.title = null
      this.form.content = null
      this.form.file_name = null
      this.form.access_url = null
    }

    // this.form.board_id = this.comment.board_id

    // if (this.ismodify) {
    //   this.form.content_id = this.comment.content_id
    //   this.form.title = this.comment.title
    //   this.form.content = this.comment.content
    // }

    // this.form.parent_group_id = this.comment.group_id
    // this.form.parent_group_seq = this.comment.group_seq
    // this.form.parent_depth = this.comment.depth
  },

  data () {
    return {
      form: {
        title: null,
        content: null,
        file_name: null,
        access_url: null,
        board_id: null,
        content_id: null,
        parent_group_id: null,
        parent_group_seq: null,
        parent_depth: null
      }
    }
  },

  methods: {
    onFileUploadComplete (data) {
      this.form.file_name = data.file_name
      this.form.access_url = data.access_url

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

      if (!this.form.content_id) {
        this.createUserPost(this.form)
      } else {
        this.updateUserPost(this.form)
      }

      this.$emit('save')
    },

    cancel () {
      this.form.title = null
      this.form.content = null
      this.form.file_name = null
      this.form.access_url = null

      this.$emit('cancel')
    },

    ...mapActions([
      'createUserPost',
      'updateUserPost'
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