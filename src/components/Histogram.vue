<template>
  <div id="histogram">
    <!--<p>{{msg}}</p>-->
    <svg ref="svg">
      <rect v-for="d in layout"
            class="bar"
            fill="#aaa"
            v-bind:y="d.y"
            v-bind:width="d.width"
            v-bind:height="d.height"
            v-bind:x="d.x">
      </rect>
    </svg>
  </div>
</template>

<script>
  import {bus} from '../main'
  import * as d3 from 'd3';

  export default {
    name: 'Histogram',
    // props: ['height'],
    data () {
      return {
        // msg: 'click anywhere on the map to see how the roof areas are distributed within your current view',
        width: null,
        height: null,
        x: null,
        y: null,
      }
    },
    computed: {
      bins: function () {return this.$store.getters.getHistogramBins},
      layout: function () {
        let binValues = Object.keys(this.bins).map(key => this.bins[key].x1);
        let lengths = Object.keys( this.bins ).map(key =>  this.bins[key].length);
        //
        this.x.domain([0, 15])
          .range([0, this.width]);
        //
        this.y.domain([0, d3.max(lengths)])
          .range([0, this.height, ]);

        let map = Object.keys( this.bins ).map((function(_this) {
            return function(key, i, bins) {
              let cur = _this.bins[key];
              return {
                x: _this.x(cur.x0),
                y: _this.y.range()[1] - _this.y(cur.length),
                width: _this.x(cur.x1) - _this.x(cur.x0),
                height: _this.y(cur.length)
              };
            };
          })(this));

        // console.log(map);
        return map;
      }
    },
    methods:{
      getStyle: function (bin){
        return {transform: `translate(${bin.x0}px, ${bin.x1}px)`};
      },
      getKey: function (bin){
        return '' + bin.x0;
      },

    },

    created(){
      this.x = d3.scaleLinear();
      this.y = d3.scaleLinear();

    },

    mounted(){
      // this.width = this.$refs.svg.getBoundingClientRect().width;
      // this.height = this.$refs.svg.getBoundingClientRect().height;

      this.width = this.$refs.svg.getBoundingClientRect().width;
      this.height = 150;
    }
  }
</script>

<style>
  #histogram{
    height: 50vh;
    display: flex;
    flex-flow: column;
    margin-bottom: 5em;
  }

  svg{
    margin-top: 1.5em;
    flex: 1 1 auto;
    overflow: visible;
  }
</style>
