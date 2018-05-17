<template>
  <div>
    <p>
      I am extremely indebted to the Parsons MSDV faculty and cohort with special thanks to Daniel Sauter and Aaron Hill.</p>
    <p>
      This thesis was built and developed in close collaboration with the <a href="http://urbansystemslab.com">Urban Systems Lab</a>. Very special thanks go out to Timon McPhearson, Jaskirat Randhawa, Rocio Carrero, Rositsa Ilieva, and Jason Mandel.
    </p>

    <p>If you are interested in installing a green roof on your building, check out NYC DEP's <a href="http://www.nyc.gov/html/dep/html/stormwater/using_green_infra_to_manage_stormwater.shtml">Green Infrastructure Program</a>. </p>

    <p class="credits">Designed, researched, and developed by Aucher Serr — check out my <a href="https://github.com/auchers">github</a> and my other work <a href="https://www.aucherserr.com/">here</a>. </p>
  </div>
</template>

<script>
  import {bus} from '../main'
  import StorySection from './StorySection'

  export default {
    name: 'Conclusion',
    components: {StorySection},
    data() {
      return {

      }
    },
    computed: {

    },
    methods: {

    }
  }

</script>

<style>

  .credits{
    /*margin-top: 5em;*/
  }
</style>
