<template>
<router-view></router-view>
</template>

<script>

import {bus} from './main'

export default {
  name: 'App',
}
</script>

<style>
  #app {
    font-family: Avenir, Serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
  }

  h1, h2, header{
    font-family: 'Century', serif;
    font-weight: 500;
    font-size: 3em;
    line-height: 1em;
    /*padding-left: 40px;*/
  }

  p, table{
    font-family: "Century", sans-serif;
    font-weight:500;
  }

</style>
