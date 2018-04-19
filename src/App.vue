<template>
<router-view></router-view>
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
  @import url('https://fonts.googleapis.com/css?family=Crimson+Text');

  #app {
    font-family: Avenir, Serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
  }

  h1, h2, header{
    font-family: 'Electra LT Std', serif;
  }

  p{
    font-family: Avenir, sans-serif;
  }

</style>
