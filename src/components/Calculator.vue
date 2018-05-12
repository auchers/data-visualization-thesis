<template>
  <div id="calculator">
    <header>Potential Benefit Calculator</header>
    <div>
      <neighborhood-search></neighborhood-search>
      <button class="get-features"
            v-on:click="featuresClick">Get Data In View</button>
    </div>
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
          <th>Heat Reduction
           <div> <div class="heat-reduction layer" v-on:click="addLayer" data-descr="click to see surface temperatures"></div> <p>(Avg. Temp Delta)</p></div>
          </th>
          <td class="heat-reduction" v-on:click="addLayer" >{{heatReductionWithinView.f.toFixed(2)}}˚F / {{heatReductionWithinView.c.toFixed(2)}}˚C </td>
        </tr>
       <tr>
          <th>Annual Stormwater Retention
            <div> <div class="stormwater layer" v-on:click="addLayer" data-descr="click for combined sewage overflows"></div><p>(# Gallons)</p></div>
          </th>
         <td class="stormwater" v-on:click="addLayer">{{formatNumber(stormwaterRetentionWithinView.toFixed(0))}} gallons
          <!--<p>({{formatLargeNumber(stormwaterRetentionWithinView/galPerBathtub)}} bathtubs)</p>-->
         </td>
       </tr>
        </tr>
        <tr>
          <th>Potential Habitat
            <div> <div class="habitat layer" v-on:click="addLayer" data-descr="click to see HR layer"></div><p>(Square Feet)</p></div>
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
        },
    featuresClick(){
        bus.$emit('features-click');
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

  th > p, th > div > p{
    margin-left: 1em;

  }

  /*th.heat-reduction, th.stormwater, th.habitat{*/
  .layer{
    width: 5px;
    height: 1.5em;
    position: absolute;
    z-index: 1;
    display: inline-block;
    transition: width 2s;
    overflow: hidden;
    text-overflow: unset;
    vertical-align: text-top;
    font-size: smaller;
  }

  /*th.heat-reduction:hover, th.stormwater:hover, th.habitat:hover{*/
  .layer:hover{
    width: 50%;
    opacity: 1;
  }

  .layer:hover::after{
    padding: 1em;
    content: attr(data-descr);
    line-height: 1.5em;
    color: white;
  }

  .heat-reduction.layer{
    background: rgb(202, 91, 77);
    /*opacity: 0.6;*/
  }

  .stormwater.layer{
    background: rgb(28, 124, 178);
    /*opacity: 0.6;*/
  }

  .habitat.layer{
    background: rgb(3, 166, 1);
    /*opacity: 0.6;*/
  }

  .autocomplete{
    width: 50%;
    display: inline-block;
  }

  .get-features{
    display: inline-block;
    margin-left: 2em;
    width: 40%;
    /*width: auto;*/
  }
</style>
