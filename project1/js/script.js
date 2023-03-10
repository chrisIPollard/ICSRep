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

// this is in the index and doesn't work if moved from there: 
// src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
//                 integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
//                 crossorigin=""

var map = L.map('map').setView([startLat, startLng], 6);
                      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      }).addTo(map);

                      
                      

//4. This runs Geolocation and returns a country code value for id='txtCountryCode':

$(function geoFindMe(coordinates) {
  
	// API call as a function: 

function APILatLngCall(position){

	console.log(position.coords.latitude);
  
// adding a 'you are here' marker with the coordinates:
latitude = position.coords.latitude;
longitude = position.coords.longitude;
var hereMarker = L.marker([latitude, longitude]);
hereMarker.bindTooltip('You are here.', {permanent: true});
hereMarker.openTooltip();
hereMarker.addTo(map);

//using the wiki function:
$(wikiData(latitude, longitude))

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

      //these lines are to populate the data overlay for the local country
      $('#popupCountryCode').html('<li>Country Code: ' + localCountryCode + '</li>');
      $($.ajax({
        url: 'php/getCountryFromLocalFile.php',
        type: 'GET',
        dataType: "json",
        data: {countryCode: localCountryCode},

        success: function(result) {
          
        country = result.result;
                
        //This now works, so remove and add to the dropdown side. Maybe remove languages as it looks messy. 
        $($.ajax({
          url: "php/getCountryInfo.php",
          type: 'POST',
          dataType: 'json',
          data: {country: localCountryCode},
          success: function(result) {
    
            console.log(JSON.stringify(result));
    
            $(weather(result['data'][0]['capital'])); 

            if (result.status.name == "ok") {
              $('#popupContinent').html('<li>Continent: ' + result['data'][0]['continent'] + '</li>');
              $('#popupCapital').html('<li>Capital: ' + result['data'][0]['capital'] + '</li>');
              $('#popupLanguages').html('<li>Languages: ' + result['data'][0]['languages'] + '</li>');
              $('#popupPopulation').html('<li>Population: ' + result['data'][0]['population'] + '</li>');
              $('#popupArea').html('<li>Area (km2): ' + result['data'][0]['areaInSqKm'] + '</li>');

              //ex rate:
              $(exchangeRate (result['data'][0]['currencyCode']));

            }
          
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          }
        })) 

        $('#popupCountry').html('<h3>' + country + '</h3>');
        },

        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
        }   

      }))

      
      if (result.status.name == "ok") {
        
        				$('#txtCountryCode').val(localCountryCode);

        //sending the code to the local file to get country coordinates:
				$(function getCountryCoordinates(){

        $.ajax({
          url: 'php/getCoordinatesFromLocalFile.php',
          type: 'GET',
          dataType: "json",
          data: {countryCode: localCountryCode},

          success: function(result) {
            
          coordinates = result.result;
          //map.removeLayer(borders);
          var borders = L.geoJSON(coordinates).addTo(map);
          map.fitBounds(borders.getBounds());},

          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          }
        }); 
        })				
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

// this is populating the data overlay with the dropdown value. Repetition of earlier code - tidy up. 

        $($.ajax({
          url: "php/getCountryInfo.php",
          type: 'POST',
          dataType: 'json',
          data: {country: $('#selCountry').val()},
          success: function(result) {
    
            console.log(JSON.stringify(result));

            //this line is for the weather function:
            $(weather(result['data'][0]['capital'])); 
    
            if (result.status.name == "ok") {
              $('#popupContinent').html('<li>Continent: ' + result['data'][0]['continent'] + '</li>');
              $('#popupCapital').html('<li>Capital: ' + result['data'][0]['capital'] + '</li>');
              $('#popupLanguages').html('<li>Languages: ' + result['data'][0]['languages'] + '</li>');
              $('#popupPopulation').html('<li>Population: ' + result['data'][0]['population'] + '</li>');
              $('#popupArea').html('<li>Area (km2): ' + result['data'][0]['areaInSqKm'] + '</li>');
            }
          
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          }
        })) 
        
//these lines are to populate the data overlay for the local country. They repeat code from above so need to fix to reuse. 
$('#popupCountryCode').html('<li>Country Code: ' + $('#selCountry').val() + '</li>');
$($.ajax({
  url: 'php/getCountryFromLocalFile.php',
  type: 'GET',
  dataType: "json",
  data: {countryCode: $('#selCountry').val()},

  success: function(result) {
    
  country = result.result;
  console.log('country?' + country);
  $('#popupCountry').html('<h3>' + country + '</h3>');
  },

  error: function(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
  }
}))

        $.ajax({
          url: 'php/getCoordinatesFromLocalFile.php',
          type: 'GET',
          dataType: "json",
          data: {countryCode: $('#selCountry').val()},

          success: function(result) {
              
          coordinates = result.result;
          //map.removeLayer(borders);
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

//7 this relates to #dataPopup and its children:

const popup = document.getElementById('dataPopup');

document.getElementById('closePopup').onclick = function closeDataPopup(){
popup.style.display = 'none';}

// This part generates the popup when the page loads, I may want to move this inside the function that calls the relevant data when it is built.

window.onload = () => {
popup.style.display = 'block';

};

  // This is the toggle in the nav bar. 

  togglePopup.addEventListener('click', function() {
    $(document.getElementById('dataPopup')).toggle();
    });

    // these are button effects. A little unwieldy because I had to avoid quicker 'active' methods because some of the PHP calls leave those IDs active permanently.   

    document.getElementById('btnRun1').addEventListener('mousedown', function() {
      btnRun1.classList.add('clicked'); 
    });

    document.getElementById('btnRun1').addEventListener('mouseup', function() {
      btnRun1.classList.remove('clicked'); 
    });

    document.getElementById('togglePopup').addEventListener('mousedown', function() {
      togglePopup.classList.add('clicked'); 
    });

    document.getElementById('togglePopup').addEventListener('mouseup', function() {
      togglePopup.classList.remove('clicked'); 
    });
    
    document.getElementById('closePopup').addEventListener('mousedown', function() {
      closePopup.classList.add('clicked'); 
    });

    document.getElementById('closePopup').addEventListener('mouseup', function() {
      closePopup.classList.remove('clicked'); 
    });


// This section is to make the main popup dragable. 
const popupMove = document.getElementById('dataPopup');
let mousePos = { x: 0, y: 0 };
let popupPos = { x: 0, y: 0 };
let isDragging = false;
popupMove.addEventListener('mousedown', (e) => {
  isDragging = true;
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  popupPos.x = popupMove.offsetLeft;
  popupPos.y = popupMove.offsetTop;
});
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - mousePos.x;
    const deltaY = e.clientY - mousePos.y;
    popupMove.style.left = `${popupPos.x + deltaX}px`;
    popupMove.style.top = `${popupPos.y + deltaY}px`;
  }
});
document.addEventListener('mouseup', () => {
  isDragging = false;
});


//this is the weather function to place within other calls above
function weather(capital) {

  $.get('https://api.openweathermap.org/data/2.5/weather?q=' + capital + '&appid=a0e29cd38e23aec7ad4c1504ac3c63b8', function(data) {
    console.log(data) 
    let weatherResult = data;
    $('#popupWeather').html('<li>Weather: ' + weatherResult['weather'][0]['description'] + '</li>'); 
    $('#popupTemperature').html('<li>Temperature: ' + String(Math.ceil(parseFloat(weatherResult['main']['temp']) - 273.15)) + '°C </li>'); 

});
};

// exchange rate function:
function exchangeRate (currencyCode){ 
  
$.get('https://openexchangerates.org/api/latest.json', {app_id: 'f9d4247ca1f5440bb89696cedb79436d'}, function(data) {
  $('#popupCurrency').html('<li>Currency: ' + currencyCode + ' at ' + data.rates.currencyCode +' to USD</li>'); 
    let exRates = data;
    console.log(currencyCode);
    console.log('rate is' + exRates.rates.currencyCode);
    console.log("Currently trading at " + data.rates.currencyCode + " to the dollar.");
});}

// Making a wiki function:

function wikiData(lat, lng){

$($.ajax({
  url: "php/getWikiInfo.php",
  type: 'POST',
  dataType: 'json',
  data: {
    lat: lat,
    lng: lng
  },
  success: function(result) {

    console.log(JSON.stringify(result));

    if (result.status.name == "ok") {
    
    let summary = result.data[0]['summary'];
    summary = summary.substring(0, summary.length-5);
    
    console.log(result);
    let hereMarker = L.marker([result.data[0]['lat'], result.data[0]['lng']]);
    hereMarker.bindPopup( '<a href=https://' + result.data[0]['wikipediaUrl'] + '>' + summary, {permanent: true} + '</a>').openPopup()
    hereMarker.openTooltip();
    hereMarker.addTo(map);

    }
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
  }
}))}
	
