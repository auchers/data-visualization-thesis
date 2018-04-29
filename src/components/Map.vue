<template>
  <!--<h1>{{msg}}</h1>-->
  <div id="mapbox"></div>
</template>

<script>
import {bus} from '../main'
import mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';

import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';

import mapFilters from '../assets/mapFilters';

export default {
  name: 'Map',
  data () {
    return {
      msg: 'This is the Map Component',
      layers: '',
      labelLayerId: '',
      map: {}
    }
  },
  mounted(){
    let self = this;
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXVjaGVyIiwiYSI6ImNqODd4NnBndzFjZDQyd3FocnM4Njc2NWQifQ.dql4s6oWRANbYGt44i6n9A';

    this.map = new mapboxgl.Map(mapFilters.styles.initial);
    let map = this.map;

    this.map.on('load', function(){
      // insert layers beneath any symbol layer
      self.layers = map.getStyle().layers;

      // let labelLayerId; // find the label layer to put on top
      for (var i = 0; i < self.layers.length; i++){
        if (self.layers[i].type === 'symbol' && self.layers[i].layout['text-field']){
          self.labelLayerId = self.layers[i].id;
          break
        }
      }
      // building footprints
      map.addLayer(mapFilters.layers.full_green_roof_potential, self.labelLayerId);

      // existing green roofs
      map.addLayer(mapFilters.layers.existing_green_roofs);
    })

    bus.$on('waypoint', obj => { //TODO: research style transitions
      if (obj.direction){ // rule out events triggered by page load
        if (obj.el){ // if within narrative

          if (obj.el === "0"){ // URBAN HEAT - remove map
            // if (obj.direction === "top") {
            //   this.layers.forEach(function(layer) {
            //      map.setLayoutProperty(layer.id, 'visibility', 'none')
            //   })
            // }
          } else if (obj.el === "1"){ // FILTER 1 -- remove height
            if (obj.direction === "top"){
              let filter =  ["all",
                ["has", "shape_area"],
                ["<=", "heightroof", 200]
              ];
              map.setFilter(mapFilters.layers.full_green_roof_potential.id, filter)
            }
          } else if (obj.el === "2"){ // FILTER 2 -- log of area
            if (obj.direction === "top"){
              let filter =  ["all",
                ["has", "shape_area"],
                ["<=", "heightroof", 200],
                [">=", "shape_area", 10000]
              ];
              map.setFilter(mapFilters.layers.full_green_roof_potential.id, filter)
            }
          } else if (obj.el === "4"){ // FILTER 2 -- log of area
              map.on('click', self.getFeaturesInView);
          }

        } else {
          this.layers.forEach(function(layer) {
            map.setLayoutProperty(layer.id, 'visibility', 'visible')
          })
        }
      }
    });
  },
  methods:{
    getFeaturesInView: function (e){
        // TODO: handle this: "Because features come from tiled vector data or GeoJSON data that is converted to tiles internally, feature geometries may be split or duplicated across tile boundaries"
        let options = { layers: ['full-green-roof-potential'] };
        let features = this.map.queryRenderedFeatures(options);

        // calculate histogram bins for features returned
        let bins = d3.histogram()
          .value(d => Math.log(d.properties.shape_area))
          (features);

        console.log(features);

        // get total counts and sums
        let summary_stats = features.reduce( (accum, feature) => {
          accum.cnt = accum.cnt + 1;
          accum.total_area = accum.total_area + feature.properties.shape_area;
          return accum
        }, {cnt: 0, total_area: 0});

        this.$store.commit('storeSummary', summary_stats);
        this.$store.commit('storeHistogramBins', bins);
    }
  }
}
</script>

<style>

  #mapbox{
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
  }

  canvas.mapboxgl-canvas{
    position: unset !important;
    width: 100% !important;
  }
</style>

// // extrusions
// map.addLayer({
//   'id': '3d-buildings',
//   'source': 'composite',
//   'source-layer': 'building',
//   'filter': ['==', 'extrude', 'true'],
//   'type': 'fill-extrusion',
//   'minzoom': 14,
//   'paint':{
//     'fill-extrusion-color': '#aaa',
//     'fill-extrusion-height': [
//       "interpolate", ["linear"], ["zoom"],
//       15, 0,
//       15.05, ["get", 'height']
//     ],
//     'fill-extrusion-base': [
//       "interpolate", ["linear"], ["zoom"],
//       15, 0,
//       15.05, ["get", "min_height"]
//     ],
//     'fill-extrusion-opacity': .6
//   }
// },
//   labelLayerId); // adds the layer label on top so that visible above extrusions
// },
