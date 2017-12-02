<template>
  <div class="animated fadeIn">
    <div class="item-view" v-if="post">
      <template v-if="post">
        <div class="item-view-header comment">
          <h1>{{ post.title }}</h1>
          <div v-html="post.content"></div>
          <div class="by">
            {{post.creator}} ·
            {{post.created_dt | timeAgo }}전 ·
            <b-link @click.prevent="triggerShowInput">{{showInput ? '취소' : '답글달기'}}</b-link>
          </div>
          <div v-if="showInput">
            <comment-input @cancel="triggerShowInput" @save="onCommentInputSave" :comment="post"></comment-input>
          </div>
        </div>
        <div class="item-view-comments">
          <p class="item-view-comments-header">
            {{ comments ? comments.length + ' 개의 답글' : '아직 답글이 없습니다.' }}
          </p>
          <ul class="comment-children">
            <comment v-for="comment in comments" :key="comment.content_id" :comment="comment"></comment>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
// import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import Comment from './Comment'
import CommentInput from './CommentInput'

export default {
  name: 'user-board-details',

  components: {
    Comment,
    CommentInput
  },

  created () {
    if (this.allUserPosts.length === 0) {
      this.fetchUserPosts()
    }
  },

  // props: ['post'],

  data () {
    return {
      showInput: false
    }
  },

  methods: {
    triggerShowInput () {
      this.showInput = !this.showInput
    },

    onCommentInputSave () {
      this.triggerShowInput()
    },

    ...mapActions([
      'fetchUserPosts'
    ])
  },

  computed: {
    post () {
      const result = this.filterUserPost(parseInt(this.$route.params.content_id))[0]
      return result
    },

    comments () {
      if (this.post) {
        return this.getAllUserSubPosts(this.post)
      } else {
        return []
      }
    },

    ...mapGetters({
      allUserPosts: 'getAllUserPosts',
      getAllUserSubPosts: 'getAllUserSubPosts',
      filterUserPost: 'filterUserPost'
    })
  }
}
</script>

<style>
.item-view-header {
	background-color: #fff;
	padding: 1.8em 2em 1em;
	box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.item-view-header h1 {
	display: inline;
	font-size: 1.5em;
	margin: 0;
	margin-right: 0.5em;
}

.item-view-header .host,
.item-view-header .meta,
.item-view-header .meta a {
	color: #828282;
}

.item-view-header .meta a {
	text-decoration: underline;
}

.item-view-comments {
	background-color: #fff;
	margin-top: 10px;
	padding: 0 2em 0.5em;
}

.item-view-comments-header {
	margin: 0;
	font-size: 1.1em;
	padding: 1em 0;
	position: relative;
}

.item-view-comments-header .spinner {
	display: inline-block;
	margin: -15px 0;
}

.comment-children {
	list-style-type: none;
	padding: 0;
	margin: 0;
}

@media (max-width: 600px) {
	.item-view-header h1 {
		font-size: 1.25em;
	}
}
</style>