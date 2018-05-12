<template>
  <div id="opening">
    <!--<Map></Map>-->
    <div class="landing-page-wrapper">
      <h1>{{title}}</h1>
        <button class="landing-page-button">Enter the Visualization
        </button>
      <!--</div>-->
    </div>
  </div>
</template>

<script>

  import {bus} from '../../main'
  import Map from '../Map'

  export default {
    name: 'LandingPage',
    components: {Map},
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
  .landing-page-wrapper{
    padding: 1em;
    position: absolute;
    bottom: 1em;
  }

  .landing-page-wrapper > h1 {
    text-align: left;
    /*padding-left: 1rem;*/
    line-height: 20vh;
    font-size: 20vh;
    font-weight: lighter;
    max-width: 800px;
  }

  .buttons-container{
    position: absolute;
    right: 2em;
    margin-bottom: 2em;
  }

  .landing-page-button {
    height: 2em;
    padding: 2em;
    padding-left: 0;
    margin: 1em;
    bottom: 2em;
    /*cursor: ;*/
    background-color: unset;
    border-color: black;
  }

  .landing-page-button > a {
    /*vertical-align: middle;*/
    text-decoration: none;
    color: unset;
    font-size: 1.5em;
    position: relative;
    bottom: 1em;
    /*cursor: zoom-in;*/
    text-align: left;
  }

</style>
