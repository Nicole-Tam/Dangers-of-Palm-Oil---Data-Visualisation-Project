const unpack = (data, key) => data.map(row => row[key]);

/* pie chart to show world palm oil production vs indonesia's production. year is unneccessary to unpack but nice to have next to all the data */
Plotly.d3.csv("data/productionPieChart.csv", production_data => {
  const region = unpack(production_data, 'Entity');
  const year = unpack(production_data, 'Year');
  const production = unpack(production_data, 'Palm oil Production (tonnes)');

  var data = [
    {
      values: production,
      labels: region,
      type: 'pie',
      marker: {
        colors: ['green', 'orange']
      }
    }
  ];

  var layout = {
    title: {
        text: 'Palm Oil Production (2020)'
      }
    }

  Plotly.newPlot('production-pie-chart', data, layout);
});


Plotly.d3.csv("data/oil-yield-by-crop-2020.csv", yield_data => {
  const Oil = unpack(yield_data, 'Oil Type');
  const Yield = unpack(yield_data, 'Yield by Crop (tonnes)');

  var data = [
    {
      type: 'bar',  
      x: Yield,
      y: Oil,
      orientation: 'h',
      
      marker: {
        colors: ['green', 'orange']
      }
    }
  ];

  var layout = {
    title: {
        text: 'Oil Yield Per Crop (2020)',
      }
    }

  Plotly.newPlot('yield-bar-chart', data, layout);
});

Plotly.d3.csv("data/land-use-for-vegetable-oil-crops-cleaned.csv", harvested_data => {
    const oilHarvest = harvested_data.map(data => data['Oil Type']);
    const areaHarvest = harvested_data.map(data => data['Area Harvested (hectares)']);
  
    var data = [
      {
        type: 'treemap',
        labels: oilHarvest,
        parents: oilHarvest.map(() => ''), // Set an empty parent for all oil types, because each node needs to have it's own parent node on the same heirarchy as other parent nodes.
        values: areaHarvest,
      }
    ];
  
    var layout = {
      title: 'Land Use for Vegetable Oil',
      treemapcolorway: ["green,orange"],
      autosize: true
    };
  
    Plotly.newPlot('harvest-treemap', data, layout);
  });
  