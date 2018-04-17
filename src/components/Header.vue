<template>
  <div id="header">
    <h1>{{title}}</h1>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';

  export default {
    name: 'Header',
    data () {
      return {
        title: 'Exploring the Potential of Green Roofs in NYC'
      }
    },
    mounted(){

    }
  }
</script>

<style>

  #header {
    text-align: left;
    padding-left: 1rem;
  }

</style>
