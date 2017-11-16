<template>
  <div class="animated fadeIn" v-if="shop">
    <b-row>
      <b-col>
        <h5>{{shop.name}}</h5><br>
        <h6>주소</h6>
        {{shop.address}}
        <hr>
        <h6>전화번호</h6>
        {{shop.tel}}
        <hr>
        <h6>비고</h6>
        <div v-html="shop.memo"></div>
      </b-col>
    </b-row>
    <google-map v-if="shop"
      :gmap-default-position="gmapDefaultPosition"
      :gmap-show-auto-complete="false"
    ></google-map>
  </div>
</template>

<script>
import GoogleMap from '../components/GoogleMap'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'shop-detail',

  data () {
    return {
    }
  },

  props: {
    id: {
      type: Number
    }
  },

  components: {
    GoogleMap
  },

  created () {
    if (this.allshops.length === 0) {
      this.fetchShopList()
    }
  },

  computed: {
    shop () {
      return this.fiterShopById(this.id)[0]
    },

    gmapDefaultPosition () {
      return {
        lat: !this.shop.lat ? undefined : this.shop.lat,
        lng: !this.shop.lng ? undefined : this.shop.lng
      }
    },

    ...mapGetters({
      'allshops': 'getAllShops',
      'fiterShopById': 'fiterShopById'
    })
  },

  methods: {
    ...mapActions([
      'fetchShopList'
    ])
  }
}
</script>