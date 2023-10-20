// Define the Area of Interest (AOI) - You need to define 
// AOI as a geometry Below I have given one example, you
// can even add shapefile

// var AOI = ee.Geometry.Polygon(
//   [[
//     [68.1768798828125, 7.01366792756663],
//     [97.4163818359375, 7.01366792756663],
//     [97.4163818359375, 35.75579193456824],
//     [68.1768798828125, 35.75579193456824]
//   ]]
// );

// Sentinel 5P image collection
var data = ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_NO2");

// Filter the collection for the Indian Region
var filter_AOI = data.filterBounds(AOI);

// Filter by date
var filter_Date = filter_AOI.filterDate('2023-10-01', '2023-10-09');

// Filter for NO2 column number density
var NO2_Band = filter_Date.select('NO2_column_number_density');

// Calculate the mean for the entire NO2 Band
var NO2_Mean = NO2_Band.mean();

// Clip the result to the specified AOI
var NO2_Mean_Clipped = NO2_Mean.clip(AOI);

// Adding Map Layer with visualization parameters
Map.addLayer(NO2_Mean_Clipped, {
  min: 0,       // Minimum value for the visualization palette
  max: 0.0002,  // Maximum value for the visualization palette
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
}, 'Mean NO2 Column Density (Clipped to AOI)');  // Name for the map layer

// Center the map on the AOI
Map.centerObject(AOI, 5);

// Optionally, add a legend to the map
var legend = ui.Panel({
  style: {
    position: 'bottom-right',
    padding: '8px 15px'
  }
});

var legendTitle = ui.Label({
  value: 'Mean NO2 Column Density',
  style: {fontWeight: 'bold'}
});
legend.add(legendTitle);

var makeRow = function(color, label) {
  var colorBox = ui.Label({
    style: {
      backgroundColor: color,
      padding: '8px',
      margin: '0 0 4px 0'
    }
  });

  var description = ui.Label({value: label});
  return ui.Panel({
    widgets: [colorBox, description],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legend.add(makeRow('black', '0'));
legend.add(makeRow('red', '0.0002'));

Map.add(legend);
