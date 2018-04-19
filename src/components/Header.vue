<template>
  <div id="header">
    <p>{{title}}</p>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';

  export default {
    name: 'Header',
    data () {
      return {
        title: 'Green Roofs in New York City'
      }
    },
    mounted(){

    }
  }
</script>

<style>
  #header{
    text-align: left;
    font-weight: bolder;
  }

  #header > p {
    opacity: .7;

  }

</style>
