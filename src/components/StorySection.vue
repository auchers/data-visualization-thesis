<template>
  <div class="story-wrapper">
    <div class="intro">
        <slot name="header">
          <header>{{header}}</header>
        </slot>
        <slot name="text">
          <p>{{div1Text}}
          </p>
        </slot>
    </div>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';
  import Vue from 'vue';
  import VueWaypoint from 'vue-waypoint';
  import Histogram from "./Histogram";

  Vue.use(VueWaypoint);

  export default {
    name: 'RightPanel',
    components: {Histogram},
    data() {
      return {
        header: "Example Header",
        div1Text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae nulla maximus magna fermentum condimentum eget non massa. Proin auctor nisi molestie velit lobortis vestibulum. Sed efficitur suscipit lorem sed aliquet. In vulputate, odio nec eleifend iaculis, metus leo sodales magna, eget tincidunt massa erat sit amet justo. In mollis enim at aliquam posuere. Nulla finibus sed quam eget bibendum. Aliquam quis ultricies mi. Cras nec molestie tellus. Donec ac interdum ex. Quisque vel ipsum vel lectus auctor lobortis. Proin nec scelerisque turpis. Vestibulum felis lectus, tempor vitae nulla non, mollis eleifend libero. Nam quam sem, tempus semper egestas ut, dictum vel purus. Suspendisse eu eros libero. Vivamus faucibus ligula sit amet mi vestibulum, a iaculis nulla aliquet.",
      }
    },

    methods: {
      mounted() {

      }
    }
  }

</script>

<style>
  .story-wrapper{
    min-height: 100vh;
    position: relative;
  }

  .intro{
    /*position: absolute;*/
    /*top: 35vh;*/
    padding-top: 4em;
    max-width: 500px;
    margin: 0 auto;
  }

</style>
