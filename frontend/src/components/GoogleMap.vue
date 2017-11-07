<template>
  <div class="google-map">
    <gmap-autocomplete
      @place_changed="onPlaceChanged"
      v-if="gmapShowAutoComplete"
      class="form-control" style="width: 100%" placeholder="점포명을 입력하세요">
    </gmap-autocomplete>
    <br>
    <gmap-map
      :center="position"
      :zoom="15"
      map-type-id="roadmap"
      style="width: 100%; height: 300px"
    >
      <gmap-marker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        :clickable="true"
        :draggable="true"
        @click="center=m.position"
      ></gmap-marker>
    </gmap-map>
  </div>
</template>

<script>
export default {
  name: 'google-map',
  props: {
    gmapShowAutoComplete: {
      type: Boolean,
      default: () => {
        return true
      }
    },

    gmapDefaultPosition: {
      type: Object,
      default: () => {
        return {
          lat: 37.556495,
          lng: 126.914470
        }
      }
    }
  },

  data: function () {
    return {
      place: null
    }
  },

  methods: {
    onPlaceChanged (place) {
      if (place.geometry) {
        this.place = place

        this.$emit('changed', {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          name: this.place.name,
          address: this.place.formatted_address,
          tel: this.place.formatted_phone_number
        })
      }
    }
  },

  computed: {
    markers () {
      return [{
        position: this.position
      }]
    },

    position () {
      return this.gmapDefaultPosition
    }
  }
}
</script>

<style>
  .pac-container.pac-logo {
    z-index: 999999;
  }
</style>