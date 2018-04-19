<template>
  <div id="app">
    <div class="landing-page-wrapper">
      <h1>{{title}}</h1>
      <div class="buttons-container">
        Lenses:
        <button class="landing-page-button">
          <router-link to="/urban-heat">Urban Heat</router-link>
        </button>
        <button class="landing-page-button">
          <router-link to="/stormwater">Rainwater Retention</router-link>
        </button>
        <button class="landing-page-button">
          <router-link to="/systems">Combined - Systems View</router-link>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

  import {bus} from '../../main'

  export default {
    name: 'LandingPage',
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
    margin: 1em;
    bottom: 2em;
    cursor: zoom-in;
    background-color: unset;
    border-color: black;
  }

  .landing-page-button > a {
    vertical-align: middle;
    text-decoration: none;
    color: unset;
    font-size: 1.5em;
    position: relative;
    bottom: 1em;
    cursor: zoom-in;
  }


</style>
