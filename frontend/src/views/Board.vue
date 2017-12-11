<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="게시판 목록">
        <b-btn class="mb-2"
          size="sm"
          :variant="collapseCreateVariant"
          @click="showCollapse = !showCollapse"
          :class="showCollapse ? 'collapsed' : null"
          aria-controls="collapseCreate"
          :aria-expanded="showCollapse ? 'true' : 'false'"
        >{{ collapseButtonText }}
        </b-btn>
        <!-- 게시판 등록 -->
        <b-card border-variant="light" v-show="showCollapse">
          <b-collapse id="collapseCreate" class="mt-2" v-model="showCollapse">
            <b-form-group label="게시판명 (필수)">
              <b-form-input ref="boardTitle" placeholder="텍스트를 입력하세요" v-model="form.title"></b-form-input>
            </b-form-group>
            <b-form-group label="공지사항">
              <quill-editor :options="editorOption" v-model="form.memo"></quill-editor>
            </b-form-group>
            <div class="user-acess" v-if="form.board_type !== 'notice'">
              <b-row>
                <b-col>
                  <b-form-group label="추가할 사용자 (필수)">
                    <b-form-select id="userTypeInput" :options="userRoles"
                      v-model="userRoleSelected"
                      required placeholder="구분을 선택하세요"></b-form-select>
                    <!-- <v-select v-model="userRoleSelected" :options="userRoles" label="text"
                      :reset-on-options-change="true"
                    ></v-select> -->
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row>
                <!-- 사용자 목록 -->
                <b-col lg="6">
                  <b-table
                    :empty-text="messages.emptyText"
                    show-empty responsive
                    :items="filteredUsers"
                    :fields="fiteredUserfields"
                  >
                    <template slot="user_role" scope="row">
                      {{ userTypeByValue(row.item.user_role)[0].text  }}
                    </template>
                    <template slot="actions" scope="row">
                      <b-btn variant="outline-info" size="sm" @click.stop="add(row.item,row.index,$event.target)">추가</b-btn>
                    </template>
                  </b-table>
                </b-col>
                <!-- 게시판 사용자 목록 -->
                <b-col lg="6">
                  <!-- <b-form-group label="게시판 사용자"> -->
                    <b-table
                      :empty-text="messages.emptyText"
                      show-empty responsive
                      :items="form.users"
                      :fields="fiteredUserAddedfields"
                    >
                      <template slot="HEAD_write_access" scope="foo">
                        <!-- We use click.stop here to prevent 'sort-changed' or 'head-clicked' events -->
                        <input type="checkbox" v-model="tableHeaderSelected" @click.stop>
                        쓰기
                      </template>
                      <template slot="user_role" scope="row">
                        {{ userTypeByValue(row.item.user_role)[0].text  }}
                      </template>
                      <template slot="write_access" scope="row">
                        <b-form-checkbox value="1" v-model="row.item.write_access"></b-form-checkbox>
                      </template>
                      <template slot="actions" scope="row">
                        <b-btn variant="outline-danger" size="sm" @click.stop="onUserRemove(row.item,row.index,$event.target)">삭제</b-btn>
                      </template>
                    </b-table>
                  <!-- </b-form-group> -->
                </b-col>
              </b-row>
            </div> <!-- user-access -->
          </b-collapse>
          <b-btn class="mb-3" variant="primary" @click="onSubmit">저장</b-btn>
        </b-card>
        <br><br>

        <!-- 테이블 toolbox -->
        <div class="row">
          <div class="col-md-3">
            <b-form-group horizontal label="페이지당 줄수" :label-cols="6">
              <b-form-select :options="pageOptions" v-model="perPage" />
            </b-form-group>
          </div>
          <div class="col-md-3">
            <b-form-group horizontal label="필터" :label-cols="3">
              <b-form-input v-model="filter" placeholder="검색어 입력" />
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
          :items="allBoards"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @filtered="onFiltered"
        >
          <template slot="created_dt" scope="row">
            {{ row.item.created_dt | moment('YYYY-MM-DD HH:mm')  }}
          </template>
          <template slot="actions" scope="row">
            <!-- <b-btn variant="outline-info" size="sm" @click.stop="details(row.item,row.index,$event.target)">보기</b-btn> -->
            <b-btn variant="outline-secondary" size="sm" @click.stop="modify(row.item,row.index,$event.target)">수정</b-btn>
            <b-btn variant="outline-danger" size="sm" @click.stop="remove(row.item,row.index,$event.target)">삭제</b-btn>
          </template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import { quillEditor } from 'vue-quill-editor'

const fields = {
  title: { label: '게시판명', sortable: true, 'class': 'text-center' },
  content_cnt: { label: '게시글수', sortable: true, 'class': 'text-center' },
  created_dt: { label: '생성일시', sortable: true, 'class': 'text-center' },
  actions: { label: '행동' }
}

const fiteredUserfields = {
  user_role: { label: '역할', sortable: true, 'class': 'text-center' },
  user_name: { label: '이름', sortable: true, 'class': 'text-center' },
  actions: { label: '행동' }
}

const fiteredUserAddedfields = {
  user_role: { label: '역할', sortable: true, 'class': 'text-center' },
  user_name: { label: '이름', sortable: true, 'class': 'text-center' },
  write_access: { label: '쓰기', sortable: true, 'class': 'text-center' },
  actions: { label: '행동' }
}

export default {
  name: 'board',

  created () {
    if (this.allUsers.length === 0) {
      this.fetchUserList()
    }

    if (this.allBoards.length === 0) {
      this.fetchBoardList()
    }
  },

  components: {
    quillEditor
  },

  data () {
    return {
      showCollapse: false,
      tableHeaderSelected: false,
      fields: fields,
      fiteredUserfields: fiteredUserfields,
      fiteredUserAddedfields: fiteredUserAddedfields,
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
      userRoleSelected: null,
      userSelected: null,
      form: {
        id: null,
        title: null,
        memo: null,
        users: []
      }
    }
  },

  watch: {
    tableHeaderSelected (val) {
      this.form.users.map(user => {
        user.write_access = val
      })
    },

    showCollapse (val) {
      if (!val) {
        this.form.id = null
        this.form.title = null
        this.form.memo = null
        this.form.users = []
      }
    }
  },

  methods: {
    add (item, index, button) {
      this.form.users.push(item)
    },

    modify (item, index, button) {
      if (!item.users || item.users.length === 0) {
        this.fetchBoardUsers(item.id)
      }

      this.form = Object.assign({}, this.form, item)
      // this.form.id = item.id
      // this.form.title = item.title
      // this.form.memo = item.memo

      if (!item.users || item.users.length === 0) {
        setTimeout(() => {
          this.form.users = this.filterBoardById(item.id)[0].users
          this.showCollapse = true
        }, 300)
      } else {
        this.form.users = this.filterBoardById(item.id)[0].users
        this.showCollapse = true
      }
    },

    remove (item, index, button) {
      if (!confirm('게시판을 삭제하시겠습니까?')) return false

      this.deleteBoard(item.id)
    },

    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    onUserRemove (item, index) {
      if (!item.board_user_id) {
        this.form.users.splice(index, 1)
      } else {
        item.active = 0
      }
    },

    onSubmit () {
      // validation
      if (!this.form.title) {
        alert('게시판명을 입력하세요')
        this.$refs.boardTitle.focus()
        return false
      }

      if (this.form.users.length === 0) {
        alert('사용자를 추가하세요')
        return false
      }

      // 자료를 저장한다.
      if (!this.form.id) {
        this.createBoard(Vue.util.extend({}, this.form))
      } else {
        this.updateBoard(Vue.util.extend({}, this.form))
      }

      this.form.id = null
      this.form.title = null
      this.form.memo = null
      this.form.users = []
      this.showCollapse = false
    },

    ...mapActions([
      'fetchUserList',
      'fiterUserByRole',
      'fetchBoardList',
      'fetchBoardUsers',
      'createBoard',
      'updateBoard',
      'deleteBoard'
    ])
  },

  computed: {
    collapseCreateVariant () {
      return this.showCollapse ? 'danger' : 'primary'
    },

    collapseButtonText () {
      const caption = this.form.id ? '수정' : '생성'
      const captionOkCancel = this.showCollapse ? '취소' : ''

      return `게시판 ${caption}` + ` ${captionOkCancel}`
    },

    // items () {
    //   return []
    // },

    filteredUsers () {
      if (this.userRoleSelected !== null) {
        const fitered = this.filterUserByRole(this.userRoleSelected)
        let result = []

        fitered.map(user => {
          if (this.form.users.findIndex(x => x.user_id === user.id) < 0) {
            result.push({
              user_role: user.role,
              user_id: user.id,
              user_name: user.name,
              write_access: user.write_access
            })
          }
        })

        return result
      } else {
        return []
      }
    },

    ...mapGetters({
      allUsers: 'getAllUsers',
      allBoards: 'getAllBoards',
      messages: 'messages',
      userRoles: 'userTypes',
      filterUserByRole: 'filterUserByRole',
      filterBoardById: 'filterBoardById',
      editorOption: 'editorOption',
      userTypeByValue: 'userTypeByValue'
    })
  }
}
</script>