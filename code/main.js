//var key = '48290249653eb9547c40ec7f2cb6f7f3'
var key = '52206d0cf2d75aaab1a660bb4bab557d'

//var fletcherVenueId = '5c92fddf0a5ba80016fdf5db';
var muId = '5c9f9118032cb00016377a2c'
var lat = 33.417983;
var lng = -111.935884;
var updateFeq = 800;
var posChange = false;

var markers = new Array();

Mapwize.apiKey(key);

var map = new Mapwize.Map({
	container: 'mapwize',
	useBrowserLocation: true,
	userPositon: true,
	userPositionControl: true
});

setup();

function setup(){
	var url = 'https://wanderdrone.appspot.com';
	mapCenter(muId);
	//current location
	if (navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(position){
			var locationMarker = null;
			if(locationMarker){
				//display this if bug
			}

			lat = position.coords["latitude"];
			lng = position.coords["longitude"];
		},
		function(error){
			console.log("Error: ", error);
			},
			{		
				enableHighAccuracy: true
			}
		);
	}

var keys = {};
window.onkeyup = function(e) { 
	keys[e.keyCode] = false; 
	posChange = false;
}
window.onkeydown = function(e) { 
	keys[e.keyCode] = true;
	posChange = true; 
}

map.on('mapwize:userpositionchange', e => {
	console.log('User position changed to ' + e.userPosition);
});

map.on('mapwize:venuewillenter', venue => {
    console.log('Venue will enter: ' + venue);
});
map.on('mapwize:venueenter', venue => {
    console.log('Venue entered: ' + venue);
});
map.on('mapwize:venueentererror', error => {
    console.log('Venue enter failed: ' + error);
});
map.on('mapwize:click', e => {
    console.log(e);
});

	try{
		map.on('load', function(){
			window.setInterval(function(){
				map.getSource('drone').setData(url);

				if (posChange == true){
					controlUpdate(keys);

					map.setUserPosition({
					latitude: lat,
					longitude: lng,
					floor: 1
					//accuracy: 5
					});
				}
			}, updateFeq);

			//example of how we should get user position and place it on map
			map.addSource('drone', {type: 'geojson', data: url});
			map.addLayer({
				"id": "drone",
				"type": "symbol",
				"source": "drone",
				"layout": {
					"icon-image": "rocket-15"
				}
			});
		});
	}
	catch(err){
		return console.error('something bad happend', err);
	}
}

function mapCenter(venueId){
	map.centerOnVenue(venueId);
	console.log("map has been centered on venue with id = " + venueId );
}

Mapwize.Api.getLayers({}).then((layers) => {
});


/**
newMarker(lat, lng)
* create a new marker at the coorisponding lng/lat and floor
* marker will be pushed into stack
*/
function newMarker(lat, long, floor){
	let marker = {latitude: lat, longitude: long, floor: floor};
	markers.push(marker);
}

/**
* controlUpdate()
* manually move the useres current position using wasd keys
* each key controls the users lng/lat position
*/
function controlUpdate(keys){
	console.log("controls are being pressed");
	//w key
	if (keys[87] == true){
		lat = lat + 0.00005;
	}
	//s key
	else if (keys[83] == true){
		lat = lat - 0.00005;
	}
	//a key
	else if (keys[65] == true){
		lng = lng - 0.00005;
	}
	//d key
	else if (keys[68] == true){
		lng = lng + 0.00005;
	}
}