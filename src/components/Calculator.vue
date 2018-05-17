<template>
  <div id="calculator">
    <header>Potential Benefit Calculator</header>
    <p>Press the <em class="explore-potential" v-on:click="featuresClick">'Explore Potential'</em> button below to pull data in from the eligible buildings within view and see what benefits may be possible. For more information about methodology click <a href="https://github.com/auchers/data-visualization-thesis#methodology">here</a>.</p>
    <table>
      <thead>
        <tr>
          <th>Benefit</th>
          <th>Within View</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Eligible Roof Space
            <p>(Square Feet)</p>
          </th>
          <td v-if="summary">{{formatNumber(Math.round(summary.gr.area))}} ft<sup>2</sup>
            <p>({{((summary.gr.area)/centralPark).toFixed(2)}} Central Parks)</p>
          </td>
        </tr>
        <tr>
          <th>Eligible Building
            <p>(Count)</p>
          </th>
          <td v-if="summary">{{summary.gr.count}}</td>
        </tr>
        <tr v-for="(t, i) in text" v-bind:class="t.className" v-on:click.stop="addLayer" v-on:mouseover="mouseOver(i)" v-on:mouseleave="mouseLeave(i)">
          <th v-bind:class="t.className" >
            {{t.header}}
            <div>
              <div v-bind:class="[t.className, ' layer', {wide : sectionIsActive[i]} ]" v-bind:data-descr="t.dataDescription"></div>
              <p v-bind:class="t.className">{{t.unit}}</p>
            </div>
          </th>
          <td v-if="summary" v-html="t.value">
          </td>
        </tr>
      </tbody>
    </table>
    <div>
      <el-button class="get-features"
                 v-on:click="featuresClick">Explore Potential</el-button>
    </div>
    <!--<neighborhood-search></neighborhood-search>-->
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';
  import Vue from 'vue';

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
        galPerBathtub: 50,
        sectionIsActive: [false, false, false],
        headerText: {

        }
      }
    },
    computed: {
        summary () {
          return this.$store.getters.getSummary
        },
        heatReductionWithinView () {
          if (this.summary){
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
          }
        },
      stormwaterRetentionWithinView () {
        let sum = this.$store.getters.getSummary
        return sum.gr.area * this.roofEfficiency * this.gallonsPerSqFoot * this.avgAnnualRainfall
      },
      text(){
        return [{
          header: "Heat Reduction",
          unit: "(Avg. Temp Delta)",
          active: false,
          className: "heat-reduction",
          dataDescription: "click to see surface temperatures",
          value: (this.summary) ? this.heatReductionWithinView.f.toFixed(2) + '˚F / '+
          this.heatReductionWithinView.c.toFixed(2) + '˚C' : '--'
        },
          {
            header: "Annual Stormwater Retention",
            unit: "(# Gallons)",
            active: false,
            className: "stormwater",
            dataDescription: "click for combined sewage overflows",
            value: (this.summary) ? this.formatNumber(this.stormwaterRetentionWithinView.toFixed(0)) : '--'
          },
          {
            header: "Potential Habitat",
            unit: "(Square Feet)",
            active: false,
            className: "habitat",
            dataDescription: "click to see satellite map",
            value: (this.summary) ? this.formatNumber(Math.round(this.summary.gr.area * this.roofEfficiency)) +  'ft <sup>2</sup> <p>(' + ((this.summary.gr.area * this.roofEfficiency)/this.centralPark).toFixed(2) + ' Central Parks)</p>' : '--'
          },
        ]}
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
      bus.$emit('add-layer', event.toElement.classList[0])
        },
    featuresClick(){
        bus.$emit('features-click');
      },
      mouseOver(i){
          Vue.set(this.sectionIsActive, i, true)
      },
      mouseLeave(i){
        Vue.set(this.sectionIsActive, i, false)
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

  .wide.layer{
    width: 50%;
    opacity: 1;
  }

  .wide.layer::after{
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
    margin-top: 1em;
    width: 40%;
    /*width: auto;*/
  }

  .explore-potential{
    cursor: pointer;
    opacity: 0.7;
  }

  .explore-potential:hover{
    cursor: pointer;
    opacity: 1;
  }
</style>
