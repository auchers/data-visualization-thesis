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
      filter: '',
    }
  },
  mounted(){
    var store = this.$store
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXVjaGVyIiwiYSI6ImNqODd4NnBndzFjZDQyd3FocnM4Njc2NWQifQ.dql4s6oWRANbYGt44i6n9A';

    let map = new mapboxgl.Map({
      style: 'mapbox://styles/aucher/cj87xa4nv3xb02ro4j9o2hatb',
      center: [-74.0066, 40.7135],
      zoom: 13,
      pitch: 60,
      bearing: 32.8,
      // hash: true,
      container: 'mapbox',
    });

    map.on('load', function(){
      // insert layers beneath any symbol layer
      let layers = map.getStyle().layers;

      let labelLayerId; // find the label layer to put on top
      for (var i = 0; i < layers.length; i++){
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']){
          labelLayerId = layers[i].id;
          break
        }
      }
      // building footprints
      map.addLayer(mapFilters.full_green_roof_potential, labelLayerId);

      // existing green roofs
      map.addLayer(mapFilters.existing_green_roofs);

      map.on('click', function (e) {
        // !! returns layer properties!!
        // let features = map.queryRenderedFeatures(e.point);

        // TODO: handle this: "Because features come from tiled vector data or GeoJSON data that is converted to tiles internally, feature geometries may be split or duplicated across tile boundaries"
        let options = { layers: ['green-roof-potential'] };
        let features = map.queryRenderedFeatures(options);

        // calculate histogram bins for features returned
        let bins = d3.histogram()
          .value(d => Math.log(d.properties.shape_area))
          (features);

        // get total counts and sums
        let summary_stats = features.reduce( (accum, feature) => {
          accum.cnt = accum.cnt + 1;
          accum.total_area = accum.total_area + feature.properties.shape_area;
          return accum
        }, {cnt: 0, total_area: 0});

        store.commit('storeSummary', summary_stats);
        store.commit('storeHistogramBins', bins);

      });

    })
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
