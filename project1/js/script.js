//1. creating variables:

let latitude;
let longitude;
let coordinates;



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

                      
                      

// //4. Geolocation (change/fix the event!):

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

//5. here I am making an ajax request to use the dropdown in the index file to use the country code as '$('#btnRun1').val()' to use the PHP file 'getCoordinatesFromLocalFile' to match to the relevant country in the local json 'countryBorders' file then to return the perimeter coordinates. 



document.getElementById('btnRun1').onclick = function getCountryCoordinates(){
  console.log($('#selCountry').val());

        $.ajax({
          url: 'php/getCoordinatesFromLocalFile.php',
          type: 'GET',
          data: {countryCode: $('#selCountry').val()},

          success: function(result) {

              console.log(result);

//6 This should take the coordinates from the geo.json file and add them as a feature, then adjust the map to view the feature:
          
              coordinates = result;
              console.log(coordinates);
             // console.log(coordinates["result"]);
             // console.log(coordinates['type']);
              console.log(typeof coordinates);
             // coordinates = coordinates.slice(10,2683);
             // console.log(coordinates);
              coordinates = JSON.parse(coordinates);
              console.log(typeof coordinates);
              L.geoJSON(coordinates).addTo(map);
              map.fitBounds(L.geoJSON(result).getBounds()); 
            
          
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          }
        }); 
    }
