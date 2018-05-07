<template>

  <div class="autocomplete">
    <autocomplete
      :source="neighborhoods"
      resultsDisplay="NTAName"
      placeholder="Search Your Neighborhood"
      name="neighborhood"
      @selected="handleNeighborhoodSelect"
    >
    </autocomplete>
  </div>
</template>

<script>
  import {bus} from '../main'
  import Vue from 'vue';

  import neighborhoodMapping from '../assets/neighborhoodMapping'


  import Autocomplete from 'vuejs-auto-complete'
  import StorySection from './StorySection'

  export default {
    name: 'NeighborhoodSearch',
    components: {Autocomplete, StorySection},
    data() {
      return {
        neighborhoods: []
      }
    },
    created(){
      this.neighborhoods = neighborhoodMapping;
    },
    methods: {
      handleNeighborhoodSelect (result) {
        // console.log(result)
        bus.$emit('neighborhood-select', result.selectedObject)
      }
    }
  }

</script>

<style>

  .autocomplete{
    margin-top: 1em;
  }

</style>
