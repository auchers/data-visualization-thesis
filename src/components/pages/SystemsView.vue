<template>
  <default-header>
    <Map slot="map"></Map>
    <div slot="navBar" v-show="navActive">
      <NavBar></NavBar>
    </div>
    <div slot="intro"  class="snap">
      <story-section>
        <header slot="header"
                v-waypoint="{ active: true, callback: onWaypoint}">
          {{title}}
        </header>
        <p slot="text">{{intro}}</p>
      </story-section>
    </div>

    <div slot="main">

      <story-section v-for="(story, i) in storyText" class="snap"
        v-bind:key="i">
        <header slot="header"
                v-bind:id="'s'+i"
                v-waypoint="{ active: true, callback: onWaypoint}">
          {{story.header}}
        </header>
        <p slot="text">
          {{story.text}}
        </p>
      </story-section>

    </div>
    <div slot="analysis">
      <story-section class="snap">
        <header slot="header" id="analysis" v-waypoint="{ active: true, callback: onWaypoint}"></header>
        <div slot="text">
          <calculator></calculator>
          <autocomplete
            :source="neighborhoods"
            resultsDisplay="NTAName"
            placeholder="Search Your Neighborhood"
            name="neighborhood"
            @selected="handleNeighborhoodSelect"
          >
          </autocomplete>
          <histogram></histogram>
        </div>
      </story-section>

    </div>

  </default-header>
</template>

<script>
  import {bus} from '../../main'
  import Vue from 'vue';
  import VueWaypoint from 'vue-waypoint';
  import scrollify from 'jquery-scrollify';
  import $ from 'jquery'

  import DefaultHeader from '../DefaultLayout'
  import Map from '../Map'
  import Histogram from '../Histogram'
  import StorySection from '../StorySection'
  import Calculator from '../Calculator'
  import Autocomplete from 'vuejs-auto-complete'

  import storyText from '../../assets/mainText'
  import neighborhoodMapping from '../../assets/neighborhoodMapping'
  import NavBar from "../Navbar";

  Vue.use(VueWaypoint);

  export default {
    name: 'SystemsView',
    components: {NavBar, Calculator, DefaultHeader, Map, Histogram, StorySection, Autocomplete},
    data() {
      return {
        navActive: false,
        title: "Exploring the Potential of Green Roofs in NYC",
        intro: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent quis facilisis nibh, sed blandit ligula. Phasellus sodales sapien non tincidunt volutpat. Maecenas eu malesuada lacus. Pellentesque vitae velit vel elit varius tristique vel sit amet dolor. Fusce scelerisque metus odio, quis eleifend lorem interdum tempor. Etiam semper sit amet leo in pellentesque. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
        storyText: {}
      }
    },
    created(){
      this.storyText = storyText;
      this.neighborhoods = neighborhoodMapping;
    },
    mounted(){
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      $(function () {
        $.scrollify({
          section: ".snap"
        })
      })
    },

    methods: {
      onWaypoint ({el, going, direction}) {
        if (going === this.$waypointMap.GOING_IN) {
          console.log('waypoint going in!', el.id)
          let i = parseInt(el.id.replace('s', ''))
          bus.$emit('waypoint', {el: el.id, i: i, direction: direction});
          if (el.id){ // if after the first intro section
            this.navActive = true;
          } else this.navActive = false;
        }
      },
      handleNeighborhoodSelect (result) {
        // console.log(result)
        bus.$emit('neighborhood-select', result.selectedObject)
      }
    }
  }
</script>

<style>


</style>
