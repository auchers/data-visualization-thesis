<template>
  <default-layout>
    <!--MAP in DEFAULT LAYOUT SLOT-->
    <Map slot="map"></Map>

    <div slot="intro" class="snap introduction">

      <!--NAVIGATION BAR-->
      <i class="icon el-icon-arrow-down" v-show="iconActive" v-on:click="scrollDown"></i>
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
          <!--<histogram></histogram>-->
        </div>
      </story-section>

      <story-section class="snap conclusion">
        <header slot="header"
                id="conclusion"
                v-waypoint="{ active: true, callback: onWaypoint}">Colophon</header>
        <Conclusion slot="text"></Conclusion>
      </story-section>
    <Footer slot="footer" class="footer" v-show="navActive"></Footer>
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
  import Footer from "../Footer";
  import Conclusion from "../Conclusion";


  Vue.use(VueWaypoint);

  export default {
    name: 'SystemsView',
    components: {Conclusion, Footer, NavBar, Calculator, DefaultLayout, Map, Histogram, StorySection},
    data() {
      return {
        // isNewlyOpened: true,
        navActive: false,
        title: "Envisioning a New Urban Jungle",
        subtitle: "Exploring the Potential of Green Roofs in NYC",
        intro: "This project explores the ways in which green roofs can help make our city more healthy, resilient, and beautiful. Dense urban centers like New York City face many ecological challenges due to the mostly paved and built-up nature of the landscape. These challenges, including stormwater management, urban heat mitigation, increased energy consumption, and loss of biodiversity are issues that green infrastructure projects are especially well suited to address. Green roofs are a particularly exciting way to utilize structures that already exist in the city to bring about significant social and ecological benefits.\n",
        storyText: {},
        iconActive: false,
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

      setTimeout(() => this.iconActive = true, 10000);

    },

    methods: {
      onWaypoint ({el, going, direction}) {
        if (going === this.$waypointMap.GOING_IN) {
          // console.log('waypoint going in!', el.id)

          // get number to be able to use for index in mainText.filters
          let i = parseInt(el.id.replace('s', ''))
          bus.$emit('waypoint', {el: el.id, i: i, direction: direction});

          // if after the first intro section
          (el.id && (el.id !== "introduction")) ? this.navActive = true : this.navActive = false;

          // if at conclusion, remove arrove
          (el.id === 'conclusion')? this.iconActive = false : this.iconActive = true;
        }
      },
      enterVis(){
        this.isNewlyOpened = false;
        window.scrollTo(0,0);
      },
      scrollDown(){
        $.scrollify.next()
      }
    }
  }
</script>

<style>
  .subtitle{
    font-size: .4em;
    line-height: 1.2em;
    margin-top: 1rem;
    margin-bottom: 1rem;
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

  .icon{
    position: fixed;
    bottom: 1em;
    right: 1em;
    font-size:1.5em;
    z-index: 11;
  }

  .el-icon-arrow-down:before{
    font-size: 2em;
    opacity: 0.6;
  }

  .el-icon-arrow-down:hover{
    cursor: pointer;
  }

</style>
