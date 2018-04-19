<template>
  <div id="calculator">
    <header>Benefit Calculator</header>
    <table>
      <thead>
        <tr>
          <th>Benefit</th>
          <th>Within View</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Heat Reduction (Avg. Temp Delta)</th>
        </tr>
       <tr>
          <th>StormWater Retention (# Gallons)</th>
        </tr>
        <tr>
          <th>Square Area of Eligible Roof Space</th>
          <td>{{Math.round(summary.total_area)}}</td>
        </tr>
        <tr>
          <th>Number of Buildings</th>
          <td>{{summary.cnt}}</td>
        </tr>
        <tr>
          <th>Cost</th>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';

  export default {
    name: 'Calculator',
    data () {
      return {
      }
    },
    computed: {
        summary: function () {
          return this.$store.getters.getSummary},
      },
    methods:{

      },
  }
</script>

<style>
  #histogram{
    height: 50vh;
    display: flex;
    flex-flow: column;
    margin-bottom: 1em;
  }

  svg{
    flex: 1 1 auto;
    overflow: visible;
  }

  table{
    max-width: unset;
    overflow: visible;
    text-align: left;
  }

  th, tr, td{
    padding: 10px;
  }

  thead{
    text-align: center;
  }
</style>
