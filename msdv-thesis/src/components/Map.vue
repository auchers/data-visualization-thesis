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
