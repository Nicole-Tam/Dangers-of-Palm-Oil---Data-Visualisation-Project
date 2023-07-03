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

Plotly.d3.csv("data/exported-deforestation.csv", deforestation_data => {
  const location = unpack(deforestation_data, 'Code');
  const exportedDeforestation = unpack(deforestation_data, 'exported_deforestation');
  const country = unpack(deforestation_data, 'Entity');

  var data = [{
    type: 'choropleth',
    locations: location,
    z: exportedDeforestation,
    text: country,
    colorscale: 'Jet',
    marker: {
      line: {
        color: 'rgb(180,180,180)',
        width: 0.5
      }
    },
    colorbar: {
      ticksuffix: '%',
      title: 'Global Exported Deforestation'
    }
  }];

  var layout = {
    width: 1600,
    height: 800,
    title: 'Global Exported Deforestation',
    geo: {
      showframe: false,
    }
  };

  Plotly.newPlot("deforestation-map", data, layout);
});


Plotly.d3.csv("data/exported-deforestation.csv", function(err, rows){

  function filter_and_unpack(rows, key, year) {
  return rows.filter(row => row['Year'] == year).map(row => row[key])
  }

  var frames = []
  var slider_steps = []

  var n = 8;
  var num = 2005;
  for (var i = 0; i <= n; i++) {
    var z = filter_and_unpack(rows, 'exported_deforestation', num)
    var locations = filter_and_unpack(rows, 'Code', num)
    var text = filter_and_unpack(rows, 'Entity', num)
    frames[i] = {data: [{z: z, locations: locations, text: locations}], name: num}
    slider_steps.push ({
        label: num.toString(),
        method: "animate",
        args: [[num], {
            mode: "immediate",
            transition: {duration: 300},
            frame: {duration: 300}
          }
        ]
      })
    num = num + 1
  }

var data = [{
      type: 'choropleth',
      locationmode: 'world',
      locations: frames[0].data[0].locations,
      z: frames[0].data[0].z,
      text: frames[0].data[0].text,
      zauto: false,
      zmin: 30,
      zmax: 90

}];

var layout = {
    title: 'Global Exported Deforestation',
    geo:{
       scope: 'world',
       countrycolor: 'rgb(255, 255, 255)',
       showland: true,
       landcolor: 'rgb(217, 217, 217)',
       showlakes: true,
       lakecolor: 'rgb(255, 255, 255)',
       subunitcolor: 'rgb(255, 255, 255)',
       lonaxis: {},
       lataxis: {},
       showframe: false,
    },
    updatemenus: [{
      x: 0.1,
      y: 0,
      yanchor: "top",
      xanchor: "right",
      showactive: false,
      direction: "left",
      type: "buttons",
      pad: {"t": 87, "r": 10},
      buttons: [{
        method: "animate",
        args: [null, {
          fromcurrent: true,
          transition: {
            duration: 200,
          },
          frame: {
            duration: 500
          }
        }],
        label: "Play"
      }, {
        method: "animate",
        args: [
          [null],
          {
            mode: "immediate",
            transition: {
              duration: 0
            },
            frame: {
              duration: 0
            }
          }
        ],
        label: "Pause"
      }]
    }],
    sliders: [{
      active: 0,
      steps: slider_steps,
      x: 0.1,
      len: 0.9,
      xanchor: "left",
      y: 0,
      yanchor: "top",
      pad: {t: 50, b: 10},
      currentvalue: {
        visible: true,
        prefix: "Year:",
        xanchor: "right",
        font: {
          size: 20,
          color: "#666"
        }
      },
      transition: {
        duration: 300,
        easing: "cubic-in-out"
      }
    }]
};

Plotly.newPlot('myDiv', data, layout).then(function() {
    Plotly.addFrames('myDiv', frames);
  });
})
