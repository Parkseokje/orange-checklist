<template>
  <b-container>
    <b-row class="my-1" v-if="categoryType !== 'big'">
      <b-col>
        <v-select label="name"
          v-model="dropdown1Selected"
          :options="dropDown1Items"
          :on-change="onDropdown1Change"
          :reset-on-options-change="true"
          placeholder="대분류명을 선택하세요"
        ></v-select>
      </b-col>
    </b-row>
    <b-row class="my-1" v-if="categoryType === 'small'">
      <b-col>
        <v-select label="name"
          v-model="dropdown2Selected"
          :options="dropDown2Items"
          :on-change="onDropdown2Change"
          :reset-on-options-change="true"
          :clear-search-on-select="false"
          placeholder="중분류명을 선택하세요"
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
            :placeholder="placeholder"
            :disabled="inputDisabled"
            v-model="selected.name">
          </b-form-input>
          <b-input-group-button slot="right">
            <b-btn variant="primary" v-show="!selected.id" @click.stop="onAdd" :disabled="inputDisabled">추가</b-btn>
            <b-btn variant="secondary" v-show="selected.id" @click.stop="onUpdate">수정</b-btn>
            <b-btn variant="danger" v-show="selected.id" @click.stop="onDelete">삭제</b-btn>
            <b-btn variant="warning" v-show="selected.id" @click.stop="onCancel">취소</b-btn>
          </b-input-group-button>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row class="my-1 overflow-scroll">
      <b-col>
        <b-table striped hover show-empty
          :empty-text="messages.emptyText"
          :items="items" :fields="fields">
          <template slot="actions" scope="row">
            <b-btn size="sm" variant="outline-secondary" @click.stop="select(row.item, row.index, $event.target)">선택</b-btn>
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
    categoryType: String
  },

  methods: {
    ...mapActions([
      'fetchCategoryLists',
      'createCategory',
      'updateCategory',
      'deleteCategory'
    ]),

    select (item, index, button) {
      this.selected.id = item.id
      this.selected.name = item.name

      setTimeout(() => {
        this.$refs.inputCategory.focus()
      }, 100)
    },

    initializeSelected () {
      this.selected.id = null
      this.selected.parent_id = null
      this.selected.name = null
      this.selected.is_active = true

      // this.selected = Vue.util.extend({}, {
      //   id: null, parent_id: null, name: null, is_active: true, depth: null
      // })
    },

    setParentId () {
      if (!this.selected.id) {
        if (this.categoryType === this.categoryTypes.middle.key) {
          if (this.dropdown1Selected) {
            this.selected.parent_id = this.dropdown1Selected.id
          }
        } else if (this.categoryType === this.categoryTypes.small.key) {
          if (this.dropdown2Selected) {
            this.selected.parent_id = this.dropdown2Selected.id
          }
        }
      }
    },

    onAdd () {
      if (!this.selected.name) {
        alert(this.placeholder)
        this.$refs.inputCategory.focus()
        return false
      }

      if (confirm('추가하시겠습니까?')) {
        this.createCategory(Vue.util.extend({}, this.selected))
        this.initializeSelected()
      }
    },

    onUpdate () {
      if (!this.selected.name) {
        alert(this.placeholder)
        this.$refs.inputCategory.focus()
        return false
      }

      if (this.selected.id) {
        if (confirm('수정하시겠습니까?')) {
          this.updateCategory(Vue.util.extend({}, this.selected))
          this.initializeSelected()
        }
      }
    },

    onDelete () {
      if (this.selected.id) {
        if (confirm('삭제하시겠습니까?')) {
          this.deleteCategory(this.selected.id)
          this.initializeSelected()
        }
      }
    },

    onCancel () {
      this.initializeSelected()
    },

    onDropdown1Change (data) {
      this.dropdown1Selected = data
      this.initializeSelected()
      this.setParentId()
    },

    onDropdown2Change (data) {
      this.dropdown2Selected = data
      this.initializeSelected()
      this.setParentId()
    },

    onInputKeyEnter () {
      if (this.selected.id) {
        this.onUpdate()
      } else {
        this.onAdd()
      }
    }
  },

  data () {
    return {
      placeholder: null,
      label: null,
      fields: null,
      selected: { id: null, parent_id: null, name: null, is_active: true, depth: null },
      dropdown1Selected: null,
      dropdown2Selected: null
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
      if (this.categoryType === this.categoryTypes.middle.key) {
        return this.dropdown1Selected === null
      } else if (this.categoryType === this.categoryTypes.small.key) {
        return this.dropdown2Selected === null
      } else {
        return false
      }
    },

    items () {
      let data = []

      switch (this.categoryType) {
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
    this.fetchCategoryLists()

    let title

    switch (this.categoryType) {
      case this.categoryTypes.big.key:
        title = this.categoryTypes.big.value
        this.selected.depth = 1
        break

      case this.categoryTypes.middle.key:
        title = this.categoryTypes.middle.value
        this.selected.depth = 2
        break

      case this.categoryTypes.small.key:
        title = this.categoryTypes.small.value
        this.selected.depth = 3
        break

      default:
        break
    }

    this.label = title
    this.fields = { name: { label: `${this.label}명`, sortable: true, 'class': 'text-center' }, actions: { label: '행동', 'class': 'text-center' } }
    this.placeholder = `${this.label}명을 입력하세요`
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