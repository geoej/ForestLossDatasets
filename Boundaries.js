// SEI-Trase assignment Ebrahim Jahanshiri
// Exporting layers 

//var asset = ee.ImageCollection('projects/mapbiomas-raisg/public/collection4/mapbiomas_raisg_panamazonia_collection5_integration_v1');

var asset = "projects/mapbiomas-raisg/DATOS_AUXILIARES/ESTADISTICAS/COLECCION4/country_per_biome";
var allarea = ee.FeatureCollection(asset);

// data for Map biomas

// var image = ee.Image("projects/mapbiomas-raisg/public/collection4/mapbiomas_raisg_panamazonia_collection4_integration_v1")
//     .rename('c85', 'c86', 'c87', 'c88','c89', 'c90', 'c91', 'c92', 'c93', 'c94', 'c95', 'c96', 'c97',
//             'c98','c99', 'c00', 'c01', 'c02', 'c03', 'c04', 'c05', 'c06', 'c07', 'c08', 'c09', 'c10',
//             'c11', 'c12', 'c13', 'c14', 'c15', 'c16', 'c17', 'c18', 'c19', 'c20', 'c21');

// Map.addLayer(image.updateMask(image));


// writing out MBM data for further analysis
// var zones = image;

// var vectors = zones.addBands(image).reduceToVectors({
//   geometry: allarea,
//   crs: image.projection(),
//   scale: 1000,
//   geometryType: 'polygon',
//   eightConnected: false,
//   labelProperty: 'zone',
//   bestEffort: true,
//   reducer: ee.Reducer.mean()
// });


// Exporting out the resutls 

// Export.table.toDrive(vectors)



//-
// outputting all GFW data
//-

// var gfc2021 = ee.Image('UMD/hansen/global_forest_change_2021_v1_9').clip(allarea);

// Map.addLayer(gfc2021.updateMask(gfc2021));


// writing out GFW data for further analysis
// var zones = gfc2021;

// var vectors = zones.addBands(gfc2021).reduceToVectors({
//   geometry: allarea,
//   crs: gfc2021.projection(),
//   scale: 1000,
//   geometryType: 'polygon',
//   eightConnected: false,
//   labelProperty: 'zone',
//   bestEffort: true,
//   reducer: ee.Reducer.mean()
// });


// Exporting out the resutls 

// Export.table.toDrive(vectors)


//-
// outputting all TMF data
//-

var AnnualChanges = ee.ImageCollection('projects/JRC/TMF/v1_2021/AnnualChanges').mosaic().clip(allarea);

Map.addLayer(AnnualChanges.updateMask(AnnualChanges));


// writing out GFW data for further analysis
var zones = AnnualChanges;

var vectors = zones.addBands(AnnualChanges).reduceToVectors({
  geometry: allarea,
  crs: AnnualChanges.projection(),
  scale: 1000,
  geometryType: 'polygon',
  eightConnected: false,
  labelProperty: 'zone',
  bestEffort: true,
  reducer: ee.Reducer.mean()
});


// Exporting out the resutls 

Export.table.toDrive(vectors)

