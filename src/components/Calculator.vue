<template>
  <div id="calculator">
    <header>Potential Benefit Calculator</header>
    <neighborhood-search></neighborhood-search>
    <table v-if="summary">
      <thead>
        <tr>
          <th>Benefit</th>
          <th>Within View</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Eligible Roof Space
            <p>(Square Feet)</p>
          </th>
          <td>{{formatNumber(Math.round(summary.gr.area))}} ft<sup>2</sup>
            <p>({{((summary.gr.area)/centralPark).toFixed(2)}} Central Parks)</p>
          </td>
        </tr>
        <tr>
          <th>Eligible Building
            <p>(Count)</p>
          </th>
          <td>{{summary.gr.count}}</td>
        </tr>
        <tr>
          <th>Heat Reduction
            <p>(Avg. Temp Delta)</p>
          </th>
          <td>{{heatReductionWithinView.f.toFixed(2)}}˚F / {{heatReductionWithinView.c.toFixed(2)}}˚C </td>
        </tr>
       <tr>
          <th>Annual Stormwater Retention
            <p>(# Gallons)</p>
          </th>
         <td>{{formatNumber(stormwaterRetentionWithinView.toFixed(0))}} gallons
          <!--<p>({{formatLargeNumber(stormwaterRetentionWithinView/galPerBathtub)}} bathtubs)</p>-->
         </td>
       </tr>
        </tr>
        <tr>
          <th>Potential Habitat
            <p>(Square Feet)</p>
          </th>
          <td>{{formatNumber(Math.round(summary.gr.area * roofEfficiency))}} ft<sup>2</sup>
          <p>({{((summary.gr.area * roofEfficiency)/centralPark).toFixed(2)}} Central Parks)</p>
          </td>
        </tr>
        <!--<tr>-->
          <!--<th>Cost</th>-->
        <!--</tr>-->
      </tbody>
    </table>
    <p v-else> click anywhere on the map to get information on buildings within view</p>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';

  import NeighborhoodSearch from './NeighborhoodSearch'

  export default {
    name: 'Calculator',
    components: {NeighborhoodSearch},
    data () {
      return {
        roofEfficiency: 0.75,
        centralPark: 36721080,
        gallonsPerSqFoot: 0.47,
        avgAnnualRainfall: 49.6,
        galPerBathtub: 50
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
        let sum = this.$store.getters.getSummary
        return sum.gr.area * this.roofEfficiency * this.gallonsPerSqFoot * this.avgAnnualRainfall
      }
      },
    methods:{
        formatNumber(n) {
          let f = new Intl.NumberFormat()
          return f.format(n)
        },
      formatLargeNumber(n){
          if (n > 999999){
            return 'roughly ' + (n/1000000).toFixed(0) + ' million'
          } else if (n > 999) {
            return 'roughly ' + (n/1000).toFixed(0) + 'k'
          } else return n
      }
      },
  }
</script>

<style scoped>
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
    text-align: left;
  }

  p{
    /*margin-top: .2em;*/
    font-size: smaller;
  }

</style>
