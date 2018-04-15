<template>
  <div id="app">
    <Map/>
  </div>
</template>

<script>

import Map from "./components/Map";
import {bus} from './main'

export default {
  name: 'App',
  components: {Map},

  mounted(){
    bus.$on('clicked-map', (payload) => {
      console.log('payload: ', payload)
    })
  }


}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
