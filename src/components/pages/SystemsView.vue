<template>
  <default-header>
    <Map slot="map"></Map>
    <div slot="intro">
      <story-section>
        <header slot="header"
                v-waypoint="{ active: true, callback: onWaypoint}">
          {{title}}
        </header>
        <p slot="text">{{intro}}</p>
      </story-section>
    </div>

    <div slot="main">

      <story-section>
        <header slot="header"
                v-waypoint="{ active: true, callback: onWaypoint}">
          {{div1}}
        </header>
        <p slot="text">
          {{div1Text}}
        </p>
      </story-section>

    </div>

    <div slot="analysis">
      <story-section>
        <header slot="header">Analysis: Histogram of Building Areas</header>
        <Histogram slot="text"></Histogram>
      </story-section>

    </div>

  </default-header>
</template>

<script>
  import * as d3 from 'd3';
  import Vue from 'vue';
  import VueWaypoint from 'vue-waypoint';

  import DefaultHeader from '../DefaultLayout'
  import Map from '../Map'
  import Histogram from '../Histogram'
  import StorySection from '../StorySection'

  Vue.use(VueWaypoint);

  export default {
    name: 'RightPanel',
    components: {DefaultHeader, Map, Histogram, StorySection},
    data() {
      return {
        title: "Exploring the Potential of Green Roofs in NYC",
        intro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis facilisis nibh, sed blandit ligula. Phasellus sodales sapien non tincidunt volutpat. Maecenas eu malesuada lacus. Pellentesque vitae velit vel elit varius tristique vel sit amet dolor. Fusce scelerisque metus odio, quis eleifend lorem interdum tempor. Etiam semper sit amet leo in pellentesque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
        div1: 'Urban Heat',
        div1Text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis facilisis nibh, sed blandit ligula. Phasellus sodales sapien non tincidunt volutpat. Maecenas eu malesuada lacus. Pellentesque vitae velit vel elit varius tristique vel sit amet dolor. Fusce scelerisque metus odio, quis eleifend lorem interdum tempor. Etiam semper sit amet leo in pellentesque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
      }
    },

    methods: {
      onWaypoint ({el, going, direction}) {
        // going: in, out
        // direction: top, right, bottom, left
        if (going === this.$waypointMap.GOING_IN) {
          console.log('waypoint going in!', el.id)
        }

        if (direction === this.$waypointMap.DIRECTION_TOP) {
          console.log('waypoint going top!', el.id)
          //todo emit event with div id that map listens to as well
        }
      }
    }
  }
</script>

<style>


</style>
