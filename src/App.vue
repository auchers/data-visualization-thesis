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

  @media only screen and (max-width: 415px) {
    body > .container {
      grid-template-columns: auto;
      grid-template-rows: 50vh 50vh;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 0;
    }

    body .nav-header{
      top: 55vh;
      left: 1em;
    }

    .subtitle {
      font-size: .5em;
    }

    .right-panel {
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      background-color: white;
      z-index: 1;
      position: relative;
      top: 50%;
      border-top: rgba(131, 131, 131, 0.2) 1em solid;
    }

    .scroll-content{
      height: 101%;
    }

    body #mapbox {
      height: 50vh;
    }

    .analysis {
      min-height: unset;
    }

    div {
      /*background-color: white;*/
    }

    body .footer-container{
      top: 1em;
      bottom: unset;

    }

    .navBar, .footer{
      display: none;
    }

  }
  @media only screen and (max-width: 780px) {
    h1, h2, header{
      font-size: 2em;
      line-height: 1em;
    }

    p, table, span{
      line-height: 1.1rem;
      font-size: .9rem;
    }

    button.el-button{
      padding: 0.3em;
      margin-right: 0.5em;
      margin-top: .5em;
      color: rgba(63, 63, 63, 0.7);
    }

  }

  @media only screen and (min-width: 1900px){
    body .intro, body .navBar, body .footer{
      max-width: 35vw;
    }

    h1, h2, header{
      font-size: 4em;
      line-height: 1em;
    }

    p, table, span{
      line-height: unset;
      font-size: 1.5rem;
    }

  }
</style>
