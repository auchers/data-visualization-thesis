<template>
  <!--<h1>{{msg}}</h1>-->
  <div id="mapbox"></div>
</template>

<script>
import {bus} from '../main'
import mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';
import _ from 'lodash';

import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';

import mapStyles from '../assets/mapStyles';
import mainText from '../assets/mainText';

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

    this.map = new mapboxgl.Map(mapStyles.styles.initial);

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
      // building extrusions
      map.addLayer(mapStyles.layers.building_extrusions);

      // building footprints
      map.addLayer(mapStyles.layers.full_green_roof_potential, self.labelLayerId);

      // existing green roofs
      map.addLayer(mapStyles.layers.existing_green_roofs);
    })

    bus.$on('waypoint', obj => { //TODO: research style transitions
      if (obj.direction){ // rule out events triggered by page load
        if (obj.el){ // if within narrative

          if (obj.el === "0"){ // Change pitch remove styles
            if (obj.direction === "top") {
              map.easeTo({"pitch": 0, "speed": 0.001});
              map.setLayoutProperty(mapStyles.layers.full_green_roof_potential.id, 'visibility', 'none')
              map.setLayoutProperty(mapStyles.layers.existing_green_roofs.id, 'visibility', 'none')
              map.setLayoutProperty(mapStyles.layers.building_extrusions.id, 'visibility', 'visible')
            } else map.setFilter(mapStyles.layers.building_extrusions.id, mainText[obj.el].filter)
          } else if (obj.el === "1"){ // FILTER 1 -- remove height
            if (obj.direction === "top"){
              // let filter =  ["all",
              //   ["has", "shape_area"],
              //   ["<=", "heightroof", 200]
              // ];
              map.setFilter(mapStyles.layers.building_extrusions.id, mainText[obj.el].filter)
            }
          } else if (obj.el === "2"){ // FILTER 2 -- log of area
            if (obj.direction === "top"){
              let filter =  ["all",
                ["has", "shape_area"],
                ["<=", "heightroof", 200],
                [">=", "shape_area", 10000]
              ];
              map.setFilter(mapStyles.layers.building_extrusions.id, filter)
            }
          } else if (obj.el === "3"){ // FILTER 2 -- log of area
              map.on('click', self.getFeaturesInView);
          }

        } else {
          map.easeTo({"pitch": mapStyles.styles.initial.pitch, "speed": 0.1})
          map.setLayoutProperty(mapStyles.layers.building_extrusions.id, 'visibility', 'none')
          map.setLayoutProperty(mapStyles.layers.full_green_roof_potential.id, 'visibility', 'visible')
          map.setLayoutProperty(mapStyles.layers.existing_green_roofs.id, 'visibility', 'visible')
        }
      }
    });

    // receive event for neighborhood selection and fly there
    bus.$on('neighborhood-select', payload => {
      // let filter =  ["all",
      //   ["has", "shape_area"],
      //   ["<=", "heightroof", 200],
      //   [">=", "shape_area", 10000],
      //   ["==", "NTACode", payload.NTACode]
      // ];
      // map.setFilter(mapStyles.layers.building_extrusions.id, filter)
      map.flyTo({center: payload.center, zoom: 14, speed: .5})
      self.getFeaturesInView();
    })
  },
  methods:{
    getFeaturesInView: function (e){
        // TODO: deal with duplicate buildinds"
        let options = { layers: ['3d-buildings'] };
        let features = this.map.queryRenderedFeatures(options);
        features = _.uniqBy(features, 'properties.doitt_id');
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
