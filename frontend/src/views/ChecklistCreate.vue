<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-card header="질문목록">
        <b-form-radio-group
          v-model="checklistTypeSelected"
          name="radioChecklistType"
          :options="checklistTypes"
        >
        </b-form-radio-group>
        <b-btn v-b-toggle.collapse1 variant="primary">질문 추가</b-btn>
        <b-collapse id="collapse1" class="mt-2">
          <b-card>
            <b-form>
                <b-form-group label="분류">
                  <b-row>
                    <b-col>
                      <v-select label="name"
                        placeholder="대분류"
                      ></v-select>
                    </b-col>
                    <b-col>
                      <v-select label="name"
                        placeholder="대분류"
                      ></v-select>
                    </b-col>
                    <b-col>
                      <v-select label="name"
                        placeholder="대분류"
                      ></v-select>
                    </b-col>
                  </b-row>
                </b-form-group>
              <b-form-group label="유형">
                <b-form-radio-group
                  v-model="checklistQuizTypeSelected"
                  name="radioChecklistQuizType"
                  :options="checklistQuizTypes"
                ></b-form-radio-group>
              </b-form-group>
              <b-form-group label="질문">
                <b-form-input type="text" required placeholder="질문을 입력하세요"
                  v-model="form.question"
                >
                </b-form-input>
              </b-form-group>
              <b-form-group label="보기">
                <input-tag placeholder="보기 추가" :tags="sampleAnswers"></input-tag>
                <b-btn variant="link" size="sm" @click="reversSampleAnswers">순서변경</b-btn>
              </b-form-group>
            </b-form>
          </b-card>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'checklist-item',

  components: {
  },

  data () {
    return {
      checklistTypeSelected: 'SV',
      checklistQuizTypeSelected: 'S',
      checklistTypes: [
        { text: '슈퍼바이져용', value: 'SV' },
        { text: '미스터리쇼퍼용', value: 'MS' }
      ],
      checklistQuizTypes: [
        { text: '선택형', value: 'S' },
        { text: '단답형', value: 'T' },
        { text: '다답형', value: 'M' }
      ],
      form: {
        question: null
      },
      sampleAnswers: [ '1', '2', '3', '4', '5' ]
    }
  },

  methods: {
    reversSampleAnswers () {
      this.sampleAnswers.reverse()
    }
  },

  computed: {
  }
}
</script>