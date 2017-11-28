<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="게시판 목록">
        <b-btn class="mb-2"
          v-b-toggle.collapseCreate
          :variant="collapseCreateVariant"
          :pressed.sync="collapseCreatePressed"
        >{{ collapseCreatePressed ? '게시판 등록 취소' : '게시판 등록' }}
        </b-btn>
        <!-- 게시판 등록 -->
        <b-card border-variant="light" v-show="collapseCreatePressed">
          <b-collapse id="collapseCreate" class="mt-2">
            <b-form-group label="게시판명">
              <b-form-input ref="boardTitle" placeholder="텍스트를 입력하세요" v-model="form.boardTitle"></b-form-input>
            </b-form-group>
            <b-row>
              <b-col>
                <b-form-group label="사용자 구분">
                  <v-select v-model="userRoleSelected" :options="userRoles" label="text"
                    :reset-on-options-change="true"
                  ></v-select>
                </b-form-group>
              </b-col>
              <!-- <b-col>
                <b-form-group label="사용자">
                  <v-select v-model="userSelected" :options="filteredUsers" label="name"
                    :reset-on-options-change="true"
                  ></v-select>
                </b-form-group>
              </b-col> -->
            </b-row>
            <b-row>
              <b-col lg="6">
                <b-table
                  :empty-text="messages.emptyText"
                  :items="filteredUsers"
                  :fields="fiteredUserfields"
                >
                  <template slot="actions" scope="row">
                    <b-btn variant="outline-info" size="sm" @click.stop="add(row.item,row.index,$event.target)">추가</b-btn>
                  </template>
                </b-table>
              </b-col>
              <b-col lg="6">
                <b-table
                  :empty-text="messages.emptyText"
                  :items="filteredUsers"
                  :fields="fiteredUserfields"
                >
                  <template slot="actions" scope="row">
                    <b-btn variant="outline-info" size="sm" @click.stop="add(row.item,row.index,$event.target)">추가</b-btn>
                  </template>
                </b-table>
              </b-col>
            </b-row>
          </b-collapse>
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
          :items="items"
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :filter="filter"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
          @filtered="onFiltered"
        >
          <template slot="actions" scope="row">
            <b-btn variant="outline-info" size="sm" @click.stop="details(row.item,row.index,$event.target)">결과보기</b-btn>
            <b-btn variant="outline-secondary" size="sm" v-if="isAdmin"@click.stop="modify(row.item,row.index,$event.target)">수정</b-btn>
            <b-btn variant="outline-danger" size="sm" v-if="isAdmin" @click.stop="remove(row.item,row.index,$event.target)">삭제</b-btn>
          </template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
const fields = {
  title: { label: '게시판명', sortable: true, 'class': 'text-center' },
  created_dt: { label: '생성일시', sortable: true, 'class': 'text-center' },
  actions: { label: '행동' }
}

const fiteredUserfields = {
  role: { label: '역할', sortable: true, 'class': 'text-center' },
  name: { label: '이름', sortable: true, 'class': 'text-center' },
  actions: { label: '행동' }
}

export default {
  name: 'board',

  created () {
    if (this.allUsers.length === 0) {
      this.fetchUserList()
    }
  },

  data () {
    return {
      collapseCreatePressed: false,
      fields: fields,
      fiteredUserfields: fiteredUserfields,
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
        boardTitle: null
      }
    }
  },

  methods: {
    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    ...mapActions([
      'fetchUserList',
      'fiterUserByRole'
    ])
  },

  computed: {
    collapseCreateVariant () {
      return this.collapseCreatePressed ? 'danger' : 'primary'
    },

    items () {
      return []
    },

    filteredUsers () {
      if (this.userRoleSelected !== null) {
        return this.filterUserByRole(this.userRoleSelected.value)
      } else {
        return []
      }
    },

    ...mapGetters({
      allUsers: 'getAllUsers',
      messages: 'messages',
      userRoles: 'userTypes',
      filterUserByRole: 'filterUserByRole'
    })
  }
}
</script>