//creating variables:

let countryNamesAndCodes;
let select = document.getElementById("selCountry");
let localCountryCode;
let borders;

//establishing the map:

var map = L.map('map').setView([51.5072, 0.1276], 6);
                      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      }).addTo(map);

//making extramarkers:

var airportIcon = L.ExtraMarkers.icon({
  icon: 'fa-plane',
  markerColor: 'green',
  shape: 'penta',
  prefix: 'fa',
  });
  
let cityIcon = L.ExtraMarkers.icon({
  icon: 'fa-city',
  markerColor: 'green',
  shape: 'penta',
  prefix: 'fa',
  });

//polygons for the cluster groups:

var airports = L.markerClusterGroup({
  polygonOptions: {
    fillColor: 'green',
    color: 'green',
    weight: 2,
    opacity: 0.5,
    fillOpacity: 0.3
  }}).addTo(map);

var cities = L.markerClusterGroup({
  polygonOptions: {
    fillColor: 'green',
    color: 'green',
    weight: 2,
    opacity: 0.5,
    fillOpacity: 0.3
  }}).addTo(map);

var overlays = {
    "Airports": airports,
    "Cities": cities
  };

//This is styling the country borders polygon: 

function mapStyle(feature) {
                        return {
                            fillColor: 'yellow',
                            weight: 2,
                            opacity: 0.5,
                            color: 'green',  //Outline color
                            fillOpacity: 0.3
                        };
                    }

// This is a function to tidy up numbers used within some of the pop ups:
function giveCommas (stringNumber) {
  number = Number(stringNumber);
  number = number.toLocaleString();
  return number;}

// This is an is an Ajax request to a local GeoJSON file via a PHP file. It returns country names and codes in alphabetical pairs to populate the drop down as the JSON object 'countryCodes'. This should run on page load.  

$(function getCountryCodes(){
  
  $.ajax({
    url: 'php/getCountryCodesFromLocalFile.php',
    type: 'GET',
    dataType: "json",
    
    success: function(countryCodes) {
    
    countryNamesAndCodes = countryCodes.countryCodes;
    countryNamesAndCodes = JSON.parse(countryNamesAndCodes);
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

//4. This runs Geolocation and returns a country code value for id='txtCountryCode':

$(function geoFindMe(coordinates) {
  
	// API call as a function: 

function APILatLngCall(position){

	$.ajax({
		url: "php/getCountryCodeFromLatLng.php",
		type: 'POST',
		dataType: 'json',
		data: {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		},
		success: function(result) {

			
      localCountryCode = result['countryCode'];

      //this line selects the country from the geolocation from the dropdown:
      $(selCountry).val(localCountryCode).change()
      
},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	}); 

};
  
	function error() {
	  console.log('Unable to retrieve your location');
	}

// this runs the geolocation method using the API function from above:

	if (!navigator.geolocation) {
		console.log('Geolocation is not supported by your browser');
	} else {
		console.log('Locating');
	  navigator.geolocation.getCurrentPosition(APILatLngCall, error);
	}
  
})

//This is the dropdown event handler, creating country borders polygon: 

document.getElementById('selCountry').onchange = function getCountryCoordinates(){

  $.ajax({
    url: 'php/getCoordinatesFromLocalFile.php',
    type: 'GET',
    dataType: "json",
    data: {countryCode: $('#selCountry').val()},

    success: function(result) {
        
    coordinates = result.result;
    if (borders){borders.clearLayers();};
     
    borders = L.geoJSON(coordinates, {style: mapStyle}).addTo(map);
    map.fitBounds(borders.getBounds());},

    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }}); 

//this is to get the countries airports:

$.ajax({
  url: 'php/getAirports.php',
  type: 'POST',
  dataType: 'json',
  data: {
    iso: $('#selCountry').val()
  },
  success: function (result) {

    //console.log(JSON.stringify(result));
          
    if (result.status.code == 200) {

      airports.clearLayers();
      
      result.data.forEach(function(item) {

        L.marker([item.lat, item.lng], {icon: airportIcon})
          .bindTooltip(item.name, {direction: 'top', sticky: true})
          .addTo(airports);
        
      })
    } 
  },
  error: function (jqXHR, textStatus, errorThrown) {
    //console.log(jqXHR);
  }
}); 

//this is to get the countries cities:

$.ajax({
  url: 'php/getCities.php',
  type: 'POST',
  dataType: 'json',
  data: {
    iso: $('#selCountry').val()
  },
  success: function (result) {

    //console.log(JSON.stringify(result));
          
    if (result.status.code == 200) {

      cities.clearLayers();  

      result.data.forEach(function(item) {

        L.marker([item.lat, item.lng], {icon: cityIcon})
          .bindTooltip(item.name, {direction: 'top', sticky: true})
          .addTo(cities);
        
      })
    } 
  },
  error: function (jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
  }
});   

    //this bracket closes the dropdown led functions:
    }   
  
// data modal: 

L.easyButton('fa-solid fa-flag fa-lg', function(btn, map){
  $('#dataModal').modal("show"); 
  $($.ajax({
    url: "php/getCountryInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {country: $('#selCountry').val()},
    success: function(result) {

      //console.log(JSON.stringify(result));

    if (result.status.name == "ok") {
        $('#countryName').html(result['data'][0]['countryName']);
        $('#continent').html(result['data'][0]['continent']);
        $('#capital').html(result['data'][0]['capital']);
        $('#languages').html(result['data'][0]['languages']);
        $('#population').html(giveCommas(result['data'][0]['population']));
        $('#area').html(giveCommas(Math.round(result['data'][0]['areaInSqKm'])));       
        
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  })) 
  $($.ajax({
    url: "php/getFlag.php",
    type: 'POST',
    dataType: 'json',
    data: {country: $('#selCountry').val()},
    success: function(result) {

      console.log(JSON.stringify(result));

    if (result.status.name == "ok") {      
        $('#flag').attr("src", result);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  })) 
}).addTo(map); 



