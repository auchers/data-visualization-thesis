const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'nycdb';
const collName = 'buildings';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    simplePipeline(db, () => client.close())

});


function simplePipeline(db, callback) {
    const collection = db.collection(collName);
    collection.count({ },
        function(err, result) {
            assert.equal(err, null);
            console.log(result)
            callback(result);
        }
    );
}