<template>
  <default-header>
    <Map slot="map"></Map>
    <div slot="header">
      {{title}}
    </div>
  </default-header>
</template>

<script>
  import * as d3 from 'd3';
  import Vue from 'vue';
  import VueWaypoint from 'vue-waypoint';

  import DefaultHeader from '../DefaultLayout'
  import Map from '../Map'

  Vue.use(VueWaypoint);

  export default {
    name: 'RightPanel',
    components: {DefaultHeader, Map},
    data() {
      return {
        title: "Urban Heat"
      }
    },

    methods: {
      mounted() {

      }
    }
  }
</script>

<style>

</style>
