var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var map;


function getRadius(magnitude) {
    return magnitude * 4;
};
d3.json(queryUrl, function(data) {


    function createFeatures(data) {
        function getColor(magnitude) {
            switch (true) {
                case magnitude > 5:
                    return "#ea2c2c";
                case magnitude > 4:
                    return "#ea822c";
                case magnitude > 3:
                    return "#ee9c00";
                case magnitude > 2:
                    return "#eecc00";
                case magnitude > 1:
                    return "#d4ee00";
                default:
                    return "#98ee00";
            }
        }

        function styleInfo(feature) {
            return {
                opacity: 1,
                fillOpacity: 1,
                fillColor: getColor(feature.properties.mag),
                color: "#000000",
                radius: getRadius(feature.properties.mag),
                stroke: true,
                weight: 0.5
            };
        }

        function onEachFeature(feature, Layer) {
            Layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><p>" + new Date(feature.properties.time) + ", Magnitude: " + feature.properties.mag + "</p>");
        };

        function pointToLayer(feature, latlng) {
            return L.circleMarker(latlng);
        };

        var earthquakes = L.geoJSON(data, {
            onEachFeature: onEachFeature,
            style: styleInfo,
            pointToLayer: pointToLayer
        }).addTo(map);


    }
    createFeatures(data.features);

    var legend = L.control({
        position: "bottomright"
    });
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var grades = [0, 1, 2, 3, 4, 5];
        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style= 'background: " + colors[i] + " ></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");

            return div;
        }




        function createMap(earthquakes) {

            var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
                attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                maxZoom: 18,
                id: "mapbox.satellite",
                accessToken: API_KEY
            });

            var grayscalemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
                attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                maxZoom: 18,
                id: "mapbox.grayscale",
                accessToken: API_KEY
            });

            var outdoorsmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
                attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
                maxZoom: 18,
                id: "mapbox.outdoors",
                accessToken: API_KEY
            });

            var baseMaps = {
                "Satellite Map": satellitemap,
                "Grayscale Map": grayscalemap,
                "Outdoors Map": outdoorsmap
            };

            var overlayMaps = {
                Earthquakes: earthquakes
            };

            map = new L.map("map", {
                center: [37.09, -95.71],
                zoom: 5,
                layers: [satellitemap, grayscalemap, outdoorsmap]
            });

            L.control.layers(baseMaps, overlayMaps, {
                collapsed: false
            }).addTo(map)
        }
    }
    createMap(earthquakes);
});