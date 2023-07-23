const unpack = (data, key) => data.map(row => row[key]);

/* pie chart to show world palm oil production vs indonesia's production. year is unneccessary to unpack but nice to have next to all the data if changed in the future */
Plotly.d3.csv("data/productionPieChart.csv", production_data => {
  const region = unpack(production_data, 'Entity');
  const year = unpack(production_data, 'Year');
  const production = unpack(production_data, 'Palm oil Production (tonnes)');

  var data = [
    {
      values: production,
      labels: region,
      textinfo: "label+percent",
      textposition: "inside",
      insidetextorientation: "radial",
      type: 'pie',
      marker: {
        colors: ['green', 'orange']
      }
    }
  ];

  var layout = { //decided not to set width and height values, instead setting in css as it autoresizes better without strict values
      title: {
      text: 'Palm Oil Production in Tonnes (2020)',
    },
    showlegend: false,
    paper_bgcolor: 'rgba(0, 0, 0, 0)',  // transparent background and plot
    plot_bgcolor: 'rgba(0, 0, 0, 0)'
  }

  var config = {responsive: true}


  Plotly.newPlot('production-pie-chart', data, layout,config);
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
  const oilHarvest = unpack(harvested_data,'Oil Type');
  const areaHarvest = unpack(harvested_data,'Area Harvested (hectares)');

  var data = [
    {
      type: 'treemap',
      labels: oilHarvest,
      parents: oilHarvest.map(() => ''), // Set an empty parent for all oil types, because each node needs to have it's own parent node on the same heirarchy as other parent nodes.
      values: areaHarvest,
    }
  ];

  var layout = {
    title: 'Land Use for Vegetable Oil (2020)',
    treemapcolorway: ["green,orange"],
    autosize: true,
  };

  Plotly.newPlot('harvest-treemap', data, layout);
});

function filterAndUnpack(rows, key, year) { // made into global function because two of my chloropleths require it
  return rows.filter(row => row['Year'] == year).map(row => row[key])
  }

Plotly.d3.csv("data/exported-deforestation.csv", function(err, rows){ // adapted from https://plotly.com/javascript/map-animations/

  var frames = []
  var slider_steps = []

  var n = 8;
  var num = 2005;
  for (var i = 0; i <= n; i++) { //because the chloropleths have multiple years, a for loop and vars are needed instead of const.
    var z = filterAndUnpack(rows, 'exported_deforestation', num)
    var locations = filterAndUnpack(rows, 'Code', num)
    var text = filterAndUnpack(rows, 'Entity', num)
    frames[i] = {data: [{z: z, locations: locations, text: text}], name: num} // changed the text to use entity so it would display the country name when hovered over instead of the code
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
      colorscale: 'Jet',
      locations: frames[0].data[0].locations,
      z: frames[0].data[0].z,
      text: frames[0].data[0].text,
      zauto: false, //so that it doesn't automatically change between each frame
      colorbar: {
        ticksuffix: 'ha',
        tickformat: ',',  // Add a comma as a thousands separator
      }
}];

var layout = {
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 50,
    pad: 2
},
    title: {
      text: 'Exported Deforestation (Hectares)',
    },
autosize:true,
    geo:{
       scope: 'world',
       projection:{
        type: 'Equirectangular'
    },
    mapbox: {
      center: {
        lat: 28,
        lon: -84
      },
    },
       
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
        prefix: "Year: ",
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

Plotly.newPlot('expD', data, layout).then(function() {
    Plotly.addFrames('expD', frames);
  });
})


Plotly.d3.csv("data/palm-oil-production-chloro.csv", function(err, rows){ // adapted from https://plotly.com/javascript/map-animations/

  var frames = []
  var slider_steps = []

  var n = 59;
  var num = 1961;
  for (var i = 0; i <= n; i++) {
    var z = filterAndUnpack(rows, 'Palm oil production (tonnes)', num)
    var locations = filterAndUnpack(rows, 'Code', num)
    var text = filterAndUnpack(rows, 'Entity', num)
    frames[i] = {data: [{z: z, locations: locations, text: text}], name: num}
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
      colorscale: 'Jet',
      locations: frames[0].data[0].locations,
      z: frames[0].data[0].z,
      text: frames[0].data[0].text,
      zauto: false, //so that it doesn't automatically change between each frame
      colorbar: {
        ticksuffix: 't',
        tickformat: ',',  // Add a comma as a thousands separator, larger numbers are more impactful on audience
      }
}];

var layout = {
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 50,
    pad: 2
},
    title: {
      text: 'Palm oil production (Tonnes)',
    },
autosize:true,
    geo:{
       scope: 'world',
       projection:{
        type: 'Equirectangular'
    },
    mapbox: {
      center: {
        lat: 28,
        lon: -84
      },
    },
       
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
        prefix: "Year: ",
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

Plotly.newPlot('production-chloro', data, layout).then(function() {
    Plotly.addFrames('production-chloro', frames);
    var animationButton = document.querySelector('.updatemenu > .buttons > .btn:first-child');
animationButton.click();
  });
})

