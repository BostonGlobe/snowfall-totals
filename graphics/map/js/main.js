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
}).setView([42.25841962, -71.81532837], 7);

// Add the MapBox baselayer to our map.
L.tileLayer('http://{s}.tiles.mapbox.com/v3/gabriel-florit.36cf07a4/{z}/{x}/{y}.png', {
	minZoom: 5,
	maxZoom: 11
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












// window.colorbar = {};
// window.pointKml = {};
// window.titlePns = {};
// window.image = {};
// window.masterKmlFile = {};
// $.getScript('http://www.erh.noaa.gov/hydromet/eventdata/stormTotalv3_24/latestInfo.js', function(e) {

// 	debugger;

// });






// var points = require('./points.json');



// // for each point,
// // find the absolute pixel coordinates for the given zoom level
// // assuming we're center aligning the point,
// // find the point's bounding box in pixel coordinates
// points.forEach(function(point, index) {

// 	var pointCoords = map.project([point.latitude, point.longitude]);

// 	var pointBBox = {
// 		left: pointCoords.x - ICON_WIDTH/2,
// 		right: pointCoords.x + ICON_WIDTH/2,
// 		bottom: pointCoords.y + ICON_HEIGHT/2,
// 		top: pointCoords.y - ICON_HEIGHT/2
// 	};

// 	// make sure this bbox doesn't overlap with any existing markers
// 	var overlaps = _.some(markers, function(marker) {

// 		var markerCoords = map.project(marker._latlng);

// 		var markerBBox = {
// 			left: markerCoords.x - ICON_WIDTH/2,
// 			right: markerCoords.x + ICON_WIDTH/2,
// 			bottom: markerCoords.y + ICON_HEIGHT/2,
// 			top: markerCoords.y - ICON_HEIGHT/2
// 		};

// 		return intersectRect(pointBBox, markerBBox);
// 	});

// 	// if it doesn't overlap, add to markers layer
// 	if (!overlaps) {

// 		var icon = L.divIcon({
// 			html: '<span>' + point.snowfall + '”</span>',
// 			className: 'snowfall',
// 			iconSize: 100
// 		});

// 		var marker = L.marker([point.latitude, point.longitude], {icon: icon});
// 		markers.push(marker);

// 	}

// });

// L.layerGroup(markers).addTo(map);



function intersectRect(r1, r2) {
	return !(r2.left > r1.right || 
	r2.right < r1.left || 
	r2.top > r1.bottom ||
	r2.bottom < r1.top);
}


function populateUpdatedAt(date) {

	// Populate the 'updated' element.
	$('.updated-timestamp').html('Updated ' + [APDateTime.time(date), APDateTime.date(date)].join(', '));
}

var ICON_WIDTH = 38 + 10;
var ICON_HEIGHT = 18 + 10;

var markersLayer;
var allPoints;

function addMarkersToMap() {

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
				html: '<span>' + point.snowfall + '”</span>',
				className: 'snowfall',
				iconSize: 100
			});

			var marker = L.marker([point.latitude, point.longitude], {icon: icon});
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
	addMarkersToMap();
});

window.snowfall_scraper = function(json) {

	var ts = json.timestamp;

	var date = new Date(`${ts.month} ${ts.day}, ${ts.year}, ${ts.hour}:${ts.minutes} ${ts.mode}`);
	populateUpdatedAt(date);

	allPoints = json.snowfall_points;
	addMarkersToMap();
};

$.ajax({
	url: 'http://cache.boston.com/partners/snowfallscraper/snowfall_scraper.json',
	dataType: 'jsonp',
	jsonpCallback: 'snowfall_scraper'
});