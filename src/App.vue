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
    box-sizing: border-box;
    font-family: Avenir, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
  }

  h1, h2, header{
    font-family: 'Century', "Times New Roman", serif;
    font-weight: 500;
    font-size: 3em;
    line-height: 1em;
    /*padding-left: 40px;*/
  }

  p, table{
    font-family: "Century", sans-serif;
    font-weight:500;
    line-height: 1.3em;
  }


  li{
    margin-bottom: .5em;
  }

  em{

    font-style: normal;
  }

  a, em, .dark-green {
    text-decoration: none;
    color: unset;
    font-family: Avenir;
    font-weight: bold;
  }

  button {
    display: block;
    margin-top: 1em;
    padding: .5em;
    /*width: 150px;*/
    font-family: Avenir;
    font-size: small;
    background: none;
    cursor: pointer;
    border:none;
    border-top: rgba(0, 0, 0, 0.5) 3px solid;
    /*border-top-color: green;*/
  }

  button:hover{
    /*border: rgba(0, 0, 0, 0.5) 0.5px solid;*/
    border-top-width: 5px;
  }

  button:focus {outline:0;}

  .dark-green{
    color: #31a354;
    opacity: 1;
  }

  .el-button{
    padding: 0.5em;
    margin-right: 0.5em;
    color: rgba(63, 63, 63, 0.7);
  }

  .el-button:focus, .el-button:hover {
    color: rgba(63, 63, 63, 0.8);
    border-color: unset;
    /*background-color: #e9e9e9;*/
    background-color: unset;
  }

</style>
