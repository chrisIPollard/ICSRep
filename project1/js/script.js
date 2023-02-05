//1. creating variables:

let latitude;
let longitude;
let lat;
let lng;
let coordinates = [];

//2. this bit will be rewritten as a function, but I need to return the coordinates before I can develop it:


if (coordinates[0]) {lat = coordinates[0]}
else
{lat = 19.8968};
if (coordinates[1]) {lng = coordinates[1]}
else
{lng = -155.5828};

//3. Basics for leaflet:

src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
                crossorigin=""

var map = L.map('map').setView([lat, lng], 6);
                      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      }).addTo(map);


//4. Geolocation - this successfully gets the lat & lng and converts them to HTML, but returning the array on line 49 results in 'undefined' values when I console log the results via inspecting the webpage, after the function has run:

function geoFindMe(coordinates) {

	const status = document.querySelector('#status');
	const mapLink = document.querySelector('#map-link');
  
	
	mapLink.textContent = '';
  
	function success(position) {
	  latitude  = position.coords.latitude;
	  longitude = position.coords.longitude;
  
	  status.textContent = '';
	  
	  mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

	  return coordinates = [latitude, longitude];
	}
  
	function error() {
	  status.textContent = 'Unable to retrieve your location';
	}
  
	if (!navigator.geolocation) {
	  status.textContent = 'Geolocation is not supported by your browser';
	} else {
	  status.textContent = 'Locating…';
	  navigator.geolocation.getCurrentPosition(success, error);
	}
  
  }
  
  document.querySelector('#find-me').addEventListener('click', geoFindMe(coordinates));

// 5. Here I've stripped back the above function to create a function that I could use in code to call the lat coordinates. However the problem persists - when I console log the function via inspecting the webpage it returns undefined, not the coordinates:


  function getLat() {
	
	function success(position) {
	  return position.coords.latitude;
	}
	function error() {
		return 1;
	  }
  
	if (!navigator.geolocation) {
	  return 2;
	} else {
	  navigator.geolocation.getCurrentPosition(success, error);
	}};
