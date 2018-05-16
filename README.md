# Envisioning a New Urban Jungle
## Exploring the Potential of Green Roofs in NYC

>> Masters Thesis in Data Visualization from Parsons School of Design, May 2018

### Abstract
This thesis explores the ways in which green roofs can be used to counteract three major urban ecological challenges in New York City. Taking the city’s existing infrastructural landscape as the starting point, this thesis moves to identify underutilized spaces where green roofs would be most amenable and beneficial from the perspective of (1) stormwater retention, (2) surface temperature regulation, and (3) biodiversity enhancement. Users will then be given opportunities to explore the data themselves and engage with questions regarding the aggregative effects, and benefits of such interventions. Ultimately the goal of this project is to provide creative ways of interacting with the New York City 'building-scape' in order to foster community engagement and informed decision making for residents and policy-makers alike.

[![preview](preview.png)](https://auchers.github.io/data-visualization-thesis/)

### Data sources

Data Source | Description
------|------
[PLUTO tax lot database](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-pluto-mappluto.page) | This dataset details all of the tax lots in the 5 boroughs and details properties such as ‘owner,’ ‘building class’, ‘land class’, ‘address’, etc.
[Building Footprints](https://data.cityofnewyork.us/Housing-Development/Building-Footprints/nqwf-w8eh) | PLUTO has a lot of amazing information, but unfortunately the lots are too large for our analysis -- we need information at the building level, so we also needed this shapefile of all 1 million+ NYC buildings
[Existing Green Roofs](https://github.com/tnc-ny-science/NYC_GreenRoofMapping/tree/master/greenroof_gisdata/20180403_greenroof_gte50px_0x5m/polygons) | This dataset was expertly put together by Michael Treglia at The Nature Conservancy. He was able to use existing datasets, as well as satellite imagery to identify existing green roofs of NYC
[NYC Neighborhood Boundaries](https://www1.nyc.gov/site/planning/data-maps/open-data/dwn-nynta.page) | This dataset contains a list of all Neighborhood Tabulation Areas (NTAs) and their associated geometries. This allowed me to get the neighborhood name for each building.  
[Surface Temperatures]() | This is a raster data set of LANDSAT satellite remote sensors picking up surface temperatures in New York City for an average summer day in 2011. |
[CSO Overflow Count](http://openseweratlas.tumblr.com/) | This data, which originally comes from NYC Department of Environmental Protections, was curated and pulled out of the original pdf reports and into [shapefiles](https://drive.google.com/file/d/1y8sBQiHD6gxS6dx6Civ0_vKXLdVzSNP6/view) by  ‘Open Sewer Atlas NYC.’  It includes the over 450 CSO outfalls, including the annual volume of CSO discharge and number of events per year, from 2006, 2013, 2014, 2015 and 2016 datasets (pulled from the 2014, 2015 and 2016 [NYC DEP reports](http://www.nyc.gov/html/dep/html/harborwater/spdes_bmp_report_2010.shtml)).
Mapbox tilesets - [3D Building Data](https://www.mapbox.com/studio/tilesets/mapbox.mapbox-streets-v7/)  and   [Satellite Imagery](https://www.mapbox.com/studio/tilesets/mapbox.satellite/) | Used directly from Mapbox in order to give context to the work

### Data Flow Overview
More information regarding the step by step process for preparing the data for this project can be found [here](https://github.com/auchers/data-visualization-thesis/tree/master/nyc-data-playground). Below is an overview of the entire data flow drawing from the data sources above.
[![dataFlow](ThesisDataFlow.png)](https://github.com/auchers/data-visualization-thesis/tree/master/nyc-data-playground)

#### Resources Used:

* [QGIS](https://qgis.org/en/site/) - open source GIS processing software
* [GDAL](http://www.gdal.org/) - open source command line GIS processing utility
* [JQ](https://shapeshed.com/jq-json/) - command line utility for manipulating jsons
* [Tippecanoe](https://github.com/mapbox/tippecanoe) - utility for converting GeoJSONs into MBTILES to be used in Mapbox
* [Spatial join](https://github.com/UrbanSystemsLab/spatial-join-mongodb) - multi-threaded spatial join developed by the Urban Systems Lab for MongoDB
* [MongoDB](https://docs.mongodb.com/) - database used for geo-spatial queries including spatial join
* [MapboxGL](https://www.mapbox.com/mapbox-gl-js/api/) - JavaScript library that uses WebGL to render interactive maps, also used to hold and serve up map tiles
* [Vue.js](https://vuejs.org/) - open-source JavaScript framework for building user interfaces.
* [Jupyter Notebooks](http://jupyter.org/) - Python interface used to process and analyze data. Feel free to take a look at my rough mid-process analyses [here](https://github.com/auchers/data-visualization-thesis/tree/master/nyc-data-playground/jupyter_notebooks)


### Future Directions
Keep an eye on [projects](https://github.com/auchers/data-visualization-thesis/projects) to see upcoming features and additions. Current thoughts include:

 - [ ] Building more engaging visualizations of building aggregates (histograms, demographics, etc.)
 - [ ] Incorporating more nuance regarding social demographics and vulnerability. Looking at who could most benefit from green roofs


### Acknowledgements
This thesis would not have been possible without the tireless help of MSDV faculty, specifically Daniel Sauter and Aaron Hill.

This thesis was built and developed in close collaboration with the [Urban Systems Lab](http://urbansystemslab.com/). Specifically 
