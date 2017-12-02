<template>
  <li v-if="comment" class="comment">
    <div class="title">{{comment.title}}</div>
    <div class="text" v-html="comment.content"></div>
    <div class="by">
      {{comment.creator}} ·
      {{comment.created_dt | moment('YYYY-MM-DD HH:mm')  }} ·
      {{comment.created_dt | timeAgo }}전 ·
      <b-link @click.prevent="triggerShowInput">{{showInput ? '취소' : '답글달기'}}</b-link>
    </div>
    <div v-if="showInput">
      <comment-input @cancel="triggerShowInput" @save="onCommentInputSave" :comment="comment"></comment-input>
    </div>
    <div class="toggle" :class="{ open }" v-if="kids && kids.length">
      <a @click="open = !open">{{
        open
            ? '[-]'
            : '[+] ' + pluralize(kids.length) + ' 점힘'
      }}</a>
    </div>
    <ul class="comment-children" v-show="open">
      <comment v-for="kid in kids" :key="kid.content_id" :comment="kid"></comment>
    </ul>
  </li>
</template>
<script>
import { mapGetters } from 'vuex'
import CommentInput from './CommentInput'

export default {
  name: 'comment',

  components: {
    CommentInput
  },

  props: ['comment'],

  data () {
    return {
      open: false,
      showInput: false,
      inputTitle: null,
      inputContent: null
    }
  },

  methods: {
    pluralize: n => n + ' 개의 답변',

    triggerShowInput () {
      this.showInput = !this.showInput
    },

    onCommentInputSave () {
      this.triggerShowInput()
    }
  },

  computed: {
    kids () {
      if (this.comment) {
        return this.getAllUserSubPosts(this.comment)
      } else {
        return []
      }
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