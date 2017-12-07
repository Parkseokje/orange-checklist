<template>
  <div class="animated fadeIn">
    <div class="item-view">
      <div class="item-view-header">
        <h4>{{post.board_title}}</h4>
        <p v-html="post.board_memo"></p>
        <b-btn variant="primary" size="sm" :to="'/user-board'" class="mt-2 mb-2">목록보기</b-btn>
      </div>
    </div>
    <div class="item-view" v-if="post">
      <template v-if="post">
        <div class="item-view-header comment">
          <comment :key="post.content_id" :comment="post" :ispost="true"></comment>
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
import { mapGetters, mapActions } from 'vuex'
import Comment from './Comment'

export default {
  name: 'user-board-details',

  components: {
    Comment
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
    ...mapActions([
      'fetchUserPosts'
    ])
  },

  computed: {
    post () {
      if (this.allUserPosts.length !== 0) {
        return this.filterUserPost(parseInt(this.$route.params.content_id))[0]
      } else {
        return {}
      }
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