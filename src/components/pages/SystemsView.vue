<template>
  <default-layout>
    <Map slot="map"></Map>

    <div slot="navBar" class="navBar" v-show="navActive">
      <NavBar></NavBar>
    </div>

    <div slot="intro" class="snap introduction">
      <story-section>
        <header slot="header"
                id="introduction"
                v-waypoint="{ active: true, callback: onWaypoint}">Envisioning a <br> New Urban Jungle
          <div class="subtitle">{{subtitle}}</div>
        </header>
        <p slot="text">{{intro}}</p>
      </story-section>
    </div>

    <div slot="main">

      <story-section v-for="(story, i) in storyText" class="snap"
        v-bind:key="i"
        v-bind:class="'s'+i">
        <header slot="header"
                v-bind:id="'s'+i"
                v-waypoint="{ active: true, callback: onWaypoint}">
          {{story.header}}
        </header>
        <p slot="text" v-html="'<span> '+ story.text + '</span>'"></p>
      </story-section>

      <story-section class="snap analysis">
        <header slot="header"
                id="analysis"
                v-waypoint="{ active: true, callback: onWaypoint}"></header>
        <div slot="text">
          <calculator></calculator>
          <button class="get-features"
            v-on:click="featuresClick">Click to Get Info on Buildings In View</button>
          <histogram></histogram>
        </div>
      </story-section>

    </div>

  </default-layout>
</template>

<script>
  import {bus} from '../../main'
  import Vue from 'vue';
  import VueWaypoint from 'vue-waypoint';
  import scrollify from 'jquery-scrollify';
  import $ from 'jquery'

  import DefaultLayout from '../DefaultLayout'
  import Map from '../Map'
  import Histogram from '../Histogram'
  import StorySection from '../StorySection'
  import Calculator from '../Calculator'

  import storyText from '../../assets/mainText'
  import NavBar from "../Navbar";


  Vue.use(VueWaypoint);

  export default {
    name: 'SystemsView',
    components: {NavBar, Calculator, DefaultLayout, Map, Histogram, StorySection, },
    data() {
      return {
        navActive: false,
        // title: "Envisioning a New Urban Jungle",
        subtitle: "Exploring the Potential of Green Roofs in NYC",
        intro: "This project explores the ways in which covering rooftops with vegetation can help make our city more healthy, resilient, and beautiful. Dense urban centers like New York City face many ecological challenges due to the predominantly paved and impermeable nature of the landscape. These challenges, including stormwater management, urban heat mitigation, increased energy consumption, and loss of biodiversity are issues that green infrastructure projects are especially well suited to address. As interest continues to coalesce around green infrastructure developments and their potential for tackling urban challenges, green roofs have emerged as a particularly exciting way to utilize structures that already exist in the city to bring about significant social and ecological benefits.",
        storyText: {}
      }
    },
    created(){
      this.storyText = storyText;
    },
    mounted(){
      // snap to all sections with class 'snap'
      $(function () {
        $.scrollify({
          section: ".snap",
          standardScrollElements: '#mapbox',
          updateHash: false,
        })
      })

      // on refresh scroll to top
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    },

    methods: {
      onWaypoint ({el, going, direction}) {
        if (going === this.$waypointMap.GOING_IN) {
          console.log('waypoint going in!', el.id)

          // get number to be able to use for index in mainText.filters
          let i = parseInt(el.id.replace('s', ''))
          bus.$emit('waypoint', {el: el.id, i: i, direction: direction});

          // if after the first intro section
          (el.id && (el.id !== "introduction")) ? this.navActive = true : this.navActive = false;
        }
      },
      featuresClick(){
        bus.$emit('features-click');
      }
    }
  }
</script>

<style>
  .subtitle{
    font-size: .4em;
    line-height: 1.2em;
    margin-top: .5em;
    margin-bottom: 1em;
    opacity: .6;
  }

  .introduction{
    margin-bottom: 1em;
  }

  .get-features{
    display: block;
    margin: 1em auto;
    padding: .5em;
    width: 150px;
    font-family: Avenir;
    font-size: small;
    background: none;
    cursor: pointer;
  }

  button:focus {outline:0;}

</style>
