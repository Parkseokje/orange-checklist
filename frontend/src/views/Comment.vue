<template>
  <li v-if="comment" v-bind:class="{ 'comment': !ispost, 'comment-children': ispost }">
    <template v-if="ispost">
      <div v-if="!comment.active">
        <div class="by">삭제된 글입니다.</div>
      </div>
      <div v-else>
        <h1>{{ comment.title }}</h1>
        <div v-html="comment.content"></div>
      </div>
    </template>
    <template v-else>
      <div v-if="!comment.active">
        <div class="by">삭제된 글입니다.</div>
      </div>
      <div v-else>
        <div class="title"><b-badge v-if="diffDays === 0" pill variant="success" class="mr-1">New</b-badge>{{comment.title}}</div>
        <div class="text" v-html="comment.content"></div>
      </div>
    </template>
    <b-btn variant="link" size="sm" class="mb-2" @click="downloadAttachment" v-if="comment.file_name">
      <i class="fa fa-download"></i>  <span v-b-tooltip.hover :title="comment.file_name">{{comment.file_name | truncate('10')}}</span>
    </b-btn>
    <div class="by">
      {{comment.creator}} ·
      {{comment.created_dt | timeAgo}}전
      <b-link class="pl-1" v-if="canReply" @click.prevent="triggerShowInput">{{showInput ? '취소' : '답글달기'}}</b-link>
      <b-link class="pl-1" v-if="canModify" @click.prevent="updateComment">수정</b-link>
      <b-link class="pl-1" v-if="canModify" @click.prevent="deleteComment">삭제</b-link>
    </div>
    <div v-if="showInput">
      <comment-input @cancel="triggerShowInput" @save="onCommentInputSave" :comment="comment" :ismodify="isModify"></comment-input>
    </div>
    <div class="toggle" :class="{ open }" v-if="kids && kids.length && !ispost">
      <a @click="open = !open">{{
        open
            ? '[-]'
            : '[+] ' + pluralize(kids.length) + ' 점힘'
      }}</a>
    </div>
    <ul class="comment-children" v-show="open" v-if="!ispost">
      <comment v-for="kid in kids" :key="kid.content_id" :comment="kid"></comment>
    </ul>
  </li>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import CommentInput from './CommentInput'
import download from 'downloadjs'
import moment from 'moment'

export default {
  name: 'comment',

  components: {
    CommentInput
  },

  props: {
    comment: {
      type: Object,
      required: true
    },

    ispost: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      open: true,
      showInput: false,
      inputTitle: null,
      inputContent: null,
      isModify: false
    }
  },

  methods: {
    pluralize: n => n + ' 개의 답변',

    triggerShowInput () {
      if (this.showInput) {
        this.isModify = false
      }

      this.showInput = !this.showInput
    },

    updateComment () {
      this.isModify = true
      this.triggerShowInput()
    },

    onCommentInputSave () {
      this.triggerShowInput()
    },

    downloadAttachment () {
      const files = [
        { file_name: this.comment.file_name, access_url: this.comment.access_url }
      ]

      Vue.axios({
        method: 'post',
        url: '/api/board/zip-urls',
        data: files,
        responseType: 'blob'
      })
        .then(response => {
          if (files.length === 1) {
            download(response.data, this.comment.file_name)
          } else {
            download(response.data, 'download.zip')
          }
        })
        .catch(err => console.log(err))
    },

    deleteComment () {
      if (!confirm('삭제하시겠습니까?')) return false

      this.deleteUserPost(this.comment)

      // 메인 게시글을 삭제할 경우 목록으로 이동한다.
      if (this.ispost) {
        Vue.router.push('/user-board')
      }
    },

    ...mapActions([
      'deleteUserPost'
    ])
  },

  computed: {
    kids () {
      if (this.comment) {
        return this.getAllUserSubPosts(this.comment)
      } else {
        return []
      }
    },

    // 수정 권한
    canModify () {
      return this.comment.active && this.comment.write_access && this.comment.is_owner && !this.showInput
    },

    // 답글달기 권한
    canReply () {
      return this.comment.active && this.comment.write_access
    },

    // 생성일과 오늘날짜와의 차이일을 구한다.
    diffDays () {
      const today = moment(new Date())

      return moment(this.comment.created_dt).diff(today, 'days')
    },

    ...mapGetters({
      getAllUserSubPosts: 'getAllUserSubPosts'
    })
  }
}
</script>

<style>
.comment-children .comment-children {
	margin-left: 1.5em;
}

.comment {
	border-top: 1px solid #eee;
	position: relative;
}

.comment .by,
.comment .text,
.comment .toggle {
	font-size: 0.9em;
	margin: 1em 0;
}

.comment .title {
  font-size: 0.9em;
	margin: 1em 0;
  font-weight: bold;
}

.comment .by {
	color: #828282;
}

.comment .by a {
	color: #828282;
	text-decoration: underline;
}

.comment .text {
	overflow-wrap: break-word;
}

.comment .text a:hover {
	color: #f60;
}

.comment .text pre {
	white-space: pre-wrap;
}

.comment .toggle {
	background-color: #fffbf2;
	padding: 0.3em 0.5em;
	border-radius: 4px;
}

.comment .toggle a {
	color: #828282;
	cursor: pointer;
}

.comment .toggle.open {
	padding: 0;
	background-color: transparent;
	margin-bottom: -0.5em;
}
</style>