<template>
  <div class="nav-header">
    <div class="nav-container">
      <span v-for="(s, i) in sections">
      <a class="nav-section"
           v-bind:class="{active: isActive[i]}"
            href="#" v-scroll-to="'.' + s.scrollToEl"
            v-bind:title="s.hoverText">
        {{s.title}}
      </a>
      <div class="arrow" v-if="i < sections.length-1"> > </div>
      </span>
    </div>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';
  import Vue from 'vue';
  import VueScrollTo from 'vue-scrollto'

  Vue.use(VueScrollTo, {
    container: "body",
      duration: 500,
      easing: "ease-in",
      offset: 0,
      cancelable: true,
      onStart: false,
      onDone: false,
      onCancel: false,
      x: false,
      y: true
  });

  export default {
    name: 'NavBar',
    components: {},
    data() {
      return {
        activeEl: '',
        sections: [{
          title: ' 1 ',
          hoverText: 'Introduction',
          scrollToEl: 'introduction'
        },
          {
            title: ' 2 ',
            hoverText: 'Existing Infrastructure',
            scrollToEl: 's0'
          },
          {
            title: ' 3.1 ',
            hoverText: 'Determining Eligibility: Weight Bearing Capacity',
            scrollToEl: 's1'
          },
          {
            title: ' 3.2 ',
            hoverText: 'Determining Eligibility: Available Roof Area',
            scrollToEl: 's2'
          },
          {
            title: ' 3.3 ',
            hoverText: 'Determining Eligibility: Building Height',
            scrollToEl: 's3'
          },
          {
            title: ' 4 ',
            hoverText: 'Existing Green Roofs',
            scrollToEl: 's4'
          },
          {
            title: ' 5 ',
            hoverText: 'Calculate Potential benefits',
            scrollToEl: 'analysis'
          },
          {
            title: ' 6 ',
            hoverText: 'Conclusion',
            scrollToEl: 'conclusion'
          }
        ],
      }
    },
    computed: {
      isActive (){ //todo make all 3.s light up when third is active
        return this.sections.map( x => {return (x.scrollToEl === this.activeEl)})
      }
    },
    mounted(){
      bus.$on('waypoint', obj => {
        this.activeEl = obj.el
      })
    },
    methods: {
    }
  }

</script>

<style>
  .nav-header{
    position: fixed;
    top: 1em;
    z-index:5;
  }

  .nav-container{

  }

  .nav-container * {
    display: inline-block;
  }

  .nav-section{
    border-top: gray solid 2px;
    opacity: .5;
    width: 1.5em;
    height: 1em;
    margin-left: .5rem;

  }

  .nav-section.active, .nav-section:hover{
    border-top-color: green;
    opacity: .7;
  }

  .arrow{
    text-decoration: none;
    opacity: 0;
    margin: 0;
  }
</style>
