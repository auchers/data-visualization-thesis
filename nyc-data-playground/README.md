*Data Documentation*

### Table of Contents
- [Data Sources](#data-sources)
- [Data Preprocessing](#data-preprocessing)
- [Database Schema](#database-schema)
- [Findings](#findings)
- [Benefit Calculations](#benefit-calculations)


# Data Sources
Ultimately creates 1 NYC buildings dataset composed of the following parts:

Spatial Join documentation from [here](https://github.com/UrbanSystemsLab/spatial-join-mongodb)

1. [PLUTO Tax Lots](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-pluto-mappluto.page), with buffer
2. [NYC Building Footprints](https://data.cityofnewyork.us/Housing-Development/Building-Footprints/nqwf-w8eh)
3. [Green Roofs](https://github.com/tnc-ny-science/NYC_GreenRoofMapping/tree/master/greenroof_gisdata/20180403_greenroof_gte50px_0x5m/polygons)
4. [NYC Neighborhood Boundaries](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-nynta.page)

# Data Preprocessing

## Step 1: Create buffer on PLUTO dataset
(If you want all 5 boroughs, a pre-step would be to merge the shapefiles of all 5 boroughs into 1 file and re-project that 1 file) [ref](https://www.northrivergeographic.com/ogr2ogr-merge-shapefiles))

This is important so that our spatial join will be able to catch the buildings as being within each lot
In QGIS - 'Vector' > 'Geoprocessing Tools' > 'Fixed Distance Buffer' with
* 'Distance': 0.00002 and
* 'Segments': 5

## Step 2: Add all three to MongoDB

### Convert Shapefiles to GeoJSON (ensuring correct projection)
In order to load these datesets into MongoDB, we have to first convert them into JSON files. We can do that using GDAL's 'Ogr2ogr' utility by running:

```sh
ogr2ogr -f GeoJSON -t_srs crs:84 [name].geojson [name].shp
```

We are also taking this opportunity to make sure that we are using the correct projection by using the -t_srs flag. This is critical for our spatial join to work as expected, as well as for mapboxGL to render our maps at the end of this process.

We can always check that our files are in the  **correct projection (WGS84)** by running the following (taken from [this SO question](this question)):

```sh
ogrinfo -ro -so -al  file.shp`  
#`-ro` opens the file in read only mode
#`-so` 'summary only' - suppresses all of the features and shows only summary info
#`al` lists all the layers in the given file
```

Given the correct projection, it should look like this:

![](./imgs/projection.png)

### Remove Headers to Create JSON files
At this point, we need to augment our file a bit to make sure that each feature in this collection gets added to MongoDB as its own document. To do that we need to strip off the header, and load into MongoDB only the 'features' section.

You can see the problem by viewing the beginning of one of the files with something like `less` (to get out of that screen, just type `q`).

example:
```sh
less buildings.geojson
```

(we only want the part contained in 'features')
![](./imgs/geojson.png)

To get just the 'features' we can use `jq` utility ([helpful link](https://shapeshed.com/jq-json/#how-to-use-pipes-with-jq)) by running:

```sh
jq  ".features" --compact-output buildings.geojson > buildings.json

jq  ".features" --compact-output green_roofs.geojson > green_roofs.json

jq  ".features" --compact-output lots_with_buffer.geojson > lots_with_buffer.json

jq ".features" --compact-output neighborhoods.geojson > neighborhoods.json
```

now when we run `less buildings.json` we should see:
![](./imgs/json.png) (see? only section within 'features' with no header)

Now these are ready to load into MongoDB!

### Database Information

To get MongoDB running, run `mongod`. Then, in a separate terminal window run `mongo` to get the mongo shell.

### Ensuring Spatial Index

Create empty collections in MongoDB before importing the data (from the mongo shell)

```sh
db.buildings.createIndex({"geometry":"2dsphere"})
db.lots_with_buffer.createIndex({"geometry":"2dsphere"})
db.green_roofs.createIndex({"geometry":"2dsphere"})
db.neighborhoods.createIndex({"geometry":"2dsphere"})
```

Import json files into mongo collections (from regular terminal window located in the directory holding your json files)

```sh
mongoimport --db thesis -c buildings --file "buildings.json" --jsonArray
mongoimport --db thesis -c lots_with_buffer --file "lots_buffer.json" --jsonArray
mongoimport --db thesis -c neighborhoods --file "neighborhoods.json" --jsonArray
```

We can compare the documents loaded to the original file by checking:

```sh
jq '. | length' test_file.json
```

against
```sh
# from Mongo shell
db.[col].find().count()
```

For me the total counts looked like this:

Dataset | JSON length | collection count
-----|-----|-----
Buildings | 1082792 | 1082789
Lots with Buffer | 857266 | 857266
Green Roofs | 7130 | 3659 <br> (many were lost here due to bad spatial index)

TODO: check what happened with green roofs loss

To double check, let’s ensure the spatial index:

```sh
db.buildings.ensureIndex({"geometry":"2dsphere"})
db.lots_with_buffer.ensureIndex({"geometry":"2dsphere"})
db.green_roofs.ensureIndex({"geometry":"2dsphere"})
```

### Database schema
DB name: 'thesis'

**Collections**:

Collection Name | Data
----- |-----|-----
buildings | NYC building Footprints
lots_with_buffers | PLUTO lots with buffers (from step 1)
green_roofs | GreenRoofs
neighborhoods | Neighborhood vector files
buildings_with_lots | spatial join of 'buildings' with 'lots_with_buffers'
buildings_lots_neighborhoods | spatial join of 'buildings_with_lots' and 'neighborhoods'

## Step 3: First Spatial Join (Lot properties into Buildings)
For this project, we will be using the multi-threaded spatial join brilliantly developed [here](https://github.com/UrbanSystemsLab/spatial-join-mongodb). This join is attempting to bring information from PLUTO into our building footprint polygons. PLUTO holds many of the interesting building specific features such as information about the owner, the district, the land use class, and building class.

To view the fields we have in our PLUTO lots data we can run:

`db.lots_with_buffer.find({},{"properties": 1}).limit(10).pretty()`

Fields from PLUTO lots to merge into Buildings:

```sh
node init.js --db 'mongodb://localhost:27017/thesis' --innerLayer buildings --outerLayer lots_with_buffer --outputLayer buildings_with_lots  --outerLayerAttributes "Address", "BldgArea", "BldgClass", "Block", "BoroCode", "LandUse", "LotArea", "NumFloors", "UnitsRes", "UnitsTotal", "OwnerName", "YearAlter1", "CD", "ResidFAR", "FacilFAR", "BuiltFAR", "CommFAR", "Landmark", "UnitsTotal", "AssessTot"
```

## Step 4: Second Spatial Join (Neighborhood Name into Buildings_With_Lots)
Unfortunately, PLUTO does not provide information on the neighborhood name of a given building. This makes sense because neighborhoods are relatively fluid and dynamic conceptual entities that perhaps do not belong in a tax lot database.

However, for this thesis, I really wanted to give users the opportunity to filter by their own neighborhood. To do that I needed some, even if imperfect mapping from building location to neighborhood name. I ended up finding a [Neighborhood Boundary](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-nynta.page) shapefile as part of NYC open data portal.

Therefore, I took our most recently joined collection, `buildings_with_lots` and joined into it the neighborhood name. This probably is not perfect, but it at least maps some neighborhood name to the buildings so that we have some way of sorting.

```sh
node init.js --db 'mongodb://localhost:27017/thesis' --innerLayer buildings_with_lots --outerLayer neighborhoods --outputLayer buildings_lots_neighborhoods --outerLayerAttributes "NTAName", "BoroCode", "NTACode"
```

## Step 5: Export from MongoDB
In order to get this data back into tileset form, we need to export it from mongoDB and ultimately convert it into MBTILES that we can load into Mapbox to later serve onto our final map. The first step is to export this newly joined data as a json file.

```sh
mongoexport --db thesis -c buildings_lots_neighborhoods --out "buildings_lots_neighborhoods.json" --jsonArray
```

Re-add the header to make the file a valid GeoJSON:

```sh
echo '{ "type": "FeatureCollection","features":'  >> buildings_lots_neighborhoods.geojson ; cat  buildings_lots_neighborhoods.json >> buildings_lots_neighborhoods.geojson ; echo '}' >> buildings_lots_neighborhoods.geojson
```

## Step 6: Convert to MBTILES
Our final step is to convert our geojson file into a format that mapbox can treat as a map layer. The best way to do this is using [tippecanoe](https://github.com/mapbox/tippecanoe), which offers many options for how to convert a vector tileset to MBTILES.

The main issue with this type of data is that it is above the size that mapbox is willing to serve. Therefore, depending on the zoom level (and how much detail is within view) tippecanoe knows to drop the features that are least relevant. They do have a few options depending on what your priorities are.

`--drop-fraction-as-needed` vs `-pd`

`-pd` creates really uneaven coverage at zoom levels lower than 14 (as in more zoomed out)

`--drop-fraction-as-needed` looks like more even coverage, but when you zoom in it is missing features

I ultimately went with using the `-y` flag to specify the fields that I wanted in conjunction with `--drop-fraction-as-needed` because I didn’t want to miss any buildings.

```sh
tippecanoe --drop-densest-as-needed -z 14 -y CD -y shape_area -y cnstrct_yr -y BldgClass -y doitt_id -y heightroof -y NTACode -n buildings-lots-neighborhoods -l building-layer -f -o tileset-buildings-lots-neighborhoods.mbtiles ../mongoOutput/buildings_lots_neighborhoods.geojson
```

# Findings

Metric | Value
------|------
Total Number of Buildings in dataset | 1,070,973
Total Area | 1,641,729,927.20 square feet
Total Eligible Roofs | 14,377
Total Eligible Area | 313,248,077.04 square feet

(for reference, Central Park is 36,721,080 square feet, which means this ellibile area is equal to **eight and a half times** the size of central park)

Eligible Buildings by Borough:

Borough Code | Name of Borough | Count of Eligible Buildings | Area of Eligible Buildings
------|------|------|------
1 | Manhattan  | 2918 | 60,631,864.83 sq. ft.
2 | Bronx | 2728 | 54,854,918.47 sq. ft.
3 | Brooklyn | 4149 | 89,448,977.62 sq. ft.
4 | Queens | 4144 | 97,731,366.64 sq. ft.
5 | Staten Island | 438 | 10,580,949.45 sq. ft.


### Step By Step MongoDB Queries Below:

Buildings Built before 1970 or with 'industrial' building class:
```#!/bin/sh
# buildings built before 1970, or with industrial building class
db.buildings_lots_neighborhoods.aggregate( [   
  { $match: { $or: [ {"properties.BldgClass": {$in: ["F1", "F2", "F4", "F5", "F8", "F9"] } },
                    {"properties.cnstrct_yr": { $lte: 1970} } ] } },
  { $group: { _id:null, count: { $sum: 1 }, total_area: { $sum: "$properties.shape_area"} } } ] );

# output: { "_id" : null, "count" : 934600, "total_area" : 1359666086.8570337 }
```
Buildings with an available roof area greater than 10,000 square feet:
```#!/bin/sh
# buildings with area greater than 10,000 square feet
db.buildings_lots_neighborhoods.aggregate( [   
  { $match: { $and: [{"properties.shape_area": { $gte: 10000 } } ] } },
  { $group: { _id:null, count: { $sum: 1 }, total_area: { $sum: "$properties.shape_area"} } } ] );

# output: { "_id" : null, "count" : 18029, "total_area" : 419645128.66903406 }
```
Buildings lower than 200 feet:
```#!/bin/sh
# buildings lower than 200 ft.
db.buildings_lots_neighborhoods.aggregate( [   
  { $match: { $and: [ {"properties.heightroof": { $lte: 200 } } ] } },
  { $group: { _id:null, count: { $sum: 1 }, total_area: { $sum: "$properties.shape_area"} } } ] );

# output: { "_id" : null, "count" : 1068951, "total_area" : 1604292876.661924 }
```

Total Eligible Buildings
```#!/bin/sh
# Total Eligible Buildings
db.buildings_lots_neighborhoods.aggregate( [   
  { $match:
    { $and: [{"properties.shape_area": { $gte: 10000 } },
            {"properties.shape_area": { $gte: 10000 } },
            { $or: [ {"properties.BldgClass": {$in: ["F1", "F2", "F4", "F5", "F8", "F9"] } },
                    {"properties.cnstrct_yr": { $lte: 1970} } ] }
    ]}
  },
  { $group: { _id:null, count: { $sum: 1 }, total_area: { $sum: "$properties.shape_area"} } } ] );

# output: { "_id" : null, "count" : 14377, "total_area" : 313248077.04260516 }
```

To group these by Borough:
```#!/bin/sh
# Total Eligible Buildings
db.buildings_lots_neighborhoods.aggregate( [   
  { $match:
    { $and: [{"properties.shape_area": { $gte: 10000 } },
            {"properties.shape_area": { $gte: 10000 } },
            { $or: [ {"properties.BldgClass": {$in: ["F1", "F2", "F4", "F5", "F8", "F9"] } },
                    {"properties.cnstrct_yr": { $lte: 1970} } ] }
    ]}
  },
  { $group: { _id:"$properties.BoroCode", count: { $sum: 1 }, total_area: { $sum: "$properties.shape_area"} } } ] );

# output: { "_id" : 3, "count" : 4149, "total_area" : 89448977.62393203 }
{ "_id" : 1, "count" : 2918, "total_area" : 60631864.8397949 }
{ "_id" : 5, "count" : 438, "total_area" : 10580949.455884682 }
{ "_id" : 2, "count" : 2728, "total_area" : 54854918.473000735 }
{ "_id" : 4, "count" : 4144, "total_area" : 97731366.64999282 }

```

### Benefit Calculations

*Surface Temperature* - Drawing from [Hamstead et. al. (2016)](https://www.sciencedirect.com/science/article/pii/S1470160X1500549X)
```sh
1. Current Surface Temp Approximation = (
[sum of lowrise building area] x 33
[sum of midrise building area] x 32
[sum of highrise building area] x 31)
 /  [total building square footage]

2.  Projected Surface Temp Approximation =  (
[sum of lowrise building area] x 33
[sum of midrise building area] x 32
[sum of highrise building area] x 31
[sum of eligible GR area] x 29)
 /  [total building square footage]

Delta = (1) - (2) (for Celsius)
```

*Potential Habitat* - Approximate Roof Vegetation Utilization
```sh
0.75
# Assumption that not all of the roof area will be covered in vegetation
```

*Stormwater Retention* - Taking a conservative estimate of gallons per 1 inch of rainfall from [PlaNYC Stormwater Management Plan (2008)](http://www.nyc.gov/html/planyc/downloads/pdf/publications/nyc_sustainable_stormwater_management_plan_final.pdf) multiplied by the average inches of rainfall in NYC taken from [Central Park Monthly Precipitation](https://www.weather.gov/media/okx/Climate/CentralPark/monthlyannualprecip.pdf) (we took the average of last 10 years)
```sh
Gallons Retained per 1 inch of Rainfall =
[Eligible Square Footage]
* 0.75 [approx efficiency rate]
* 0.47 [gallons per square footage in 1 inch of rainfall]

Gallons Retained Annually =
(formula above)
* 49.6 [average inches of annual rainfall for NYC]
