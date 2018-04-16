<template>
  <div id="right-panel">
    <h2>{{msg}}</h2>
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
        msg: 'This is the Right Panel Component'
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

  #right-panel > h2 {
    margin: 0;
    line-height: 95%;
  }


</style>
