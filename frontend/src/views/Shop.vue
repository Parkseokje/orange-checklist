<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="row">
        <div class="col-12">
          <b-card header="점포 목록">
            <b-btn v-b-modal.modalCreateShop href="#" variant="primary">점포 등록</b-btn>
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
                <b-btn variant="info" size="sm" @click.stop="details(row.item,row.index,$event.target)">보기</b-btn>
                <b-btn variant="secondary" size="sm" @click.stop="modify(row.item,row.index,$event.target)">수정</b-btn>
                <b-btn variant="danger" size="sm" @click.stop="remove(row.item,row.index,$event.target)">삭제</b-btn>
              </template>
            </b-table>
          </b-card>
        </div>
      </div>
    </div>
    <!-- 점포 정보 보기 모달 -->
    <b-modal id="modalShowInfo"
      @hide="resetModal"
    >
      <h4 slot="modal-header">Index: {{ modalDetails.index }}</h4>
      <pre>{{ modalDetails.data }}</pre>
    </b-modal>
    <!-- 점포 생성/수정 모달 -->
    <b-modal id="modalCreateShop"
      :title="form.title"
      :header-bg-variant="modalVariants.headerBgVariant"
      :header-text-variant="modalVariants.headerTextVariant"
      :no-close-on-backdrop="true"
      :no-close-on-esc="true"
      @hide="initializeForm"
      @shown="refreshGmap"
      hide-footer
    >
      <google-map
        :gmap-default-position="gmapDefaultPosition"
        :gmap-show-auto-complete="gmapShowAutoComplete"
        :gmap-search-text="gmapSearchText"
        @changed="onGmapChanged"
      ></google-map>
      <br><br>
      <b-form @submit.prevent="onSubmit" novalidate>
        <b-form-group
          description=""
          label="점포명"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.name')"
        >
          <b-form-input type="text"
            :state="!validation.firstError('form.name')"
            :autocomplete="'off'"
            v-model="form.name"
            required placeholder="점포명을 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description=""
          label="주소"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.address')"
        >
          <b-form-input type="text"
            :state="!validation.firstError('form.address')"
            :autocomplete="'off'"
            v-model="form.address"
            required placeholder="주소를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description=""
          label="전화번호"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.tel_no')"
        >
          <b-form-input type="text"
            :state="!validation.hasError('form.tel_no')"
            :autocomplete="'off'"
            v-model="form.tel_no"
            required placeholder="전화번호를 입력하세요"></b-form-input>
        </b-form-group>
        <b-form-group
          description=""
          label="메모"
          :label-cols="modalLabelCols"
          :horizontal="modalInputHorizontal"
          :feedback="validation.firstError('form.memo')"
        >
          <b-form-textarea id="memoInput"
            :state="!validation.hasError('form.memo')"
            v-model="form.memo"
            placeholder="메모를 입력하세요"
            :rows="3"
            :max-rows="6">
          </b-form-textarea>
        </b-form-group>

        <b-container>
          <b-row>
            <b-col><b-btn block variant="primary" type="submit">저장</b-btn></b-col>
            <b-col><b-btn block variant="secondary" @click="initializeForm" type="reset">초기화</b-btn></b-col>
            <b-col><b-btn block variant="danger" @click="hideModal">취소</b-btn></b-col>
          </b-row>
        </b-container>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import GoogleMap from '../components/GoogleMap'
import { mapGetters, mapActions } from 'vuex'
import { Validator } from 'simple-vue-validator'

const fields = {
  name: { label: '점포명', sortable: true, 'class': 'text-center' },
  tel_no: { label: '전화번호', 'class': 'text-center' },
  actions: { label: 'Actions' }
}

export default {
  name: 'shop',
  data: function () {
    return {
      gmapDefaultPosition: undefined,
      gmapShowAutoComplete: true,
      gmapSearchText: undefined,
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
      modalDetails: { index: '', data: '' },
      form: null,
      modalLabelCols: 2,
      modalInputHorizontal: true
    }
  },

  validators: {
    'form.name' (value) {
      return Validator.value(value).required('필수입력')
    },
    'form.tel_no' (value) {
      return Validator.value(value).digit('숫자만 입력').minLength(7, '지역번호 포함. 7자리 이상')
    },
    'form.memo' (value) {
      return Validator.value(value).maxLength(40, '40자 이내')
    }
  },

  components: {
    GoogleMap
  },

  methods: {
    ...mapActions([
      'fetchShopLists',
      'createShop',
      'updateShop',
      'deleteShop'
    ]),

    details (item, index, button) {
      this.modalDetails.data = JSON.stringify(item, null, 2)
      this.modalDetails.index = index
      this.$root.$emit('bv::show::modal', 'modalShowInfo', button)
    },

    modify (item, index, button) {
      this.form.title = '점포 수정'
      this.form.id = item.id
      this.form.name = item.name
      this.form.address = item.address
      this.form.tel_no = item.tel_no
      this.form.memo = item.memo
      this.form.lat = item.lat
      this.form.lng = item.lng

      if (this.form.lat && this.form.lng) {
        this.gmapDefaultPosition = {
          lat: this.form.lat,
          lng: this.form.lng
        }
      } else {
        this.gmapDefaultPosition = undefined
      }

      this.gmapSearchText = undefined

      this.$root.$emit('bv::show::modal', 'modalCreateShop', button)
    },

    remove (item, index, button) {
      if (confirm('정말 삭제하시겠습니까?')) {
        this.deleteShop(item.id)
      }
    },

    resetModal () {
      this.modalDetails.data = ''
      this.modalDetails.index = ''
    },

    hideModal () {
      this.initializeForm()
      this.$root.$emit('bv::hide::modal', 'modalCreateShop')
    },

    initializeForm () {
      this.form = Object.assign({}, this.form, {
        title: '점포 등록',
        id: null,
        name: null,
        address: null,
        tel_no: null,
        memo: null,
        lat: null,
        lng: null,
        is_active: true
      })
    },

    onSubmit () {
      this.$validate()
        .then(success => {
          if (success) {
            if (confirm('저장하시겠습니까?')) {
              if (this.form.id) {
                this.updateShop(this.form)
              } else {
                this.createShop(this.form)
              }
              this.hideModal()
            }
          } else {
            alert('유효하지 않은 입력값이 존재합니다.')
          }
        })
    },

    onFiltered (filteredItems) {
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },

    onGmapChanged ({ lat, lng, name, address, tel_no: telNo }) {
      if (confirm('지도의 정보로 변경하시겠습니까?')) {
        this.form.name = name
        this.form.address = address

        if (telNo !== undefined) {
          this.form.tel_no = telNo.replace(/[^0-9]/g, '')
        } else {
          this.form.tel_no = null
        }

        this.form.lat = lat
        this.form.lng = lng

        if (this.form.lat && this.form.lng) {
          this.gmapDefaultPosition = {
            lat: this.form.lat,
            lng: this.form.lng
          }
        } else {
          this.gmapDefaultPosition = undefined
        }
      }
    },

    refreshGmap () {
      this.$gmapDefaultResizeBus.$emit('resize')
    }
  },

  created () {
    this.fetchShopLists()
    this.initializeForm()
  },

  computed: {
    ...mapGetters({
      items: 'getAllShops',
      modalVariants: 'modalVariants'
    })
  }
}
</script>