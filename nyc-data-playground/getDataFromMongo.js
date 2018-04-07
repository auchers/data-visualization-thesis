const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const fs = require('fs');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'thesis';
const collName = 'features';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    pipeline(db, () => client.close())

});


function pipeline(db, callback) {
    console.log('beginning aggregation');

    const collection = db.collection(collName);
    collection.aggregate([
        { $match: {'properties.Borough': "MN" } },
        // { $limit: 1000 }, //TODO: take out when feel comfortable with the data
        { $project: {
                "properties.Borough" : 1,
                "properties.Address" : 1,
                "properties.BldgArea" : 1,
                "properties.BldgClass" : 1,
                "properties.Block" : 1,
                "properties.BoroCode" : 1,
                "properties.LandUse" : 1,
                "properties.LotArea" : 1,
                "properties.NumFloors" : 1,
                "properties.UnitsRes" : 1,
                "properties.UnitsTotal" : 1 ,
                "properties.OwnerName" : 1,
                "properties.YearBuilt": 1,
                "properties.YearAlter1" : 1,
                "properties.CD" : 1,
                longLat: { $arrayElemAt: [{ $arrayElemAt: [ "$geometry.coordinates", 0] } , 0] },
            }
        },
    ]).toArray(function(err, docs) { // end of aggregation pipeline
        if (err) {console.log(err)}

        console.log('finished aggregation');
        fs.writeFileSync('../src/assets/data/full_output.json', JSON.stringify(docs, null, 2));
        callback();
    });
}