<template>
  <div class="container">
    <slot name="map"></slot>
    <div class="right-panel">
      <div class="white-space"></div>
        <header>
          <slot name="header">
            {{header}}
          </slot>
        </header>
        <main>
          <slot name="main"><p>{{div1Text}}</p></slot>
        </main>
      <div class="analysis">
        <slot name="analysis">
          <H2>Analysis: Histogram of Building Areas</H2>
          <Histogram></Histogram>
        </slot>
      </div>
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
  .container{
    display: grid;
    grid-template-columns: auto minmax(100px, 500px);
    grid-auto-rows: 200vh;
  }

  .right-panel{
    padding: 1em;
  }

  .white-space{
    height: 35vh;
  }

  header{
    font-size: 3em;
    padding-bottom: .5em;
  }

  .analysis{
    position: sticky;
    top: 100vh;
    padding-top: 2em;
  }


</style>
