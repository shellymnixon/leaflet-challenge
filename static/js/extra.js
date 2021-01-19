var earthquake = new L.LayerGroup()
var tplates = new L.LayerGroup()
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  })
  


  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> ©  <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  var myMap = L.map("map", {
    center: [36.77, -119.4179],
    zoom: 5
  });
  streetmap.addTo(myMap);
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  
  var overlayMaps = {
    "Earthquakes": earthquake,
    "TPlates": tplates
  };
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  d3.json(link, function(data) {
      function getColor(i){
        return i > 90 ? "#F30" :
        i > 70  ? "#F60" :
        i > 50  ? "#F90" :
        i > 30  ? "#FC0" :
        i > 10   ?  "#FF0" :
                 "#9F3";
      }
  
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: (feature.properties.mag)*4,
                fillColor: getColor(feature.geometry.coordinates[2]),
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h1>" + feature.properties.mag + "</h1> <hr> <h2>" + feature.properties.place + "</h2>");

    }
  }).addTo(earthquake)
  earthquake.addTo(myMap);
  function getColors(i){
    return i > 5 ? "#F30" :
    i > 4  ? "#F60" :
    i > 3  ? "#F90" :
    i > 2  ? "#FC0" :
    i > 1   ?  "#FF0" :
             "#9F3";
  }

  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (myMap) {
    var div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 1, 2, 3, 4, 5],
      labels = [];
    
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColors(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(myMap);
  
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
  function(tdata){
      L.geoJson(tdata, {

      }).addTo(tplates)
      tplates.addTo(myMap)
  })
})