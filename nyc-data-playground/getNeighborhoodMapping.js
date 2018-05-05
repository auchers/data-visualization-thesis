const fs = require('fs');
const _ = require('lodash')
var polygonCenter = require('geojson-polygon-center')

path = './data/jsons/neighborhoods.json';

fs.readFile(path, (err, data) =>{
  if (err) console.error(err)
  else {
    let json = JSON.parse(data);

    // console.log(json[0].geometry, polygonCenter(json[0].geometry));

    let map = _.chain(json)
        .uniqBy('properties.NTACode')
      .map( d => {
        return {'NTACode': d.properties.NTACode,
          'NTAName': d.properties.NTAName,
          'center': polygonCenter(d.geometry).coordinates
        };
      } )
      .value();

    // console.log(map)
    fs.writeFileSync('./assets/neighborhoodMapping.json', JSON.stringify(map, null, 2))
  }
})
