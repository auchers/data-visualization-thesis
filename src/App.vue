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

  @import url('https://fonts.googleapis.com/css?family=Catamaran:500,700|Lora');

  #app {
    box-sizing: border-box;
    font-family: 'Lora', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    height: 100%;
  }

  h1, h2, header{
    font-family: 'Lora', serif;
    font-weight: 500;
    font-size: 3em;
    line-height: 1em;
    /*padding-left: 40px;*/
  }

  p, table{
    font-family: 'Lora', serif;
    font-weight:500;
    line-height: 1.4em;
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
    font-family: 'Catamaran', sans-serif;
    font-weight: 700;
  }

  button {
    display: block;
    margin-top: 1em;
    padding: .5em;
    /*width: 150px;*/
    font-family: 'Catamaran', sans-serif;
    font-weight: 500;
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

  button.el-button{
    padding: 0.5em;
    margin-right: 0.5em;
    color: rgba(63, 63, 63, 0.7);
  }

  button.el-button:focus, button.el-button:hover {
    color: rgba(63, 63, 63, 0.8);
    border-color: unset;
    /*background-color: #e9e9e9;*/
    background-color: unset;
  }

  td p, th p{
    /*margin-top: .2em;*/
    margin-top: .5em;
    font-size: smaller;
  }

  thead th {
    font-size: larger;
  }

  @media only screen and (max-width: 400px) {
    .container{
      grid-template-columns: 100%;
      grid-template-rows: 50vh 50vh;
      position: fixed;
      top: 0;
    }

    .right-panel{
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      background-color: white;
      z-index: 1;
      position:relative;
      top:50%;
    }

    #mapbox{
      height: 50vh;
    }

    .analysis{
      min-height: unset;
    }

    div{
      /*background-color: white;*/
    }
  }
</style>
