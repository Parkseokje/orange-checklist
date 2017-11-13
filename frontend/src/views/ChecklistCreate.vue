<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="체크리스트 정보">
        <b-btn class="mb-3" variant="primary" @click="onSubmit">체크리스트 생성하기</b-btn>
        <b-row>
          <b-col lg="3">
            <b-form-group label="타입">
              <b-form-select v-model="form.list_type" :options="checkListTypes" @change="onChecklistTypeChange"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col>
            <b-form-group label="제목 (필수)">
              <b-form-input ref="checklistTitle" placeholder="텍스트를 입력하세요" v-model="form.title"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="배점 (필수, 객관식에만 해당)">
          <input-tag ref="checklistScoring" placeholder="추가" :tags="form.scoring"></input-tag>
          <b-btn variant="link" size="sm" @click="reversSampleAnswers">순서변경</b-btn>
        </b-form-group>
        <b-form-group label="기재사항 (선택, 객관식에만 해당)">
          <b-row>
            <b-col lg="3" class="mb-1">
              <b-input-group>
                <b-input-group-addon>
                  <input type="checkbox" v-model="inputOptions.input1Active">
                </b-input-group-addon>
                <b-form-input type="text" ref="input1Title"  v-model="inputOptions.input1Title" placeholder="제목입력" />
              </b-input-group>
            </b-col>
            <b-col lg="3" class="mb-1">
              <b-input-group>
                <b-input-group-addon>
                  <input type="checkbox" v-model="inputOptions.input2Active">
                </b-input-group-addon>
                <b-form-input type="text" ref="input2Title" v-model="inputOptions.input2Title" placeholder="제목입력" />
              </b-input-group>
            </b-col>
          </b-row>
        </b-form-group>
        <b-form-group label="안내사항 (선택, 객관식에만 해당)">
          <b-row>
            <b-col lg="3" class="mb-1">
              <b-input-group>
                <b-input-group-addon>
                  <input type="checkbox" v-model="inputOptions.output1Active">
                </b-input-group-addon>
                <b-form-input type="text" ref="output1Title" v-model="inputOptions.output1Title" placeholder="제목입력" />
              </b-input-group>
            </b-col>
            <b-col lg="3" class="mb-1">
              <b-input-group>
                <b-input-group-addon>
                  <input type="checkbox" v-model="inputOptions.output2Active">
                </b-input-group-addon>
                <b-form-input type="text" ref="output2Title" v-model="inputOptions.output2Title" placeholder="제목입력" />
              </b-input-group>
            </b-col>
          </b-row>
        </b-form-group>
        <b-form-group label="비고 (선택)">
          <quill-editor :options="editorOption" v-model="form.memo"></quill-editor>
        </b-form-group>

        <!-- 항목 영역 -->
        <b-row>
          <b-col lg="6">
            <b-card header="평가항목 추가">
              <b-form-group horizontal label="유형">
                <b-form-radio-group v-model="inputOptions.itemType">
                  <b-form-radio value="multiple">객관식</b-form-radio>
                  <b-form-radio value="short">주관식</b-form-radio>
                </b-form-radio-group>
              </b-form-group>
              <div v-show="showCategoryChoice">
                <b-form-group label="대분류 (선택)" horizontal>
                  <v-select label="name" placeholder="선택하세요"
                    v-model="dropdown1Selected"
                    :options="dropDown1Items"
                    :reset-on-options-change="true"
                  ></v-select>
                </b-form-group>
                <b-form-group label="중분류 (선택)" horizontal>
                  <v-select label="name" placeholder="선택하세요"
                    v-model="dropdown2Selected"
                    :options="dropDown2Items"
                    :reset-on-options-change="true"
                  ></v-select>
                </b-form-group>
                <b-form-group label="소분류 (선택)" horizontal>
                  <v-select label="name" placeholder="선택하세요"
                    v-model="dropdown3Selected"
                    :options="dropDown3Items"
                    :reset-on-options-change="true"
                  ></v-select>
                </b-form-group>
              </div>
              <b-form-group label="평가사항 (필수)">
                <b-form-input placeholder="텍스트를 입력하세요" v-model="inputOptions.itemTitle" ref="inputItemTitle"></b-form-input>
              </b-form-group>

              <div role="tablist">
                <!-- 기재사항 -->
                <b-card class="mb-1" border-variant="primary" sub-title="기재사항" v-show="showItem1Input || showItem2Input">
                  <b-btn size="sm" :variant="accordion1Variant" v-b-toggle.accordion1 :pressed.sync="accordion1Pressed">{{ accordion1Pressed ? '닫기' : '열기' }}</b-btn>
                  <b-collapse id="accordion1" accordion="my-accordion" role="tabpanel">
                    <b-card-body class="px-0">
                      <b-form-group :label="inputOptions.input1Title" v-show="showItem1Input">
                        <quill-editor :options="editorOption2" v-model="inputOptions.itemInput1Content"></quill-editor>
                      </b-form-group>
                      <b-form-group :label="inputOptions.input2Title" v-show="showItem2Input">
                        <quill-editor :options="editorOption2" v-model="inputOptions.itemInput2Content"></quill-editor>
                      </b-form-group>
                    </b-card-body>
                  </b-collapse>
                </b-card>
                <!-- 안내사항 -->
                <b-card class="mb-3" border-variant="warning" sub-title="안내사항" v-show="showItem1Output || showItem2Output">
                  <b-btn size="sm" :variant="accordion2Variant" v-b-toggle.accordion2 :pressed.sync="accordion2Pressed">{{ accordion2Pressed ? '닫기' : '열기' }}</b-btn>
                  <b-collapse id="accordion2" accordion="my-accordion" role="tabpanel">
                    <b-card-body class="px-0">
                      <b-form-group :label="inputOptions.output1Title" v-show="showItem1Output">
                        <quill-editor :options="editorOption" v-model="inputOptions.itemOutput1Content"></quill-editor>
                      </b-form-group>
                      <b-form-group :label="inputOptions.output2Title" v-show="showItem2Output">
                        <quill-editor :options="editorOption" v-model="inputOptions.itemOutput2Content"></quill-editor>
                      </b-form-group>
                    </b-card-body>
                  </b-collapse>
                </b-card>
              </div>

              <div class="d-flex justify-content-between">
                <b-form-checkbox
                  v-model="inputOptions.itemFileAttach"
                  value="1"
                  unchecked-value="0">
                  파일 첨부 가능
                </b-form-checkbox>
                <b-btn variant="primary" @click="addNewItem">추가</b-btn>
              </div>
            </b-card>
          </b-col>
          <b-col>
            <b-card header="평가항목 목록">
              <draggable v-model="form.items" :options="draggableOptions">
                <transition-group name="no" class="list-group">
                  <li class="list-group-item d-flex justify-content-between align-items-center" role="tab" v-for="(item, index) in form.items" :key="index">
                    <span><i class="icon-cursor-move"></i>   {{item.title}}</span>
                    <div>
                      <b-btn size="sm" variant="outline-secondary" @click="onItemModify(item)">수정</b-btn>
                      <b-btn size="sm" variant="outline-danger" @click="onItemRemove(item)">삭제</b-btn>
                    </div>
                  </li>
                </transition-group>
              </draggable>
            </b-card>
          </b-col>
        </b-row>

        <b-row>
          <b-col lg="6">
            <b-card header="평가 배정">
              <b-form-group label="담당자 (필수)" horizontal>
                <v-select v-model="inputOptions.userSelected" :options="inputOptions.userList" label="name"></v-select>
              </b-form-group>
              <b-form-group label="점포 (필수)" horizontal>
                <v-select v-model="inputOptions.userShopSelected" :options="allShops" label="name"></v-select>
              </b-form-group>
              <b-form-group label="시작일자" horizontal>
                <datepicker
                  :bootstrapStyling="datePickerOptions.bootstrapStyling"
                  :calendar-button="datePickerOptions.calendarButton"
                  :language="datePickerOptions.language"
                  :format="datePickerOptions.format"
                  v-model="inputOptions.userFromDate">
                </datepicker>
              </b-form-group>
              <b-form-group label="종료일자" horizontal>
                <datepicker
                  :bootstrapStyling="datePickerOptions.bootstrapStyling"
                  :calendar-button="datePickerOptions.calendarButton"
                  :language="datePickerOptions.language"
                  :format="datePickerOptions.format"
                  v-model="inputOptions.userToDate">
                </datepicker>
              </b-form-group>
              <b-form-group label="전달사항 (선택)">
                <quill-editor :options="editorOption" v-model="inputOptions.userMemo"></quill-editor>
              </b-form-group>
              <b-btn variant="primary" @click="addNewUser">추가</b-btn>
            </b-card>
          </b-col>
          <b-col>
            <b-card header="평가배정 목록">
              <b-table striped hover responsive show-empty
                :empty-text="messages.emptyText"
                :items="form.users"
                :fields="fields"
              >
                <template slot="actions" scope="row">
                  <b-btn variant="outline-secondary" size="sm" @click.stop="onUserModify(row.item,row.index,$event.target)">수정</b-btn>
                  <b-btn variant="outline-danger" size="sm" @click.stop="onUserRemove(row.item,row.index,$event.target)">삭제</b-btn>
                </template>
              </b-table>
            </b-card>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { quillEditor } from 'vue-quill-editor'
import draggable from 'vuedraggable'
import Datepicker from 'vuejs-datepicker'
import moment from 'moment'

const fields = {
  shop_name: { label: '점포', sortable: true, 'class': 'text-center' },
  user_name: { label: '담당자', sortable: true, 'class': 'text-center' },
  from_date: { label: '시작일', sortable: true, 'class': 'text-center' },
  to_date: { label: '종료일', sortable: true, 'class': 'text-center' },
  actions: { label: '행동' }
}

export default {
  name: 'checklist-detail',

  components: {
    quillEditor,
    draggable,
    Datepicker
  },

  data () {
    return {
      dropdown1Selected: null,
      dropdown2Selected: null,
      dropdown3Selected: null,
      accordion1Pressed: false,
      accordion2Pressed: false,
      fields: fields,
      form: {
        title: null,
        list_type: null,
        scoring: [],
        memo: null,
        example1_title: null,
        example2_title: null,
        notice1_title: null,
        notice2_title: null,
        items: [],
        users: []
      },
      inputOptions: {
        input1Active: false, // 항목별 기재사항1 활성화 여부
        input1Title: null, // 항목별 기재사항1
        input2Active: false, // 항목별 기재사항2 활성화 여부
        input2Title: null, // 항목별 기재사항2
        output1Active: false, // 항목별 안내사항1 활성화 여부
        output1Title: null, // 항목별 안내사항1
        output2Active: false, // 항목별 안내사항2 활성화 여부
        output2Title: null, // 항목별 안내사항2
        itemType: 'multiple', // multiple: 객관식, short: 주관식
        itemTitle: null, // 평가(점검) 내용
        itemFileAttach: false, // 파일 첨부 유무
        itemInput1Content: null, // 기재사항1
        itemInput2Content: null, // 기재사항2
        itemOutput1Content: null, // 안내사항1
        itemOutput2Content: null, // 안내사항2
        userShopSelected: null,
        userList: [],
        userSelected: null,
        userFromDate: null,
        userToDate: null,
        userMemo: null
      },
      draggableOptions: {
        handle: '.icon-cursor-move'
      }
    }
  },

  watch: {
    accordion1Pressed () {
      if (!this.accordion2Pressed) return
      this.accordion2Pressed = !this.accordion1Pressed
    },

    accordion2Pressed () {
      if (!this.accordion1Pressed) return
      this.accordion1Pressed = !this.accordion2Pressed
    }
  },

  methods: {
    ...mapActions([
      'fetchCategoryList',
      'fetchShopList',
      'fetchUserList'
    ]),

    reversSampleAnswers () {
      this.form.scoring.reverse()
    },

    addNewItem () {
      // validation
      if (!this.inputOptions.itemTitle) {
        alert('평가사항을 입력하세요')
        this.$refs.inputItemTitle.focus()
        return false
      }

      this.form.items.push({
        item_type: this.inputOptions.itemType,
        category1: this.dropdown1Selected ? this.dropdown1Selected.id : null,
        category2: this.dropdown2Selected ? this.dropdown2Selected.id : null,
        category3: this.dropdown3Selected ? this.dropdown3Selected.id : null,
        title: this.inputOptions.itemTitle,
        example1: this.inputOptions.itemInput1Content,
        example2: this.inputOptions.itemInput2Content,
        notice1: this.inputOptions.itemOutput1Content,
        notice2: this.inputOptions.itemOutput2Content,
        file_yn: this.inputOptions.itemFileAttach
      })

      this.inputOptions.itemTitle = null
      this.inputOptions.itemInput1Content = null
      this.inputOptions.itemInput2Content = null
      this.inputOptions.itemOutput1Content = null
      this.inputOptions.itemOutput2Content = null
      this.inputOptions.itemFileAttach = 0
    },

    addNewUser () {
      // 담당자 배정
      if (!this.inputOptions.userShopSelected) {
        alert('점포를 선택하세요')
        return false
      }

      if (!this.inputOptions.userSelected) {
        alert('담당자를 선택하세요')
        return false
      }

      this.form.users.push({
        shop_id: this.inputOptions.userShopSelected.id,
        user_id: this.inputOptions.userSelected.id,
        shop_name: this.inputOptions.userShopSelected.name,
        user_name: this.inputOptions.userSelected.name,
        from_date: this.inputOptions.userFromDate,
        to_date: this.inputOptions.userToDate,
        memo: this.inputOptions.userMemo
      })

      this.inputOptions.userShopSelected = null
      // this.inputOptions.userSelected = null
    },

    onEditorChange ({ editor, html, text }) {
      // console.log('editor change!', editor, html, text)
      // this.form.memo = html
    },

    initInputOptions () {
      this.inputOptions.input1Active = false
      this.inputOptions.input1Title = null
      this.inputOptions.input2Active = false
      this.inputOptions.input2Title = null
      this.inputOptions.output1Active = false
      this.inputOptions.output1Title = null
      this.inputOptions.output2Active = false
      this.inputOptions.output2Title = null

      this.itemTitle = null
      this.itemInput1Content = null
      this.itemInput2Content = null
      this.itemOutput1Content = null
      this.itemOutput2Content = null
    },

    onChecklistTypeChange (selected) {
      if (!selected) return

      this.form.scoring = []
      this.initInputOptions()
      this.inputOptions.userList = this.filterUserList(selected)

      switch (selected) {
        case 'supervisor':
          this.form.scoring = [ '1', '0' ]
          this.inputOptions.input1Active = true
          this.inputOptions.input1Title = '대책안'
          this.inputOptions.input2Active = true
          this.inputOptions.input2Title = '실천사항'
          break

        case 'shopper':
          this.form.scoring = [ '7', '6', '5', '4', '3', '2', '1' ]
          this.inputOptions.output1Active = true
          this.inputOptions.output1Title = '평가기준'
          this.inputOptions.output2Active = true
          this.inputOptions.output2Title = '유의사항'
          break

        case 'agent':
          this.form.scoring = [ '5', '10' ]
          this.inputOptions.input1Active = true
          this.inputOptions.input1Title = '기재사항'
          this.inputOptions.output1Active = true
          this.inputOptions.output1Title = '평가기준'
          this.inputOptions.output2Active = true
          this.inputOptions.output2Title = '제재기준'
          break

        default:
          break
      }
    },

    onItemModify (item) {
      console.log(item.id, item.name)
    },

    onItemRemove (item) {
      console.log(item.id, item.name)
    },

    onUserModify (item, index, button) {
      // console.log(item.id, item.name)
    },

    onUserRemove (item, index, button) {
      // console.log(item.id, item.name)
    },

    onSubmit () {
      // validation
      if (!this.form.title) {
        alert('제목을 입력하세요')
        this.$refs.checklistTitle.focus()
        return false
      }

      if (this.form.scoring.length === 0) {
        alert('배점을 입력하세요')
        this.$refs.checklistScoring.focus()
        return false
      }

      if (this.inputOptions.input1Active && !this.inputOptions.input1Title) {
        alert('기재사항 제목을 입력하세요')
        this.$refs.input1Title.focus()
        return false
      }

      if (this.inputOptions.input2Active && !this.inputOptions.input2Title) {
        alert('기재사항 제목을 입력하세요')
        this.$refs.input2Title.focus()
        return false
      }

      if (this.inputOptions.output1Active && !this.inputOptions.output1Title) {
        alert('안내사항 제목을 입력하세요')
        this.$refs.output1Title.focus()
        return false
      }

      if (this.inputOptions.output2Active && !this.inputOptions.output2Title) {
        alert('안내사항 제목을 입력하세요')
        this.$refs.output2Title.focus()
        return false
      }

      this.form.example1_title = this.inputOptions.input1Active ? this.inputOptions.input1Title : null
      this.form.example2_title = this.inputOptions.input2Active ? this.inputOptions.input2Title : null
      this.form.notice1_title = this.inputOptions.output1Active ? this.inputOptions.output1Title : null
      this.form.notice2_title = this.inputOptions.output2Active ? this.inputOptions.output2Title : null
    }
  },

  computed: {
    ...mapGetters({
      allItems: 'getAllCategories',
      bigItems: 'getBigCategories',
      middleItems: 'getMiddleCategories',
      smallItems: 'getSmallCategories',
      allShops: 'getAllShops',
      checkListTypes: 'checkListTypes',
      editorOption: 'editorOption',
      editorOption2: 'editorOption2',
      messages: 'messages',
      datePickerOptions: 'datePickerOptions',
      allUsers: 'getAllUsers',
      filterUserList: 'filterUserList'
    }),

    dropDown1Items () {
      return this.bigItems
    },

    dropDown2Items () {
      if (this.dropdown1Selected) {
        return this.middleItems(this.dropdown1Selected.id)
      } else {
        return []
      }
    },

    dropDown3Items () {
      if (this.dropdown2Selected) {
        return this.smallItems(this.dropdown2Selected.id)
      } else {
        return []
      }
    },

    showCategoryChoice () {
      // 대,중,소분류 표시여부
      return this.inputOptions.itemType === 'multiple'
    },

    showItem1Input () {
      // 항목추가에서 기재사항 표시여부
      return this.inputOptions.itemType === 'multiple' && this.inputOptions.input1Active && this.inputOptions.input1Title
    },

    showItem2Input () {
      // 항목추가에서 기재사항 표시여부
      return this.inputOptions.itemType === 'multiple' && this.inputOptions.input2Active && this.inputOptions.input2Title
    },

    showItem1Output () {
      // 항목추가에서 기재사항 표시여부
      return this.inputOptions.itemType === 'multiple' && this.inputOptions.output1Active && this.inputOptions.output1Title
    },

    showItem2Output () {
      // 항목추가에서 기재사항 표시여부
      return this.inputOptions.itemType === 'multiple' && this.inputOptions.output2Active && this.inputOptions.output2Title
    },

    accordion1Variant () {
      return this.accordion1Pressed ? 'outline-danger' : 'outline-primary'
    },

    accordion2Variant () {
      return this.accordion2Pressed ? 'outline-danger' : 'outline-primary'
    }
  },

  created () {
    if (this.allItems.length === 0) {
      this.fetchCategoryList()
    }

    if (this.allShops.length === 0) {
      this.fetchShopList()
    }

    if (this.allUsers.length === 0) {
      this.fetchUserList()
    }

    // this.onChecklistTypeChange(this.form.list_type)

    this.inputOptions.userFromDate = moment().format('YYYY-MM-DD')
    this.inputOptions.userToDate = moment().add(1, 'months').format('YYYY-MM-DD')
  }
}
</script>