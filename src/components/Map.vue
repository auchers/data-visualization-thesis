<template>
  <!--<h1>{{msg}}</h1>-->
  <div id="mapbox"></div>
</template>

<script>
import {bus} from '../main'
import mapboxgl from 'mapbox-gl';
import * as d3 from 'd3';
import _ from 'lodash';
import VueResize from 'vue-resize';

import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';

import mapStyles from '../assets/mapStyles';
import mainText from '../assets/mainText';

let tns_coords= [-73.9943,40.7355];

export default {
  name: 'Map',
  components:{},
  data () {
    return {
      msg: 'This is the Map Component',
      layers: '',
      labelLayerId: '',
      map: {},
      // isLayerActive: {"heat-reduction": false, "stormwater": false, "habitat": false},
      // containerWidth: 0,
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

    bus.$on('waypoint', obj => {
      if (obj.direction){ // rule out events triggered by page load
        if (obj.el !== "introduction"){ // if within narrative

          if (obj.el === "s0"){ // EXISTING INFRASTRUCTURE - Change pitch remove styles
            if (obj.direction === "top") {
              map.easeTo({"pitch": 0, "speed": 0.02, center: tns_coords});
              map.setPaintProperty(mapStyles.layers.full_green_roof_potential.id, "fill-opacity", 0)
              map.setLayoutProperty(mapStyles.layers.existing_green_roofs.id, 'visibility', 'none')
              map.setPaintProperty(mapStyles.layers.building_extrusions.id, "fill-extrusion-opacity", .8)

            } else if (obj.direction === "bottom") {
              map.setFilter(mapStyles.layers.building_extrusions.id, mainText[obj.i].filter)
            }

          } else if (obj.el === "s1"){ // FILTER 1 -- Weight Bearing Capacity
              map.setFilter(mapStyles.layers.building_extrusions.id, mainText[obj.i].filter)

          } else if (obj.el === "s2"){ // FILTER 2 -- Available Roof Area
              map.setFilter(mapStyles.layers.building_extrusions.id, mainText[obj.i].filter)

          } else if (obj.el === "s3"){ // FILTER 3 -- Building Height
              map.setFilter(mapStyles.layers.building_extrusions.id, mainText[obj.i].filter)
              if (obj.direction === "bottom") {
                map.setLayoutProperty(mapStyles.layers.existing_green_roofs.id, 'visibility', 'none')
              }

          } else if (obj.el === "s4") { // Existing Green Roofs
              map.setLayoutProperty(mapStyles.layers.existing_green_roofs.id, 'visibility', 'visible')
            if (obj.direction === "bottom") {
              map.setPaintProperty(mapStyles.layers.building_extrusions.id, "fill-extrusion-height",{"property": "heightroof","type": "identity"})
              map.setPaintProperty(mapStyles.layers.building_extrusions.id, "fill-extrusion-color", "#aaa")
            }

          } else if (obj.el === "analysis"){ // ANALYSIS
            map.setPaintProperty(mapStyles.layers.building_extrusions.id, "fill-extrusion-height", 0)
            map.setPaintProperty(mapStyles.layers.building_extrusions.id, "fill-extrusion-color", "#85d251")
          }

        } else { // RESET MAP - when scrolling to top
          map.easeTo({"pitch": mapStyles.styles.initial.pitch, "speed": 0.1, "zoom": mapStyles.styles.initial.zoom, "center": mapStyles.styles.initial.center})
          map.setPaintProperty(mapStyles.layers.building_extrusions.id, "fill-extrusion-opacity",0)
          map.setPaintProperty(mapStyles.layers.full_green_roof_potential.id, 'fill-opacity', 1)
          map.setLayoutProperty(mapStyles.layers.existing_green_roofs.id, 'visibility', 'visible')

        }
      }
    });

    //GET FEATURES WITHIN VIEW
    bus.$on('features-click', x => {
      console.log('clicked button')
      self.getFeaturesInView();
    })

    // FLY TO NEIGHBORHOOD SELECTION
    bus.$on('neighborhood-select', payload => {
      map.flyTo({center: payload.center, zoom: 14, speed: .5})
      self.getFeaturesInView();
    });

    // TOGGLE ECOLOGICAL LAYERS
    bus.$on('add-layer', layerName => {
      let layers = this.$store.getters.getActiveLayers;

      if (layers[layerName]){
        map.removeLayer(mapStyles.layers[layerName].id)
      } else {
        map.addLayer(mapStyles.layers[layerName], mapStyles.layers.building_extrusions.id)
      }
      this.$store.commit('updateActiveLayers', layerName);
    })

    // FLY TO BOROUGH
    bus.$on('borough-select', options => {
      map.flyTo({center: options.center, speed: .5})
    })

  },
  methods:{
    getFeaturesInView: function (e){
        let options = { layers: [mapStyles.layers.building_extrusions.id, mapStyles.layers.full_green_roof_potential.id] };
        let features = this.map.queryRenderedFeatures(options);
        features = _.chain(features)
          .sortBy([(o) => {return o.layer.id}]) //gets the filtered green roof first
          .uniqBy('properties.doitt_id') // pulls first entry for each doitt_id
          .value()

        let bins = d3.histogram()
          .value(d => Math.log(d.properties.shape_area))
          (features);

        let summary_obj = {
          total: {
            count: 0,
            area: 0,
            low: 0,
            mid: 0,
            high: 0
          },
          gr: {
            count: 0,
            area: 0,
            low: 0,
            mid: 0,
            high: 0
          }
        };

        // get total counts and sums
        let summary_stats = features.reduce( (accum, f) => {
          accum.total.count = accum.total.count + 1;
          accum.total.area = accum.total.area + f.properties.shape_area;

          accum.total.low = (f.properties.heightroof <= 30 ) ? accum.total.low + f.properties.shape_area : accum.total.low;
          accum.total.mid = (f.properties.heightroof > 30 && f.properties.heightroof <=70) ? accum.total.mid + f.properties.shape_area : accum.total.mid;
          accum.total.high = (f.properties.heightroof > 70 ) ? accum.total.high + f.properties.shape_area : accum.total.high;

          if (f.layer.id === mapStyles.layers.building_extrusions.id) { // all the eligible buildings
            accum.gr.count = accum.gr.count + 1;
            accum.gr.area = accum.gr.area + f.properties.shape_area;
          }
          else { // for all the non-eligible buildings
            accum.gr.low = (f.properties.heightroof <= 30 ) ? accum.gr.low + f.properties.shape_area : accum.gr.low;
            accum.gr.mid = (f.properties.heightroof > 30 && f.properties.heightroof <=70) ? accum.gr.mid + f.properties.shape_area : accum.gr.mid;
            accum.gr.high = (f.properties.heightroof > 70 ) ? accum.gr.high + f.properties.shape_area : accum.gr.high;
          }

          return accum
        }, summary_obj);

        console.log(summary_stats)

        this.$store.commit('storeSummary', summary_stats);
        this.$store.commit('storeHistogramBins', bins);
    },
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
