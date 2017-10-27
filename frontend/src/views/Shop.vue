<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <div class="row">
        <div class="col-12">
          <div class="autocomplete">
            <gmap-autocomplete @place_changed="setPlace" class="form-control" style="width: 100%">
            </gmap-autocomplete>
          </div>
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

          <label>{{ address }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'shop',
  data: function () {
    return {
      place: null,
      position: {
        lat: 37.556495,
        lng: 126.914470
      }
    }
  },
  methods: {
    setPlace (place) {
      if (place.geometry) {
        this.place = place
        this.position.lat = place.geometry.location.lat()
        this.position.lng = place.geometry.location.lng()
      }
    }
  },
  computed: {
    markers () {
      return [{
        position: this.position
      }]
    },
    address () {
      if (this.place) {
        return this.place.formatted_address
      }
    }
  }
}
</script>