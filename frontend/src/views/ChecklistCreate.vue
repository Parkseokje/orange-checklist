<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="체크리스트 정보">
        <b-form>
          <b-btn class="mb-3" variant="primary">체크리스트 생성하기</b-btn>
          <b-row>
            <b-col lg="2">
              <b-form-group label="체크리스트 구분">
                <b-form-select v-model="checklistTypeSelected" :options="checkListTypes" @change="onChecklistTypeChange"></b-form-select>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="체크리스트명">
                <b-form-input placeholder="텍스트를 입력하세요"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group label="평가항목 배점">
            <input-tag placeholder="추가" :tags="sampleAnswers"></input-tag>
            <b-btn variant="link" size="sm" @click="reversSampleAnswers">순서변경</b-btn>
          </b-form-group>
          <b-form-group label="비고">
            <quill-editor :options="editorOption"></quill-editor>
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
                      <v-select label="name" placeholder="선택하세요"></v-select>
                    </b-form-group>
                    <b-form-group label="중분류" horizontal>
                      <v-select label="name" placeholder="선택하세요"></v-select>
                    </b-form-group>
                    <b-form-group label="소분류" horizontal>
                      <v-select label="name" placeholder="선택하세요"></v-select>
                    </b-form-group>
                    <b-form-group label="평가항목명">
                      <b-form-input type="text" required placeholder="텍스트를 입력하세요" v-model="form.question">
                      </b-form-input>
                    </b-form-group>
                    <b-form-group label="기재사항">
                      <quill-editor :options="editorOption"></quill-editor>
                    </b-form-group>
                    <b-form-group label="유의사항">
                      <quill-editor :options="editorOption"></quill-editor>
                    </b-form-group>
                    <div class="d-flex justify-content-between">
                      <b-form-checkbox id="checkbox1"
                        value="accepted"
                        unchecked-value="not_accepted">
                        파일 첨부 가능
                      </b-form-checkbox>
                      <b-btn variant="primary">추가</b-btn>
                    </div>
                  </b-form>
                </b-tab>
                <b-tab title="입력항목 추가">
                  <b-form-group label="입력항목명">
                    <b-form-input type="text" required placeholder="텍스트를 입력하세요" v-model="form.question">
                    </b-form-input>
                  </b-form-group>
                  <b-form-group label="유의사항">
                    <quill-editor :options="editorOption"></quill-editor>
                  </b-form-group>
                  <div class="d-flex justify-content-between">
                    <b-form-checkbox id="checkbox1"
                      value="accepted"
                      unchecked-value="not_accepted">
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
import { mapGetters } from 'vuex'
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
      checklistTypeSelected: null,
      checklistQuizTypeSelected: null,
      checklistQuizTypes: [
        { text: '선택형', value: 'S' },
        { text: '단답형', value: 'T' },
        { text: '다답형', value: 'M' }
      ],
      form: {
        question: null
      },
      sampleAnswers: [],
      itemList: [
        { id: 1, name: 'Macdonald1' },
        { id: 2, name: 'Macdonald2' },
        { id: 3, name: 'Macdonald3' },
        { id: 4, name: 'Macdonald4' }
      ]
    }
  },

  methods: {
    reversSampleAnswers () {
      this.sampleAnswers.reverse()
    },

    onChecklistTypeChange (selected) {
      switch (selected) {
        case 'supervisor':
          this.sampleAnswers = [ '1', '0' ]
          break
        case 'shopper':
          this.sampleAnswers = [ '7', '6', '5', '4', '3', '2', '1' ]
          break
        case 'agent':
          this.sampleAnswers = [ '5', '10' ]
          break
        default:
          break
      }
    }
  },

  computed: {
    ...mapGetters({
      checkListTypes: 'checkListTypes',
      editorOption: 'editorOption'
    })
  }
}
</script>