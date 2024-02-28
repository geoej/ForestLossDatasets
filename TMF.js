// SEI-Trase assignment Ebrahim Jahanshiri
// TMF analysis of change between two periods

// Loading the boundary data 
var asset = "projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/country_per_biome";

var allarea = ee.FeatureCollection(asset);

function rgb(r,g,b){  
    var bin = r << 16 | g << 8 | b;  
    return (function(h){  
        return new Array(7-h.length).join("0")+h;  
    })(bin.toString(16).toUpperCase());  
}

// Download asset
var AnnualChanges = ee.ImageCollection('projects/JRC/TMF/v1_2021/AnnualChanges').mosaic().clip(allarea);


var AnnualChangesYear1=AnnualChanges.select('Dec2009');  
var AnnualChangesYear2=AnnualChanges.select('Dec2020');

var ChangesBetweenTwoPeriods = ((AnnualChangesYear1.eq(1)).and(AnnualChangesYear2.eq(2)));

ChangesBetweenTwoPeriods = ChangesBetweenTwoPeriods.where((AnnualChangesYear1.eq(1)).and(AnnualChangesYear2.eq(3)), 2);  
ChangesBetweenTwoPeriods = ChangesBetweenTwoPeriods.where((AnnualChangesYear1.eq(2)).and(AnnualChangesYear2.eq(3)), 2);  
ChangesBetweenTwoPeriods = ChangesBetweenTwoPeriods.where((AnnualChangesYear1.eq(1)).and(AnnualChangesYear2.eq(5)), 2);  
ChangesBetweenTwoPeriods = ChangesBetweenTwoPeriods.where((AnnualChangesYear1.eq(2)).and(AnnualChangesYear2.eq(5)), 2);

var PALETTECHANGES = [
    rgb(255,170,35), // val 1. From Undisturbed TMF to Degraded forest  
    rgb(255,170,35), // val 2. From TMF to Deforested land  
    rgb(190,210,60), // val 3. From TMF to Deforested to Forest regrowth  
    rgb(210,250,60), // val 4. From deforested land to Forest regrowth  
];

// Map.addLayer(ChangesBetweenTwoPeriods.updateMask(ChangesBetweenTwoPeriods),{  
//     //'min': 1,  
//     //'max': 4,  
//     'palette': PALETTECHANGES  
// }, "JRC - Changes Between Two Periods – v1 2021", true);


// var baseChange = [{featureType: 'none', stylers: [{invert_lightness: true}]}];

// Map.setOptions('baseChange', {'baseChange': baseChange});


// // Export to google drive as GeoTIFF raster
// Export.image.toDrive({
//   image: ChangesBetweenTwoPeriodsMean, //.multiply(100).round().toInt16(), // <-- scale, cast to 16-bit,
//   description: 'TMF_Deforestation_2010-2020',
//   scale: 100000000,
//   region: allarea.geometry(), 
//   crs: 'EPSG:4326',
//   maxPixels:1e13,
//   fileFormat: 'GeoTIFF',
//   folder: "SEI_assignment",
//   formatOptions: {
//     cloudOptimized: false
//   }
// });

// print('all metadata', ChangesBetweenTwoPeriods);

// //Export.map.toCloudStorage(ChangesBetweenTwoPeriods)


// //Convert the zones of the thresholded nightlights to vectors.
var zones = ChangesBetweenTwoPeriods;

var vectors = zones.addBands(ChangesBetweenTwoPeriods).reduceToVectors({
  geometry: allarea,
  crs: ChangesBetweenTwoPeriods.projection(),
  scale: 1000,
  geometryType: 'polygon',
  eightConnected: false,
  labelProperty: 'zone',
  bestEffort: true,
  reducer: ee.Reducer.mean()
});

// export the results out

Export.table.toDrive(vectors)


//
// statistics 
//


// Bolivia: Amazon*ia, Andes, Chaco, Chiquitano, Tucumano-Boliviano
// Brazil: Amazon*ia, Cerrado, Pantanal
// Colombia: Amazon*ia, Andes
// Ecuador: Amazon*ia
// Guyana: Amazon*ia
// Guyane Fran*aise, Amazon*ia
// Per*: Amazon*ia, Andes
// Suriname: Amazon*ia
// Venezuela: Amazon*ia

// Display as default and with a custom color.

// Map.addLayer(mosaic, {}, 'default display');
// Map.addLayer(subarea, {color: 'FF0000'}, 'colored');               
               
//
// running stats for regions
//

// This generates a list of numbers 
var countries = ["Bolivia", "Bra", "Colom", "Ecua", "Guyan", "Guyane Fran", "Per", "Sur", "Ven"];
var biomes = ["Amazon", "Andes", "Chaco", "Tucum", "Cerr", "Panta", "Fran"];

// The map() operation takes a function that works on each element independently
// and returns a value. You define a function that can be applied to the input.
var computeSquares = function(area) {
  // We define the operation using the EE API.
  var asset = "projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/country_per_biome";
  
  var subarea = ee.FeatureCollection(asset)
                .filterMetadata('name_es', 'contains', area);
  
  // Multiply the loss pixels by their area
  var areaImage = ChangesBetweenTwoPeriods.multiply(ee.Image.pixelArea()).clip(subarea).rename("loss1020");
  
  // print('All metadata', areaImage);
  
  // Map.addLayer(loss1020, {color: 'FF0000'}, 'loss1020');

  // Calculate the area of loss pixels 
  var stats = areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: subarea.geometry(),
    scale: 1000,
    maxPixels: 1e9
  });
  
  return stats.get('loss1020');

};

// Apply the function to each item in the list by using the map() function.
var country = countries.map(computeSquares);
var biome = biomes.map(computeSquares);

print(country);
print(biome);

// exporting the results

var exportcountries = ee.Dictionary.fromLists(countries, country);

Export.table.toDrive(
  ee.FeatureCollection([ee.Feature(null,exportcountries)]), "TMF_countries");
  
  
var exportbiomes = ee.Dictionary.fromLists(biomes, biome);

Export.table.toDrive(
  ee.FeatureCollection([ee.Feature(null,exportbiomes)]), "TMF_biomes");
  


