// SEI-Trase assignment Ebrahim Jahanshiri
// TMF analysis of change between two periods

// Loading the boundary data 
var asset = "projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/country_per_biome"

var allarea = ee.FeatureCollection(asset)

function rgb(r,g,b){  
    var bin = r << 16 | g << 8 | b;  
    return (function(h){  
        return new Array(7-h.length).join("0")+h;  
    })(bin.toString(16).toUpperCase());  
}


// Get the loss image.
// This dataset is updated yearly, so we get the latest version.
var gfc2021 = ee.Image('UMD/hansen/global_forest_change_2021_v1_9').clip(allarea);

print('all metadata', gfc2021);

// calculate the loss map for different years
var lossIn2010 = gfc2021.select(['lossyear']).eq(10);
var lossIn2011 = gfc2021.select(['lossyear']).eq(11);
var lossIn2012 = gfc2021.select(['lossyear']).eq(12);
var lossIn2013 = gfc2021.select(['lossyear']).eq(13);
var lossIn2014 = gfc2021.select(['lossyear']).eq(14);
var lossIn2015 = gfc2021.select(['lossyear']).eq(15);
var lossIn2016 = gfc2021.select(['lossyear']).eq(16);
var lossIn2017 = gfc2021.select(['lossyear']).eq(17);
var lossIn2018 = gfc2021.select(['lossyear']).eq(18);
var lossIn2019 = gfc2021.select(['lossyear']).eq(19);
var lossIn2020 = gfc2021.select(['lossyear']).eq(20);

var lossImage = gfc2021.select(['loss']);
var lossyearImage = gfc2021.select(['lossyear']);



var loss1020 = lossyearImage.updateMask(lossyearImage.gt(9)).updateMask(lossyearImage.lt(21))
        .selfMask()
        // rename the band
        .rename('loss20102020');
        

// Map.addLayer(lossImage.updateMask(lossImage),
//     {palette: ['red']}, 'loss');
    
// Map.addLayer(loss1020.updateMask(loss1020),
//     {palette: ['yellow']}, 'Loss1020');
    
// Map.addLayer(lossIn2020.updateMask(lossIn2020),
//     {palette: ['darkblue']}, 'Loss2020');
    
// Map.addLayer(lossIn2015.updateMask(lossIn2015),
//     {palette: ['orange']}, 'Loss2015');
    
// var totallos = lossIn2010.or(lossIn2011.or(lossIn2012.or(lossIn2013.or(lossIn2014.or(lossIn2015.or(lossIn2016.or(lossIn2017.or(lossIn2018.or(lossIn2019.or(lossIn2020))))))))));

// // Define the visualization parameters.
// var vizParams = {
//   palette: ['00FFFF'],
// };

// Map.addLayer(lossIn2010.updateMask(lossIn2010), vizParams, '2010');

// Map.addLayer(totallos.updateMask(totallos));

// var baseChange = [{featureType: 'none', stylers: [{invert_lightness: true}]}];

// Map.setOptions('baseChange', {'baseChange': baseChange});


// // then save out the layers

var zones = loss1020;

var vectors = zones.addBands(loss1020).reduceToVectors({
  geometry: allarea,
  crs: loss1020.projection(),
  scale: 10000,
  geometryType: 'polygon',
  eightConnected: false,
  labelProperty: 'zone',
  bestEffort: true,
  reducer: ee.Reducer.mean()
});


//Exporting out the resutls 

Export.table.toDrive(vectors)


// statistics 

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
  
  var gfc2021 = ee.Image('UMD/hansen/global_forest_change_2017_v1_5').clip(subarea);

  var lossImage = gfc2021.select(['loss']);
  var lossyearImage = gfc2021.select(['lossyear']);

  var loss1020 = lossyearImage.updateMask(lossyearImage.gt(9)).updateMask(lossyearImage.lt(21))
          //.selfMask()
          // rename the band
          .rename('loss20102020');

  // Multiply the loss pixels by their area
  var areaImage = loss1020.multiply(ee.Image.pixelArea());
  
  // print('All metadata', areaImage);
  
  // Map.addLayer(loss1020, {color: 'FF0000'}, 'loss1020');

  // Calculate the area of loss pixels 
  var stats = areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: subarea.geometry(),
    scale: 1000,
    maxPixels: 1e9
  });
  
  return stats.get('loss20102020');

};

// Apply the function to each item in the list by using the map() function.
var country = countries.map(computeSquares);
var biome = biomes.map(computeSquares);

// exporting the results

var exportcountries = ee.Dictionary.fromLists(countries, country);

Export.table.toDrive(
  ee.FeatureCollection([ee.Feature(null,exportcountries)]), "GFW_countries");
  
  
var exportbiomes = ee.Dictionary.fromLists(biomes, biome);

Export.table.toDrive(
  ee.FeatureCollection([ee.Feature(null,exportbiomes)]), "GFW_biomes");
  
