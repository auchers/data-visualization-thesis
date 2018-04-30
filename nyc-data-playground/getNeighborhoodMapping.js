const fs = require('fs');
const _ = require('lodash')

path = './data/jsons/neighborhoods.json';

fs.readFile(path, (err, data) =>{
  if (err) console.error(err)
  else {
    let json = JSON.parse(data);

    let map = _.chain(json)
        .uniqBy('properties.NTACode')
      .map( d => {return {'NTACode': d.properties.NTACode, 'NTAName': d.properties.NTAName}; } )
      .value();
    //
    console.log(map);
    fs.writeFileSync('./assets/neighborhoodMapping.json', JSON.stringify(map, null, 2))
  }
})
