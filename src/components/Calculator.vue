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
          <td>{{heatReductionWithinView.c.toFixed(2)}}˚C / {{heatReductionWithinView.f.toFixed(2)}}˚F</td>
        </tr>
       <tr>
          <th>StormWater Retention (# Gallons)</th>
        </tr>
        <tr>
          <th>Square Area of Eligible Roof Space</th>
          <td>{{Math.round(summary.gr.area)}}</td>
        </tr>
        <tr>
          <th>Number of Buildings</th>
          <td>{{summary.gr.count}}</td>
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
        summary () {
          return this.$store.getters.getSummary
        },
        heatReductionWithinView () {
          let sum = this.$store.getters.getSummary
          let noGreen = ((sum.total.low * 33)
            + (sum.total.mid * 32)
            + (sum.total.high * 31)) / sum.total.area;
          let withGreen = ((sum.gr.area * 29)
            + (sum.gr.low * 33)
            + (sum.gr.mid * 32)
            + (sum.gr.high * 31)) / sum.total.area;
          let diff = noGreen-withGreen

          return {c: diff, f: (diff * (9/5))};
        },
      stormwaterRetentionWithinView () {

      }
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
