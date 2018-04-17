<template>
  <div id="app">
      <Header/>
    <div id="grid-wrapper">
      <Map/>
      <RightPanel/>
    </div>
  </div>
</template>

<script>

import Map from "./components/Map";
import {bus} from './main'
import Header from "./components/Header";
import RightPanel from "./components/RightPannel"

export default {
  name: 'App',
  components: {RightPanel, Header, Map},

  mounted(){

    // testing out event bus
    bus.$on('clicked-map', (payload) => {
      console.log('payload: ', payload)
    })
  }


}
</script>

<style>

  body{
   height: 100vh;
    background-color: rgb(242, 238, 232);
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
    height: 100%;
  }

  #grid-wrapper {
    position: fixed;
    top: 25%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 100vh;
    margin: 1rem;
  }
</style>
