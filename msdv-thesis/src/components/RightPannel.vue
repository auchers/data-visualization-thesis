<template>
  <div id="right-panel">
    <h3>{{msg}}</h3>
    <Histogram/>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';
  import Histogram from "./Histogram";

  export default {
    name: 'RightPanel',
    components: {Histogram},
    data () {
      return {
        msg: 'Explore the Distribution of Roof Areas'
      }
    },
    mounted(){

    }
  }
</script>

<style>
  #right-panel{
    /*background-color: rgb(222, 218, 213);*/
    padding: 0px 1em 0px 1em;
    text-align: left;
  }

  #right-panel > h3 {
    margin: 0;
    line-height: 95%;
  }


</style>
