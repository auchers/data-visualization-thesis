<template>
  <default-layout>
    <!--MAP in DEFAULT LAYOUT SLOT-->
    <Map slot="map"></Map>

    <div slot="intro" class="snap introduction">
      <!--TITLE PAGE only opens at beginning-->
      <el-dialog id="opening"
              :visible="isNewlyOpened"
              :fullscreen="true">
        <div class="landing-page-wrapper">
          <!--<Map></Map>-->
          <h1>{{title}}</h1>
          <h2>{{subtitle}}</h2>
          <button class="landing-page-button" v-on:click="enterVis">
            Click to Enter Visualization
          </button>
        </div>
      </el-dialog>

      <div slot="navBar" class="navBar" v-show="navActive">
        <NavBar></NavBar>
      </div>

      <!--BEGINNING OF SCROLLING STORY-->
      <story-section>
        <header slot="header"
                id="introduction"
                v-waypoint="{ active: true, callback: onWaypoint}">Envisioning a <br> New Urban Jungle
          <div class="subtitle">{{subtitle}}</div>
        </header>
        <p slot="text" v-html="'<span> '+ intro + '</span>'"></p>
      </story-section>
    </div>

    <!--MAIN BODY TEXT-->
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

      <!--ANALYSIS SECTION-->
      <story-section class="snap analysis">
        <header slot="header"
                id="analysis"
                v-waypoint="{ active: true, callback: onWaypoint}"></header>
        <div slot="text">
          <calculator></calculator>
          <button class="get-features"
            v-on:click="featuresClick">Click to Get Data on Buildings In View</button>
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
    components: {NavBar, Calculator, DefaultLayout, Map, Histogram, StorySection},
    data() {
      return {
        isNewlyOpened: true,
        navActive: false,
        title: "Envisioning a New Urban Jungle",
        subtitle: "Exploring the Potential of Green Roofs in NYC",
        intro: "This project explores the ways in which green roofs can help make our city more healthy, resilient, and beautiful. Dense urban centers like New York City face many ecological challenges due to the mostly paved and built-up nature of the landscape. These challenges, including stormwater management, urban heat mitigation, increased energy consumption, and loss of biodiversity are issues that green infrastructure projects are especially well suited to address. <p>Benefits of green roofs include:</p> " +
        "<ul>\n" +
        "<li>Reduce the <em>surface temperature</em> of the surrounding area</li>\n" +
        "<li>Capture <em>stormwater</em> and prevent it from overwhelming the city’s sewage system</li>\n" +
        "<li>Create more habitat for birds, bees, and seeds to encourage and increase <em>biodiversity </em></li>\n" +
        "<li>Save on building energy costs</li>\n" +
        "<li>Protect the integrity of the roof</li>\n" +
        "<li>Potentially even grow food</li>\n" +
        "</ul>\n" +
        "\n" +
        "Green roofs are a particularly exciting <em> way to utilize structures that already exist</em> in the city to bring about significant social and ecological benefits.\n",
        storyText: {}
      }
    },
    created(){
      this.storyText = storyText;
    },
    mounted(){
      // on refresh scroll to top
      window.onbeforeunload = function () {
        window.scrollTo(0,0);
      }
      // snap to all sections with class 'snap'
      $(function () {
        $.scrollify({
          section: ".snap",
          standardScrollElements: '#mapbox',
          updateHash: false,
        })
      })


    },

    methods: {
      onWaypoint ({el, going, direction}) {
        if (going === this.$waypointMap.GOING_IN) {
          console.log('waypoint going in!', el.id)

          // get number to be able to use for index in mainText.filters
          let i = parseInt(el.id.replace('s', ''))
          bus.$emit('waypoint', {el: el.id, i: i, direction: direction});

          // if after the first intro section
          (el.id && (el.id !== "introduction") && !this.isNewlyOpened) ? this.navActive = true : this.navActive = false;
        }
      },
      featuresClick(){
        bus.$emit('features-click');
      },
      enterVis(){
        this.isNewlyOpened = false;
        window.scrollTo(0,0);
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

  .landing-page-wrapper{
    box-sizing: border-box;
    color: black;
    width: 50vw;
    padding: 2em;
    position: relative;
    left: 50vw;
    background-color: rgba(252, 252, 252, 0.6);

  }

  .landing-page-button{
    position: fixed;
    bottom: 3rem;
    right: 3rem;
    color: black;
    border-top: black 3px solid;
    font-size: 1.25em;
    font-weight: bold;
    background-color: rgba(252, 252, 252, 0.6);
  }

  .landing-page-wrapper>h1{
    font-size: 6em;
  }

  .landing-page-wrapper>h2{
    font-size: 3em;
  }

  .el-dialog.is-fullscreen{
    background-image: url('../../assets/images/background.png');
    background-size: 100%;
  }

</style>
