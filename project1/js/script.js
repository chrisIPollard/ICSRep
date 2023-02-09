//1. creating variables:

let latitude;
let longitude;

//2. these are placeholder coordinates so I can tell at a glance if the functions are working:

let startLat = 19.8968;
let startLng = -155.5828;

//3. Basics for leaflet:

src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
                integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
                crossorigin=""

var map = L.map('map').setView([startLat, startLng], 6);
                      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      }).addTo(map);


//4. Geolocation (change/fix the event!):

// document.getElementById('placeholder').onclick = function geoFindMe(coordinates) {
  
// 	// API call as a function: 

// function APILatLngCall(position){

// 	console.log(position.coords.latitude);

// 	$.ajax({
// 		url: "php/getCountryCodeFromLatLng.php",
// 		type: 'POST',
// 		dataType: 'json',
// 		data: {
// 			lat: position.coords.latitude,
// 			lng: position.coords.longitude
// 		},
// 		success: function(result) {

// 			console.log(JSON.stringify(result));

// 			if (result.status.name == "ok") {

// 				$('#txtCountryCode').html(result['data']['code']);
								
// 			}
		
// 		},
// 		error: function(jqXHR, textStatus, errorThrown) {
// 			console.log(jqXHR);
// 		}
// 	}); 

// };
  
// 	function error() {
// 	  console.log('Unable to retrieve your location');
// 	}

// this is the bit that runs the geolocation method using the API function from above:

// 	if (!navigator.geolocation) {
// 		console.log('Geolocation is not supported by your browser');
// 	} else {
// 		console.log('Locating');
// 	  navigator.geolocation.getCurrentPosition(APILatLngCall, error);
// 	}
  
// }

// 5. here I am creating an event to use the country code from the dropdown to take the relevant country perimeter coordimnates from the local json 'countryBorders' file so they can be put in the map to mark a perimeter. However this generates the error code: 'SyntaxError: JSON.parse: unexpected character at line 1 column 1 of the JSON data'. I have commented out further code to determine that the issue seems to relate to the data type not being recognised, however I have identified it as json data on line 79:

document.getElementById('btnRun1').onclick = function btnfunc1(){
const url = 'json/countryBorders.geo.json';
	fetch(url)
	.then(res => res.json())
	.then((res) => {console.log(res);})
    
}
    
//     data => {
//     useData(data);})
// }
	
// function useData(data){
//   console.log(data);}
 
// 	// data.forEach(features){
//   //   if (properties.iso_a2 == $('#btnRun1').val())
//   //   {
//   //       console.log(geometry.coordinates);
//   //   }
//   //   }}
