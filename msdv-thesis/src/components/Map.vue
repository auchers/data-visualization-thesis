<template>
  <!--<h1>{{msg}}</h1>-->
  <div id="mapbox">

  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl';
import '../../node_modules/mapbox-gl/dist/mapbox-gl.css';

export default {
  name: 'Map',
  data () {
    return {
      msg: 'This is the Map Component'
    }
  },
  mounted(){
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXVjaGVyIiwiYSI6ImNqODd4NnBndzFjZDQyd3FocnM4Njc2NWQifQ.dql4s6oWRANbYGt44i6n9A';

    let map = new mapboxgl.Map({
      style: 'mapbox://styles/aucher/cj87xa4nv3xb02ro4j9o2hatb',
      center: [-74.0066, 40.7135],
      zoom: 14,
      pitch: 60,
      bearing: 32.8,
      hash: true,
      container: 'mapbox'
    });

    map.on('load', function(){
      // insert layers beneath any symbol layer
      let layers = map.getStyle().layers;

      let labelLayerId;
      for (var i = 0; i < layers.length; i++){
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']){
          labelLayerId = layers[i].id;
          break
        }
      }

      map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 14,
        'paint':{
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            "interpolate", ["linear"], ["zoom"],
            15, 0,
            15.05, ["get", 'height']
          ],
          'fill-extrusion-base': [
            "interpolate", ["linear"], ["zoom"],
            15, 0,
            15.05, ["get", "min_height"]
          ],
          'fill-extrusion-opacity': .6
        }
      }, labelLayerId); // adds the layer label on top so that visible above extrusions
      // },


      map.addLayer(
        // {
        //   "layers" : {
        //     "-L7XOyhcs92Be8-2Nx5d" : {
        //       "filter" : [ "has", "heat_risk" ],
        //       "id" : "NewYork-HeatRisk",
        //       "layout" : {
        //         "visibility" : "none"
        //       },
        //       "paint" : {
        //         "fill-extrusion-base" : {
        //           "property" : "min_height",
        //           "type" : "identity"
        //         },
        //         "fill-extrusion-color" : {
        //           "property" : "heat_risk",
        //           "stops" : [ [ 0.438, "#fef0d9" ], [ 0.455, "#fdcc8a" ], [ 0.469, "#fc8d59" ], [ 0.484, "#e34a33" ], [ 0.749, "#b30000" ] ]
        //         },
        //         "fill-extrusion-height" : {
        //           "property" : "height",
        //           "type" : "identity"
        //         },
        //         "fill-extrusion-opacity" : 1
        //       },
        //       "source" : "composite",
        //       "source-layer" : "buildings-new-york",
        //       "type" : "fill-extrusion"
        //     }
        //   },
        //   "name" : "Heat Risk"
        // },


      {
        "id": 'green-roof-potential',
        "type": 'fill-extrusion',
        'source': {
          'type': 'vector',
          'url': 'mapbox://aucher.2u35uvcm' //MapID from bottom of tileset page
        },
        'source-layer': 'building-layer',
        'paint':
        {

          'fill-extrusion-color':
          [
            "step",
            ["log10", ["get", "shape_area"]],
            "rgba(68,1,84,255)",
            1, "rgba(64,67,135,255)",
            2, "rgba(41,120,142,255)",
            3, "rgba(34,168,132,255)",
            4, "rgba(122,210,81,255)",
            5, "rgba(253,231,37,255)",
            6, "rgba(99,82,136,255)",
          ]
        }
        })

    })

  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  #mapbox{
    position: absolute;
    /*left: 3em;*/
    top: 3em;
    bottom: 3em;
    width: 80%;
  }

</style>
