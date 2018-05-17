<template>
  <div class="container">
    <slot name="map"></slot>
    <div class="right-panel">
      <slot name="navBar"></slot>
      <slot name="intro">
        <story-section>
          <header slot="header">{{header}}</header>
          <p slot="text">{{div1Text}}</p>
        </story-section>
      </slot>
        <main>
          <slot name="main"></slot>
        </main>
      <slot name="footer" class="footer"></slot>
    </div>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';
  import Vue from 'vue';
  import VueWaypoint from 'vue-waypoint';
  import Histogram from "./Histogram";
  import StorySection from './StorySection'

  Vue.use(VueWaypoint);

  export default {
    name: 'RightPanel',
    components: {Histogram, StorySection},
    data() {
      return {
        header: "Example Header",
        div1Text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae nulla maximus magna fermentum condimentum eget non massa. Proin auctor nisi molestie velit lobortis vestibulum. Sed efficitur suscipit lorem sed aliquet. In vulputate, odio nec eleifend iaculis, metus leo sodales magna, eget tincidunt massa erat sit amet justo. In mollis enim at aliquam posuere. Nulla finibus sed quam eget bibendum. Aliquam quis ultricies mi. Cras nec molestie tellus. Donec ac interdum ex. Quisque vel ipsum vel lectus auctor lobortis. Proin nec scelerisque turpis. Vestibulum felis lectus, tempor vitae nulla non, mollis eleifend libero. Nam quam sem, tempus semper egestas ut, dictum vel purus. Suspendisse eu eros libero. Vivamus faucibus ligula sit amet mi vestibulum, a iaculis nulla aliquet.",
      }
    },

    methods: {
    },
  }

</script>

<style>
  .container{
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-auto-rows: auto;
  }

  .right-panel{
    padding: 1em;
  }

  .navBar, .footer{
    max-width: 500px;
    margin: 0 auto;
  }

</style>
