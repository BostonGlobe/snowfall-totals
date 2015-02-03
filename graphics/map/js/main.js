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
}).setView([42.25841962, -71.81532837], 10);
// }).setView([0, 0], 2);

// Add the MapBox baselayer to our map.
L.tileLayer('http://{s}.tiles.mapbox.com/v3/gabriel-florit.baselayer_land/{z}/{x}/{y}.png', {
// L.tileLayer('http://{s}.tiles.mapbox.com/v3/gabriel-florit.207de5da/{z}/{x}/{y}.png', {
	minZoom: 6,
	maxZoom: 11
}).addTo(map);

// Define the snowfall image bounds.
// 31, -85.5
// 47.5, -67
var southWest = new L.LatLng(30.8, -85.7),
	northEast = new L.LatLng(47.58, -67),
	bounds = new L.LatLngBounds(southWest, northEast);

// Add the snowfall image to the map.
// var imageLayer = L.imageOverlay('http://amzncache.boston.com/partners/maps/snowfall.png', bounds).addTo(map);
// var imageLayer = L.imageOverlay('js/snowfall.png', bounds).addTo(map);
var imageLayer = L.imageOverlay('http://cache.boston.com/multimedia/graphics/projectFiles/2015/snowfall/snowfall12.png', bounds).addTo(map);

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

// var ICON_WIDTH = 38 + 10;
// var ICON_HEIGHT = 18 + 10;

// var markers = [];

// function intersectRect(r1, r2) {
// 	return !(r2.left > r1.right || 
// 	r2.right < r1.left || 
// 	r2.top > r1.bottom ||
// 	r2.bottom < r1.top);
// }

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





function populateUpdatedAt(date) {

	// Populate the 'updated' element.
	$('.updated-timestamp').html('Updated ' + [APDateTime.time(date), APDateTime.date(date)].join(', '));
}

window.snowfall_scraper = function(json) {

	var ts = json.timestamp;

	var date = new Date(`${ts.month} ${ts.day}, ${ts.year}, ${ts.hour}:${ts.minutes} ${ts.mode}`);
	populateUpdatedAt(date);


};

$.ajax({
	url: 'http://cache.boston.com/partners/snowfallscraper/snowfall_scraper.json',
	dataType: 'jsonp',
	jsonpCallback: 'snowfall_scraper'
});