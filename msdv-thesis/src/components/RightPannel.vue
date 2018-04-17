<template>
  <div id="right-panel">
      <h3>{{msg}}</h3>
      <Histogram/>
      <div class="scrollSection" id="div1"
           v-waypoint="{ active: true, callback: onWaypoint }">
        {{div1Text}}
      </div>
      <div class="scrollSection div2">{{div1Text}}</div>
      <div class="scrollSection div3">{{div1Text}}</div>
      <div class="scrollSection div4">{{div1Text}}</div>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';
  import Histogram from "./Histogram";
  import Vue from 'vue';
  import VueWaypoint from 'vue-waypoint';

  Vue.use(VueWaypoint);

  export default {
    name: 'RightPanel',
    components: {Histogram},
    data () {
      return {
        msg: 'Explore the Distribution of Roof Areas',
        div1Text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae nulla maximus magna fermentum condimentum eget non massa. Proin auctor nisi molestie velit lobortis vestibulum. Sed efficitur suscipit lorem sed aliquet. In vulputate, odio nec eleifend iaculis, metus leo sodales magna, eget tincidunt massa erat sit amet justo. In mollis enim at aliquam posuere. Nulla finibus sed quam eget bibendum. Aliquam quis ultricies mi. Cras nec molestie tellus. Donec ac interdum ex. Quisque vel ipsum vel lectus auctor lobortis. Proin nec scelerisque turpis. Vestibulum felis lectus, tempor vitae nulla non, mollis eleifend libero. Nam quam sem, tempus semper egestas ut, dictum vel purus. Suspendisse eu eros libero. Vivamus faucibus ligula sit amet mi vestibulum, a iaculis nulla aliquet.",
        div2Text: "",
        div3Text: "",
        div3Text: "",
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
    },

    mounted(){

    }
  }
</script>

<style>
  .scrollSection{
    height: 120vh;
  }

  #right-panel{
    /*background-color: rgb(222, 218, 213);*/
    padding: 0px 1em 0px 1em;
    text-align: left;
    overflow: scroll;
  }

  #right-panel > h3 {
    margin: 0;
    line-height: 95%;
  }

</style>
