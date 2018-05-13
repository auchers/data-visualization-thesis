<template>
  <div class="footer-header">
    <div class="footer-container">
      <!--<span v-for="(b, i) in boroughs">-->
      <el-button class="borough" v-for="(b, i) in boroughs"
         v-bind:class="{active: isActive[i]}" v-bind:key="i" v-on:click="selectBorough(b.options)">
        {{b.name}}
      </el-button>
      <!--<div class="arrow" v-if="i < sections.length-1"> > </div>-->
      <!--</span>-->
    </div>
  </div>
</template>

<script>
  import {bus} from '../main'

  export default {
    name: 'Footer',
    components: {},
    data() {
      return {
        activeEl: '',
        boroughs: [{
          name: 'Manhattan',
          options: {center: [-73.9943,40.7355], zoom: 13}
        },
          {
            name: 'Brooklyn',
            options: {center: [-73.9983067, 40.6440522], zoom: 13}
          },
          {
            name: 'Queens',
            options: {center: [-73.9376276, 40.6684709], zoom: 13}
          },
          {
            name: 'The Bronx',
            options: {center: [-73.9111459, 40.8517686], zoom: 13}
          },
          {
            name: 'Staten Island',
            options: {center: [-74.2170304, 40.5647148], zoom: 13}
          }
          ],
      }
    },
    computed: {
      isActive (){ //todo make all 3.s light up when third is active
        return this.boroughs.map( x => {return (x.scrollToEl === this.activeEl)})
      }
    },
    methods: {
      selectBorough (center){
        // console.log(center)
        bus.$emit('borough-select', center)
      }
    }
  }

</script>

<style>
  .footer-container{
    position: fixed;
    bottom: 1em;
    z-index:5;
  }

  .el-button.borough{
    padding: 0.5em;
    margin-right: 0.5em;
    color: rgba(63, 63, 63, 0.7);
  }

  .el-button.borough:focus, .el-button.borough:hover {
    color: rgba(63, 63, 63, 0.8);
    border-color: unset;
    /*background-color: #e9e9e9;*/
    background-color: unset;
  }
</style>
