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

  import Map from "./Map";
  import {bus} from '../main'
  import Header from "./Header";
  import RightPanel from "./RightPannel"

  export default {
    name: 'MainContent',
    components: {RightPanel, Header, Map},

    mounted(){
    }


  }
</script>

<style>

  #grid-wrapper {
    /*position: fixed;*/
    /*top: 0;*/
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 100vh;
    margin: 1rem;
  }
</style>
