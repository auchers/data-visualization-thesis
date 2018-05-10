<template>
  <div id="calculator">
    <header>Potential Benefit Calculator</header>
    <neighborhood-search></neighborhood-search>
    <table v-if="summary">
      <thead>
        <tr>
          <th>Benefit</th>
          <th>Within View</th>
          <!--<th>Total</th>-->
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
          <th class="heat-reduction" v-on:click="addLayer">Heat Reduction
            <p>(Avg. Temp Delta)</p>
          </th>
          <td class="heat-reduction" v-on:click="addLayer" >{{heatReductionWithinView.f.toFixed(2)}}˚F / {{heatReductionWithinView.c.toFixed(2)}}˚C </td>
        </tr>
       <tr>
          <th class="stormwater" v-on:click="addLayer">Annual Stormwater Retention
            <p>(# Gallons)</p>
          </th>
         <td class="stormwater" v-on:click="addLayer">{{formatNumber(stormwaterRetentionWithinView.toFixed(0))}} gallons
          <!--<p>({{formatLargeNumber(stormwaterRetentionWithinView/galPerBathtub)}} bathtubs)</p>-->
         </td>
       </tr>
        </tr>
        <tr>
          <th class="habitat" v-on:click="addLayer">Potential Habitat
            <p>(Square Feet)</p>
          </th>
          <td class="habitat" v-on:click="addLayer">{{formatNumber(Math.round(summary.gr.area * roofEfficiency))}} ft<sup>2</sup>
          <p>({{((summary.gr.area * roofEfficiency)/centralPark).toFixed(2)}} Central Parks)</p>
          </td>
        </tr>
        <!--<tr>-->
          <!--<th>Cost</th>-->
        <!--</tr>-->
      </tbody>
    </table>
    <!--<p v-else> click anywhere on the map to get information on buildings within view</p>-->
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
      },
    addLayer(event){
      console.log(event.toElement.classList[0])
      bus.$emit('add-layer', event.toElement.classList[0])
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
    margin-top: 1em;
    width: 100%;
    overflow: visible;
    text-align:  left;
  }

  th, tr, td{
    padding-right: .5em;
    vertical-align: baseline;
  }

  thead > tr > th{
    padding-bottom: 1em;
  }

  thead{
    text-align: left;
  }

  p{
    /*margin-top: .2em;*/
    margin-top: .5em;
    font-size: smaller;
  }

  .heat-reduction, .stormwater, .habitat{
    border-top-width: 3px;
    border-top-style: solid;
    border-collapse: collapse;
  }

  .heat-reduction:hover, .stormwater:hover, .habitat:hover{
    border-top-width: 5px;
  }

  .heat-reduction{
    border-top-color: rgba(159, 15, 0, 0.6);
  }

  .stormwater{
    border-top-color: rgba(23, 73, 118, 0.6);
  }

  .habitat{
    border-top-color: rgba(3, 118, 1, 0.6);
  }

</style>
