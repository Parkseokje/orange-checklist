<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="나의 게시판 목록">
        <b-btn class="mb-2"
          size="sm"
          :variant="collapseCreateVariant"
          @click="showCollapse = !showCollapse"
          :class="showCollapse ? 'collapsed' : null"
          aria-controls="collapseCreate"
          :aria-expanded="showCollapse ? 'true' : 'false'"
        >{{ collapseButtonText }}
        </b-btn>
        <!-- 게시글 등록 -->
        <b-card border-variant="light" v-show="showCollapse">
          <b-collapse id="collapseCreate" class="mt-2" v-model="showCollapse">
            <v-select label="title" placeholder="선택하세요"
              v-model="selectedBoard"
              :options="userBoards"
              :reset-on-options-change="true"
            ></v-select>
            <comment-input
              @cancel="showCollapse = !showCollapse"
              @save="onCommentInputSave"
              :comment="newPost"></comment-input>
            <!-- <comment-input></comment-input> -->
          </b-collapse>
        </b-card>
        <!-- 테이블 toolbox -->
        <div class="row">
          <div class="col-md-3">
            <b-form-group horizontal label="페이지당 줄수" :label-cols="6">
              <b-form-select :options="pageOptions" v-model="perPage" />
            </b-form-group>
          </div>
          <div class="col-md-3">
            <b-form-group horizontal label="필터" :label-cols="3">
              <b-form-group horizontal label="필터" :label-cols="3">
                <b-input-group>
                  <b-form-input v-model="filter" placeholder="검색어 입력" />
                  <b-input-group-button slot="right" v-if="filter">
                    <b-btn @click="filter = null" variant="secondary"><i class="fa fa-remove"></i></b-btn>
                  </b-input-group-button>
                </b-input-group>
              </b-form-group>
            </b-form-group>
          </div>
          <div class="col-md-2">
            <b-button :disabled="!sortBy" @click="sortBy = null">기본정렬</b-button>
          </div>
          <div class="col-md-4">
            <b-pagination align="right" :total-rows="totalRows" :per-page="perPage" v-model="currentPage" />
          </div>
        </div>
        <!-- 테이블 -->
        <b-table striped hover show-empty responsive
          :empty-text="messages.emptyText"
          :items="rootPosts"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @filtered="onFiltered"
        >
          <template slot="board_title" scope="row">
            <b-link @click.prevent="filter = row.item.board_title"
              v-b-tooltip.hover title="이 게시판 결과만 보시려면 클릭하세요."
            >{{ row.item.board_title }}</b-link>
          </template>
          <template slot="created_dt" scope="row">
            {{ row.item.created_dt | moment('YYYY-MM-DD')  }}
          </template>
          <template slot="files" scope="row">
            <b-btn variant="outline-info" size="sm" @click.stop="download(row.item,row.index,$event.target)">받기</b-btn>
          </template>
          <template slot="actions" scope="row">
            <b-btn variant="outline-info" size="sm" @click.stop="details(row.item,row.index,$event.target)">보기</b-btn>
          </template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import CommentInput from './CommentInput'

const fields = {
  board_title: { label: '게시판명', sortable: true, 'class': 'text-center' },
  creator: { label: '작성자', sortable: true, 'class': 'text-center' },
  created_dt: { label: '생성일자', sortable: true, 'class': 'text-center' },
  title: { label: '제목', sortable: true, 'class': 'text-center' },
  reply_cnt: { label: '답글수', sortable: true, 'class': 'text-center' },
  // files: { label: '첨부파일' },
  actions: { label: '행동' }
}

export default {
  name: 'user-board',

  components: {
    CommentInput
  },

  created () {
    if (this.userBoards.length === 0) {
      this.fetchUserBoardList()
    }

    if (this.allUserPosts.length === 0) {
      this.fetchUserPosts()
    }
  },

  data () {
    return {
      showCollapse: false,
      fields: fields,
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      pageOptions: [
        { text: 5, value: 5 },
        { text: 10, value: 10 },
        { text: 15, value: 15 }
      ],
      sortBy: null,
      sortDesc: false,
      filter: null,
      selectedBoard: null,
      form: {
        id: null,
        title: null,
        content: null,
        file: null
      }
    }
  },

  watch: {
    // selectedBoard (board) {
    //   this.filter = board.title
    // }
  },

  methods: {
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    onCommentInputSave () {
      this.showCollapse = !this.showCollapse
    },

    details (item, index, button) {
      Vue.router.push({name: '게시글 보기', params: { board_id: item.board_id, content_id: item.content_id }})
    },

    ...mapActions([
      'fetchUserBoardList',
      'fetchUserPosts'
    ])
  },

  computed: {
    newPost () {
      if (!this.selectedBoard) {
        return { board_id: null, isNew: true }
      } else {
        return { board_id: this.selectedBoard.board_id, isNew: true }
      }
    },

    collapseCreateVariant () {
      return this.showCollapse ? 'danger' : 'primary'
    },

    collapseButtonText () {
      const caption = this.form.id ? '수정' : '생성'
      const captionOkCancel = this.showCollapse ? '취소' : ''

      return `게시글 ${caption}` + ` ${captionOkCancel}`
    },

    boardOptions () {
      return [
        { value: null, text: '게시판을 선택하세요.' }
      ]
    },

    rootPosts () {
      return this.allUserRootPosts
    },

    ...mapGetters({
      messages: 'messages',
      allUserPosts: 'getAllUserPosts',
      allUserRootPosts: 'getAllUserRootPosts',
      filterUserGroupPosts: 'getAllUserGroupPosts',
      userBoards: 'getAllUserBoards'
    })
  }
}
</script>