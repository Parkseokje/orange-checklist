<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="체크리스트 정보">
        <b-form>
          <b-btn class="mb-3" variant="primary">체크리스트 생성하기</b-btn>
          <b-row>
            <b-col lg="2">
              <b-form-group label="체크리스트 구분">
                <b-form-select v-model="form.list_type" :options="checkListTypes" @change="onChecklistTypeChange"></b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="체크리스트명">
                <b-form-input placeholder="텍스트를 입력하세요" v-model="form.title"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group label="평가항목 배점">
            <input-tag placeholder="입력+ENTER" :tags="form.scoring"></input-tag>
            <b-btn variant="link" size="sm" @click="reversSampleAnswers">순서변경</b-btn>
          </b-form-group>
          <b-form-group label="비고">
            <quill-editor ref="memo" :options="editorOption" :content="form.memo" @change="onEditorChange($event)"></quill-editor>
          </b-form-group>
        </b-form>

        <!-- 항목 영역 -->
        <b-row>
          <b-col lg="6">
            <b-card header="항목 정보">
              <b-tabs pills>
                <b-tab title="평가항목 추가" active>
                  <b-form>
                    <b-form-group label="대분류" horizontal>
                      <v-select label="name" placeholder="선택하세요"
                        v-model="dropdown1Selected"
                        :options="dropDown1Items"
                        :reset-on-options-change="true"
                      ></v-select>
                    </b-form-group>
                    <b-form-group label="중분류" horizontal>
                      <v-select label="name" placeholder="선택하세요"
                        v-model="dropdown2Selected"
                        :options="dropDown2Items"
                        :reset-on-options-change="true"
                      ></v-select>
                    </b-form-group>
                    <b-form-group label="소분류" horizontal>
                      <v-select label="name" placeholder="선택하세요"
                        v-model="dropdown3Selected"
                        :options="dropDown3Items"
                        :reset-on-options-change="true"
                      ></v-select>
                    </b-form-group>
                    <b-form-group label="평가항목명">
                      <b-form-input type="text" required placeholder="텍스트를 입력하세요" v-model="item1Title">
                      </b-form-input>
                    </b-form-group>
                    <b-form-group label="기재사항">
                      <quill-editor :options="editorOption" :content="item1Input" @change="onEditorChange($event)"></quill-editor>
                    </b-form-group>
                    <b-form-group label="유의사항">
                      <quill-editor :options="editorOption" :content="item1Precaution" @change="onEditorChange($event)"></quill-editor>
                    </b-form-group>
                    <div class="d-flex justify-content-between">
                      <b-form-checkbox
                        v-model="item1FileAttach"
                        value="1"
                        unchecked-value="0">
                        파일 첨부 가능
                      </b-form-checkbox>
                      <b-btn variant="primary">추가</b-btn>
                    </div>
                  </b-form>
                </b-tab>
                <b-tab title="입력항목 추가">
                  <b-form-group label="입력항목명">
                    <b-form-input type="text" required placeholder="텍스트를 입력하세요" v-model="item2Title">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group label="유의사항">
                    <quill-editor :options="editorOption" :content="item2Precaution" @change="onEditorChange($event)"></quill-editor>
                  </b-form-group>
                  <div class="d-flex justify-content-between">
                    <b-form-checkbox
                      v-model="item2FileAttach"
                      value="1"
                      unchecked-value="0">
                      파일 첨부 가능
                    </b-form-checkbox>
                    <b-btn mr-auto variant="primary">추가</b-btn>
                  </div>
                </b-tab>
              </b-tabs>
            </b-card>
          </b-col>
          <b-col>
            <b-card header="항목 목록" >
              <!--<b-table striped hover responsive :items="itemList"></b-table>-->
            <draggable v-model="itemList">
              <transition-group name="no" class="list-group">
                <a href="#" @click.prevent="" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center" role="tab" v-for="(item, index) in itemList" :key="item.id">
                  {{index + 1}}. {{item.name}}
                  <b-btn variant="danger">삭제</b-btn>
                </a>
              </transition-group>
            </draggable>
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

export default {
  name: 'checklist-detail',

  components: {
    quillEditor,
    draggable
  },

  data () {
    return {
      checklistQuizTypeSelected: null,
      dropdown1Selected: null,
      dropdown2Selected: null,
      dropdown3Selected: null,
      checklistQuizTypes: [
        { text: '선택형', value: 'S' },
        { text: '단답형', value: 'T' },
        { text: '다답형', value: 'M' }
      ],
      sampleAnswers: [],
      itemList: [
        { id: 1, name: 'Macdonald1' },
        { id: 2, name: 'Macdonald2' },
        { id: 3, name: 'Macdonald3' },
        { id: 4, name: 'Macdonald4' }
      ],
      form: {
        title: null,
        list_type: null,
        scoring: null,
        memo: null,
        items: []
      },
      item1Title: null,
      item1Input: null,
      item1Precaution: null,
      item1FileAttach: 0,
      item2Title: null,
      item2Precaution: null,
      item2FileAttach: 0
    }
  },

  methods: {
    ...mapActions([
      'fetchCategoryLists'
    ]),

    reversSampleAnswers () {
      this.form.scoring.reverse()
    },

    onEditorChange ({ editor, html, text }) {
      console.log('editor change!', editor, html, text)
      this.form.memo = html
    },

    onChecklistTypeChange (selected) {
      switch (selected) {
        case 'supervisor':
          this.form.scoring = [ '1', '0' ]
          break
        case 'shopper':
          this.form.scoring = [ '7', '6', '5', '4', '3', '2', '1' ]
          break
        case 'agent':
          this.form.scoring = [ '5', '10' ]
          break
        default:
          break
      }
    }
  },

  computed: {
    ...mapGetters({
      bigItems: 'getBigCategories',
      middleItems: 'getMiddleCategories',
      smallItems: 'getSmallCategories',
      checkListTypes: 'checkListTypes',
      editorOption: 'editorOption'
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
    }
  },

  created () {
    this.fetchCategoryLists()
  }
}
</script>