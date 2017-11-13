<template>
  <b-container>
    <b-row class="my-1" v-if="categoryType.key !== 'A'">
      <b-col>
        <v-select label="name"
          v-model="dropdown1Selected"
          :options="dropDown1Items"
          :on-change="onDropdown1Change"
          :reset-on-options-change="true"
          :placeholder="categoryTypes.big.value + '을 선택하세요'"
        ></v-select>
      </b-col>
    </b-row>
    <b-row class="my-1" v-if="categoryType.key === 'C'">
      <b-col>
        <v-select label="name"
          v-model="dropdown2Selected"
          :options="dropDown2Items"
          :on-change="onDropdown2Change"
          :reset-on-options-change="true"
          :placeholder="categoryTypes.middle.value + '를 선택하세요'"
        ></v-select>
      </b-col>
    </b-row>
    <b-row class="my-2">
      <b-col>
        <b-input-group>
          <b-form-input
            ref="inputCategory"
            @focus.native="$event.target.select()"
            @keyup.enter.native="onInputKeyEnter"
            :placeholder="categoryType.value + '명을 입력하세요'"
            :disabled="inputDisabled"
            autofocus="true"
            v-model="selected.name">
          </b-form-input>
          <b-input-group-button slot="right">
            <b-btn variant="primary" @click.stop="onSave" :disabled="inputDisabled">저장</b-btn>
            <!--<b-btn variant="secondary" v-show="selected.id" @click.stop="onUpdate">수정</b-btn>
            <b-btn variant="danger" v-show="selected.id" @click.stop="onDelete">삭제</b-btn>
            <b-btn variant="warning" v-show="selected.id" @click.stop="onCancel">취소</b-btn>-->
          </b-input-group-button>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row class="my-1 overflow-scroll">
      <b-col>
        <b-table striped hover show-empty
          :empty-text="messages.emptyText"
          :items="items" :fields="fields">
          <template slot="children" scope="row" v-if="categoryType.key !== 'C'">
            {{ childCount(row.item.id) }}
          </template>
          <template slot="actions" scope="row">
            <b-btn size="sm" variant="outline-success" v-show="showSelectBtn" @click.stop="onShowChildren(row.item)">선택</b-btn>
            <b-btn size="sm" variant="outline-secondary" @click.stop="select(row.item, row.index, $event.target)">수정</b-btn>
            <b-btn size="sm" variant="outline-danger" @click.stop="onDelete(row.item.id)">삭제</b-btn>
          </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'category',

  props: {
    categoryType: Object,
    dropdown1PassedVal: Object,
    dropdown2PassedVal: Object
  },

  watch: {
    dropdown1PassedVal (newVal, oldVal) {
      this.onDropdown1Change(newVal)
    },

    dropdown2PassedVal (newVal, oldVal) {
      this.onDropdown2Change(newVal)
    }
  },

  methods: {
    ...mapActions([
      'fetchCategoryList',
      'createCategory',
      'updateCategory',
      'deleteCategory'
    ]),

    select (item, index, button) {
      this.selected.id = item.id
      this.selected.name = item.name
      this.focusInputCategory()
    },

    focusInputCategory () {
      // focus() 이벤트를 즉시 호출할 경우 안먹는 증상이 있다.
      setTimeout(() => {
        this.$refs.inputCategory.focus()
      }, 100)
    },

    initializeSelected () {
      this.selected.id = null
      this.selected.parent_id = null
      this.selected.name = null
      this.selected.is_active = true
    },

    setParentId () {
      if (!this.selected.id) {
        if (this.categoryType.key === this.categoryTypes.middle.key) {
          if (this.dropdown1Selected) {
            this.selected.parent_id = this.dropdown1Selected.id
          }
        } else if (this.categoryType.key === this.categoryTypes.small.key) {
          if (this.dropdown2Selected) {
            this.selected.parent_id = this.dropdown2Selected.id
          }
        }
      }
    },

    onSave () {
      if (!this.selected.name) {
        alert(this.categoryType.value + '명을 입력하세요')
        this.$refs.inputCategory.focus()
        return false
      }

      if (confirm('저장하시겠습니까?')) {
        if (!this.selected.id) {
          this.createCategory(Vue.util.extend({}, this.selected))
        } else {
          this.updateCategory(Vue.util.extend({}, this.selected))
        }

        this.initializeSelected()
      }
    },

    onDelete (id) {
      if (id && this.childCount(id) === 0) {
        if (confirm('삭제하시겠습니까?')) {
          this.deleteCategory(id)
          this.initializeSelected()
        }
      } else {
        alert('하위 분류를 먼저 삭제하세요')
      }
    },

    onCancel () {
      this.initializeSelected()
    },

    onDropdown1Change (data) {
      if (!data && this.dropdown1PassedVal) {
        this.dropdown1Selected = Vue.util.extend({}, this.dropdown1PassedVal)
      } else {
        this.dropdown1Selected = data
      }

      this.initializeSelected()
      this.setParentId()
      this.focusInputCategory()
    },

    onDropdown2Change (data) {
      if (!data && this.dropdown2PassedVal) {
        this.dropdown2Selected = Vue.util.extend({}, this.dropdown2PassedVal)
      } else {
        this.dropdown2Selected = data
      }

      this.initializeSelected()
      this.setParentId()
      this.focusInputCategory()
    },

    onInputKeyEnter () {
      this.onSave()
    },

    onShowChildren (item) {
      switch (this.categoryType.key) {
        case this.categoryTypes.big.key:
          this.$emit('show-children', {
            dropdown1Selected: item
          })
          break

        case this.categoryTypes.middle.key:
          this.$emit('show-children', {
            dropdown1Selected: this.dropdown1Selected,
            dropdown2Selected: item
          })
          break

        default:
          break
      }
    },

    childCount (id) {
      let count = 0

      switch (this.categoryType.key) {
        case this.categoryTypes.big.key:
          count = this.middleItems(id).length
          break

        case this.categoryTypes.middle.key:
          count = this.smallItems(id).length
          break

        default:
          break
      }

      return count
    }
  },

  data () {
    return {
      label: null,
      fields: null,
      selected: { id: null, parent_id: null, name: null, is_active: true, depth: null },
      dropdown1Selected: null,
      dropdown2Selected: null,
      showSelectBtn: true
    }
  },

  computed: {
    ...mapGetters({
      bigItems: 'getBigCategories',
      middleItems: 'getMiddleCategories',
      smallItems: 'getSmallCategories',
      categoryTypes: 'categoryTypes',
      messages: 'messages'
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

    inputDisabled () {
      if (this.categoryType.key === this.categoryTypes.middle.key) {
        return this.dropdown1Selected === null
      } else if (this.categoryType.key === this.categoryTypes.small.key) {
        return this.dropdown2Selected === null
      } else {
        return false
      }
    },

    items () {
      let data = []

      switch (this.categoryType.key) {
        case this.categoryTypes.big.key:
          data = this.bigItems
          break

        case this.categoryTypes.middle.key:
          if (this.dropdown1Selected) {
            data = this.middleItems(this.dropdown1Selected.id)
          }
          break

        case this.categoryTypes.small.key:
          if (this.dropdown2Selected) {
            data = this.smallItems(this.dropdown2Selected.id)
          }
          break
        default:
          break
      }

      return data
    }
  },

  created () {
    this.fetchCategoryList()

    const fieldTypes = {
      name: { label: `${this.categoryType.value}명`, sortable: true, 'class': 'text-center' },
      children: { label: '개수', 'class': 'text-center' },
      actions: { label: '행동', 'class': 'text-center' }
    }

    switch (this.categoryType.key) {
      case this.categoryTypes.big.key:
        this.selected.depth = 1
        this.showSelectBtn = true
        this.fields = { name: fieldTypes.name, children: fieldTypes.children, actions: fieldTypes.actions }

        break

      case this.categoryTypes.middle.key:
        this.selected.depth = 2
        this.showSelectBtn = true
        this.fields = { name: fieldTypes.name, children: fieldTypes.children, actions: fieldTypes.actions }
        break

      case this.categoryTypes.small.key:
        this.selected.depth = 3
        this.showSelectBtn = false
        this.fields = { name: fieldTypes.name, actions: fieldTypes.actions }
        break

      default:
        break
    }
  }
}
</script>

<style>
  .overflow-scroll {
    position:relative;
    height:300px;
    overflow-y:scroll;
  }
</style>