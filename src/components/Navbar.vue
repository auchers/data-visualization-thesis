<template>
  <div class="nav-header">
    <div class="nav-container">
      <span class="nav-section">Intro</span>
      <span class="nav-section">Section2</span>
      <span class="nav-section">Section3</span>
      <span class="nav-section">Section4</span>
    </div>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';
  import Vue from 'vue';

  export default {
    name: 'NavBar',
    components: {},
    data() {
      return {
      }
    },
    methods: {

    }
  }

</script>

<style>
.nav-header{
  position: fixed;
  top: 1em;
}
</style>
