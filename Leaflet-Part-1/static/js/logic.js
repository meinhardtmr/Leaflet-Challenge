geoJsonURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

function getColor(d) {
    return d > 90 ? '#DE3163' :
           d > 70 ? '#EB984E' :
           d > 50 ? '#FFC300' :
           d > 30 ? '#F4D03F' :
           d > 10 ? '#D8EA3C' :
                    '#80E71A';
}

function style(feature) {
    return {
        fillColor: getColor(feature.geometry.coordinates[2]),
        opacity: 1,
        color: 'black',
        fillOpacity: 0.7,
        weight: .5
    };
}


function pointToLayer(feature, latlng) {
  return L.circleMarker(latlng,{radius: feature.properties.mag * 3});
}

function onEachFeature(feature, layer) {
  layer.bindTooltip('Magnitude ' + feature.properties.mag + '<br>Location: ' + feature.properties.place + '<br>Depth: ' + feature.geometry.coordinates[2] + 'M');
}

// Creating the map object
let myMap = L.map("map", {
  center: [41, -120],
  zoom: 4.5
});

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
//let link = geoJsonURL;


let legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> &nbsp' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            console.log('Div', div.innerHTML);
    }

    return div;
};
legend.addTo(myMap);

// Getting our GeoJSON data
d3.json(geoJsonURL).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data
  L.geoJSON(data, {pointToLayer: pointToLayer,
                   style: style,
                   onEachFeature: onEachFeature}).addTo(myMap);  
});

