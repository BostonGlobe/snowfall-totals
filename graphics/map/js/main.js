// Require libraries.
var Leaflet = require('leaflet');
var APDateTime = require('../../../common/js/APDateTime.js');

// Convenience variables.
var master = $('.igraphic-graphic.map');
var $map = $('.content .map', master);

// Create the Leaflet map.
var map = L.map($map.get(0), {
	attributionControl: false,
	scrollWheelZoom: false
// }).setView([42.25841962, -71.81532837], 6);
}).setView([42.25841962, -76], 8);
// }).setView([42.30169032824452, -70.9061050415039], 11);

// 42.30169032824452;
// 	json.snowfall_points[0].longitude = -70.9061050415039

// Add the MapBox baselayer to our map.
L.tileLayer('http://{s}.tiles.mapbox.com/v3/gabriel-florit.36cf07a4/{z}/{x}/{y}.png', {
	minZoom: 6,
	maxZoom: 10
}).addTo(map);

// Define the snowfall image bounds.
var customBounds = [[30.8, -85.7], [47.58, -67]]; // we came up with these after much tweaking
var sourceBounds = [[31, -85.5, ], [47.5, -67]]; // this is what the National Weather Service uses

// Add the snowfall image to the map.
var imageLayer = L.imageOverlay('http://amzncache.boston.com/partners/maps/snowfall.png', customBounds).addTo(map);

// Create a Leaflet control for the legend.
var MyControl = L.Control.extend({

	options: {
		position: 'topright'
	},

	onAdd: function (map) {

		var container = L.DomUtil.create('div', 'legend leaflet-bar');

		// Insert the legend contents.
		container.innerHTML = $('.legend', master).html();

		return container;
	}
});

// Only add the control if we're not on touch screens.
if (!Modernizr.touch) {
	map.addControl(new MyControl());
}

function intersectRect(r1, r2) {
	// return false;
	return !(r2.left > r1.right || 
	r2.right < r1.left || 
	r2.top > r1.bottom ||
	r2.bottom < r1.top);
}

function populateUpdatedAt(date) {

	// Populate the 'updated' element.
	$('.updated-timestamp').html('Updated ' + [APDateTime.time(date), APDateTime.date(date)].join(', '));
}

function getIconDimensions(zoom) {

	return {
		6: {
			width: 36,
			height: 21
		},
		7: {
			width: 36,
			height: 21
		},
		8: {
			width: 48,
			height: 27
		},
		9: {
			width: 48,
			height: 27
		},
		10: {
			width: 64,
			height: 36
		}
	}[zoom];
}

var markersLayer;
var allPoints;

function addMarkersToMap(zoom) {

	var iconDimensions = getIconDimensions(zoom);

	var ICON_WIDTH = iconDimensions.width;
	var ICON_HEIGHT = iconDimensions.height;

	var markers = [];

	// for each point,
	// find the absolute pixel coordinates for the given zoom level
	// assuming we're center aligning the point,
	// find the point's bounding box in pixel coordinates
	allPoints.forEach(function(point, index) {

		var pointCoords = map.project([point.latitude, point.longitude]);

		var pointBBox = {
			left: pointCoords.x - ICON_WIDTH/2,
			right: pointCoords.x + ICON_WIDTH/2,
			bottom: pointCoords.y + ICON_HEIGHT/2,
			top: pointCoords.y - ICON_HEIGHT/2
		};

		// make sure this bbox doesn't overlap with any existing markers
		var overlaps = _.some(markers, function(marker) {

			var markerCoords = map.project(marker._latlng);

			var markerBBox = {
				left: markerCoords.x - ICON_WIDTH/2,
				right: markerCoords.x + ICON_WIDTH/2,
				bottom: markerCoords.y + ICON_HEIGHT/2,
				top: markerCoords.y - ICON_HEIGHT/2
			};

			return intersectRect(pointBBox, markerBBox);
		});

		// if it doesn't overlap, add to markers layer
		if (!overlaps) {

			var icon = L.divIcon({
				html: '<span class="wrapper _zoom' + zoom + '"><span class="shield">&#9679;</span><span class="label">' + point.snowfall + '”</span></span>',
				className: 'snowfall'
			});

			var marker = L.marker([point.latitude, point.longitude], {
				icon: icon,
				clickable: false
			});
			markers.push(marker);

		}

	});

	if (markersLayer) {
		map.removeLayer(markersLayer);
	}

	markersLayer = L.layerGroup(markers);

	markersLayer.addTo(map);
}

map.on('zoomend', function(e) {
	addMarkersToMap(map.getZoom());
});

window.snowfall_scraper = function(json) {

	var ts = json.timestamp;

	var date = new Date(`${ts.month} ${ts.day}, ${ts.year}, ${ts.hour}:${ts.minutes} ${ts.mode}`);
	populateUpdatedAt(date);

	allPoints = json.snowfall_points;
	addMarkersToMap(map.getZoom());
};

$.ajax({
	url: 'http://cache.boston.com/partners/snowfallscraper/snowfall_scraper.json',
	dataType: 'jsonp',
	jsonpCallback: 'snowfall_scraper'
});