//1. creating variables:

let latitude;
let longitude;
let coordinates;
let countryNamesAndCodes;
let select = document.getElementById("selCountry");
let localCountryCode;

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

                      
                      

//4. This runs Geolocation and returns a country code value for id='txtCountryCode':

$(function geoFindMe(coordinates) {
  
	// API call as a function: 

function APILatLngCall(position){

	console.log(position.coords.latitude);

	$.ajax({
		url: "php/getCountryCodeFromLatLng.php",
		type: 'POST',
		dataType: 'json',
		data: {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		},
		success: function(result) {

			console.log(JSON.stringify(result));

			if (result.status.name == "ok") {
        localCountryCode = result['countryCode'];
        console.log(localCountryCode);


				$('#txtCountryCode').value(localCountryCode);

        //sending the code to the local file to get country coordinates:
				// $(function getCountryCoordinates(){
        // console.log(result['data']['code']);

        // $.ajax({
        //   url: 'php/getCoordinatesFromLocalFile.php',
        //   type: 'GET',
        //   dataType: "json",
        //   data: {countryCode: result['data']['code']},

        //   success: function(result) {
  
        //   coordinates = result.result;
        //   var borders = L.geoJSON(coordinates).addTo(map);
        //   map.fitBounds(borders.getBounds());},

        //   error: function(jqXHR, textStatus, errorThrown) {
        //     console.log(jqXHR);
        //   }
        // }); 
        // })				
			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	}); 

};
  
	function error() {
	  console.log('Unable to retrieve your location');
	}

// this is the bit that runs the geolocation method using the API function from above:

	if (!navigator.geolocation) {
		console.log('Geolocation is not supported by your browser');
	} else {
		console.log('Locating');
	  navigator.geolocation.getCurrentPosition(APILatLngCall, error);
	}
  
})

//5. This is an Ajax request to a local GeoJSON file via a PHP file. It returns country coordinates to leaflet and views the country. 

document.getElementById('btnRun1').onclick = function getCountryCoordinates(){
        console.log($('#selCountry').val());

        $.ajax({
          url: 'php/getCoordinatesFromLocalFile.php',
          type: 'GET',
          dataType: "json",
          data: {countryCode: $('#selCountry').val()},

          success: function(result) {

          //console.log(result.result);
       
          coordinates = result.result;
          //console.log(coordinates);
          //console.log(typeof coordinates);
          var borders = L.geoJSON(coordinates).addTo(map);
          map.fitBounds(borders.getBounds());},

          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          }
        }); 
    }

//6 This is an is an Ajax request to a local GeoJSON file via a PHP file. It returns country names and codes in alphabetical pairs to populate the drop down as the JSON object 'countryCodes'.  

$(function getCountryCodes(){
  
        $.ajax({
          url: 'php/getCountryCodesFromLocalFile.php',
          type: 'GET',
          dataType: "json",
          
          success: function(countryCodes) {

          
          countryNamesAndCodes = countryCodes.countryCodes;
          //console.log(countryNamesAndCodes);
          countryNamesAndCodes = JSON.parse(countryNamesAndCodes);
          //console.log(countryNamesAndCodes);
          //console.log(typeof(countryNamesAndCodes));
          //console.log(countryNamesAndCodes.length);
              $(function populateDropdown() {
              for (let i = 0; i < countryNamesAndCodes.length; i++) {
              var optn = countryNamesAndCodes[i];
              var opt = document.createElement("option");
              opt.textContent = optn[0];
              opt.value = optn[1];
              select.appendChild(opt);
              }})
          },
       
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          }
        }); 
    });
