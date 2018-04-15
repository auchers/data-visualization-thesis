<template>
  <div id="right-panel"></div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';

  export default {
    name: 'RightPanel',
    data () {
      return {
        msg: 'This is the Map Component'
      }
    },
    mounted(){

    }
  }
</script>

<style>
  #right-panel{
    background-color: rgb(222, 218, 213);
  }
</style>
