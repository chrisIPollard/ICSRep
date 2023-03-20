//1. creating variables:

let latitude;
let longitude;
let coordinates;
let countryNamesAndCodes;
let select = document.getElementById("selCountry");
let localCountryCode;

//making extramarkers:

var youMarker = L.ExtraMarkers.icon({
  icon: 'fa-user',
  markerColor: 'green',
  shape: 'penta',
  prefix: 'fa',
  });
  
let infoMarker = L.ExtraMarkers.icon({
  icon: 'fa-info',
  markerColor: 'yellow',
  shape: 'penta',
  prefix: 'fa',
  });

let cityMarker = L.ExtraMarkers.icon({
  icon: 'fa-city',
  markerColor: 'yellow',
  shape: 'penta',
  prefix: 'fa',
  });

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

$(document.getElementById('weatherPopup')).hide();

                    L.easyButton('<img src="img/data.jpg">', function(btn, map){
                      $(document.getElementById('dataPopup')).toggle();
                      $(document.getElementById('weatherPopup')).hide();
                    }).addTo(map);     
                    L.easyButton('<img src="img/weather.jpg">', function(btn, map){
                      $(document.getElementById('weatherPopup')).toggle();
                      $(document.getElementById('dataPopup')).hide();
                    }).addTo(map);    
                    L.easyButton('<img src="img/wiki.jpg">', function(btn, map){
                      $(document.getElementById('wikiPopup')).toggle();
                    }).addTo(map);                  
                      

//4. This runs Geolocation and returns a country code value for id='txtCountryCode':

$(function geoFindMe(coordinates) {
  
	// API call as a function: 

function APILatLngCall(position){

// adding a 'you are here' marker with the coordinates:

latitude = position.coords.latitude;
longitude = position.coords.longitude;

var hereMarker = L.marker([latitude, longitude], { icon: youMarker });
hereMarker.bindTooltip('You are here.');
hereMarker.openTooltip();
hereMarker.addTo(map);

//using the wiki function:
$(wikiData(latitude, longitude))
$(weatherAPI (latitude, longitude))

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
                
        $($.ajax({
          url: "php/getCountryInfo.php",
          type: 'POST',
          dataType: 'json',
          data: {country: localCountryCode},
          success: function(result) {
    
            //this line for the wikiCountry function:
            $(wikiCountryData(result['data'][0]['countryName']));

          //  $(weather(result['data'][0]['capital'])); 
       
            if (result.status.name == "ok") {
              $('#popupContinent').html('<li>Continent: ' + result['data'][0]['continent'] + '</li>');
              $('#popupCapital').html('<li>Capital: ' + result['data'][0]['capital'] + '</li>');
              $('#popupLanguages').html('<li>Languages: ' + result['data'][0]['languages'] + '</li>');
              $('#popupPopulation').html('<li>Population: ' + giveCommas(result['data'][0]['population']) + '</li>');
              $('#popupArea').html('<li>Area (km2): ' + giveCommas(result['data'][0]['areaInSqKm']) + '</li>');  

              //this line is for the exchange rate function:
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
          //if (map.borders){map.removeLayer(borders);};
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

document.getElementById('selCountry').onchange = function getCountryCoordinates(){
  
// this is populating the data overlay with the dropdown value. 

        $($.ajax({
          url: "php/getCountryInfo.php",
          type: 'POST',
          dataType: 'json',
          data: {country: $('#selCountry').val()},
          success: function(result) {
    
            //console.log(JSON.stringify(result));

            //this line for the wikiCountry function:
            $(wikiCountryData(result['data'][0]['countryName']));
            
            // weather
            $(ddWeatherAPI (result['data'][0]['capital']))

          if (result.status.name == "ok") {
              $('#popupContinent').html('<li>Continent: ' + result['data'][0]['continent'] + '</li>');
              $('#popupCapital').html('<li>Capital: ' + result['data'][0]['capital'] + '</li>');
              $('#popupLanguages').html('<li>Languages: ' + result['data'][0]['languages'] + '</li>');
              $('#popupPopulation').html('<li>Population: ' + giveCommas(result['data'][0]['population']) + '</li>');
              $('#popupArea').html('<li>Area (km2): ' + giveCommas(result['data'][0]['areaInSqKm']) + '</li>');       

               //this line is for the exchange rate function:
            $(exchangeRate (result['data'][0]['currencyCode']));

            }
          
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          }
        })) 
        
//these lines are to populate the data overlay for the local country but with some differences:

$('#popupCountryCode').html('<li>Country Code: ' + $('#selCountry').val() + '</li>');
$($.ajax({
  url: 'php/getCountryFromLocalFile.php',
  type: 'GET',
  dataType: "json",
  data: {countryCode: $('#selCountry').val()},

  success: function(result) {
    
  country = result.result;
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
          //if (map.borders){map.removeLayer(borders);};
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

// This part generates the popup when the page loads.

const popup = document.getElementById('dataPopup');
const wPopup = document.getElementById('wikiPopup');
const wePopup = document.getElementById('weatherPopup');

window.onload = () => {
popup.style.display = 'block';
wPopup.style.display = 'block';
};

// This section is to make the popups dragable. 

function dragpopup (thisPopup){
let mousePos = { x: 0, y: 0 };
let popupPos = { x: 0, y: 0 };
let isDragging = false;
thisPopup.addEventListener('mousedown', (e) => {
  isDragging = true;
  mousePos.x = e.clientX;
  mousePos.y = e.clientY;
  popupPos.x = popup.offsetLeft;
  popupPos.y = popup.offsetTop;
});
document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - mousePos.x;
    const deltaY = e.clientY - mousePos.y;
    thisPopup.style.left = `${popupPos.x + deltaX}px`;
    thisPopup.style.top = `${popupPos.y + deltaY}px`;
  }
});
document.addEventListener('mouseup', () => {
  isDragging = false;
});}

$(dragpopup (popup));
$(dragpopup (wePopup));

// Some issues with the wiki popup jumping so this is turned off for now. 
//$(dragpopup (wPopup));

// exchange rate function:
function exchangeRate (currencyCode){
    if (currencyCode == 'USD'){
    $.get('https://openexchangerates.org/api/latest.json', {app_id: 'f9d4247ca1f5440bb89696cedb79436d'}, function(data) {
        let rates = data.rates.GBP;
        rates = rates.toFixed(2);
      
        $('#popupCurrency').html('<li>Currency: USD at ' + rates +' to GBP</li>'); 
          })
}           
else{ 
$.get('https://openexchangerates.org/api/latest.json', {app_id: 'f9d4247ca1f5440bb89696cedb79436d'}, function(data) {
  let rates = '1' / data.rates[currencyCode];
  rates = rates.toFixed(2);
  if (rates == 0){ $('#popupCurrency').html(''); }
  else{
  $('#popupCurrency').html('<li>Currency: ' + currencyCode + ' at ' + rates +' to USD</li>');} 
    });}}

// Making a local wiki function:

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

    //console.log(JSON.stringify(result));

    if (result.status.name == "ok") {
      for (let i = 0; i < 5; i ++){
    $(wikiMarker (result.data[i]));
      }
    }
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
  }
}))}

//this is for avoiding repetition above:

function wikiMarker (dataPlace){
  let summary = dataPlace['summary'];
  summary = summary.substring(0, summary.length-5);

  let hereMarker = L.markerClusterGroup();
  hereMarker.addLayer(L.marker([dataPlace['lat'], dataPlace['lng']], { icon: infoMarker }));
  hereMarker.bindPopup( '<a href=https://' + dataPlace['wikipediaUrl'] + '>' + summary, {permanent: true} + '</a>').openPopup()
  hereMarker.openTooltip();
  map.addLayer(hereMarker);
}

// the old code:
// function wikiMarker (dataPlace){
//   let summary = dataPlace['summary'];
//     summary = summary.substring(0, summary.length-5);
//   let hereMarker = L.marker([dataPlace['lat'], dataPlace['lng']]);
//   hereMarker.bindPopup( '<a href=https://' + dataPlace['wikipediaUrl'] + '>' + summary, {permanent: true} + '</a>').openPopup()
//   hereMarker.openTooltip();
//   hereMarker.addTo(map);
// }

//making a wikiCountry function: 

function wikiCountryData(country){
country = country.replace(/\s/g, '-');

$($.ajax({
    url: "php/getWikiCountryInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {
      country: country
    },
    success: function(result) {
  
      //console.log(JSON.stringify(result));
    for (let i = 0; i < 10; i ++){
    $(countryOrPlace (result.data[i], country));
    }

    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  }))}
  
//  these are for avoiding repetition above:
  
  function wikiCountryMarker (dataPlace){
    let summary = dataPlace['summary'];
      summary = summary.substring(0, summary.length-5);
    let hereMarker = L.marker([dataPlace['lat'], dataPlace['lng']], { icon: infoMarker });
    hereMarker.bindPopup( '<a href=https://' + dataPlace['wikipediaUrl'] + '>' + summary, {permanent: true} + '</a>').openPopup()
    hereMarker.openTooltip();
    hereMarker.addTo(map);
  }

  function countryOrPlace (newData, country) {
      country = country.replace(/-/g, ' ');
      if (newData['title'] == country )
      {
        let summary = newData['summary'];
        summary = summary.substring(0, summary.length-6);
        //console.log(summary);
        $('#popupSummary').html('<p>' + summary + '... ' + '<a id=\'wiki\' href=\'https://' + newData['wikipediaUrl'] + '\'>' + '(Wikipedia entry)' + '</a></p>'); 
      }
      else
      $(wikiCountryMarker (newData));
      }

// making numbers have commas:
function giveCommas (stringNumber) {
number = Number(stringNumber);
number = number.toLocaleString();
return number;}

// local weather info:
function weatherAPI (lat, lng) {
  $.get('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng + '&current_weather=true', function(data) {
       $('#temperature').html('<li>Temperature: ' + data['current_weather']['temperature'] + '°C </li>'); 
       $('#windspeed').html('<li>Wind Speed: ' + data['current_weather']['windspeed'] + '</li>'); 
       $('#windDirection').html('<li>Wind Direction: ' + data['current_weather']['winddirection'] + '</li>'); 
       $('#elevation').html('<li>Elevation: ' + data['elevation'] + '</li>'); 
       $('#timeZone').html('<li>Time Zone: ' + data['timezone'] + '</li>'); 
		});

  $.get('http://api.openweathermap.org/geo/1.0/reverse?lat=' + lat + '&lon=' + lng + '&limit=1&appid=a0e29cd38e23aec7ad4c1504ac3c63b8', function(datab) {
      $('#placeName').html('<h3>' + datab[0]['name'] + '</h3>');
      $.get('https://api.openweathermap.org/data/2.5/weather?q=' +  + datab[0]['name'] + '&appid=a0e29cd38e23aec7ad4c1504ac3c63b8', function(datac) {
      $('#description').html('<li>Description: ' + datac['weather'][0]['description'] + '</li>'); 
    });
    })

}

//foreign weather info:

function ddWeatherAPI (capital) {
  $('#placeName').html('<h3>' + capital + '</h3>');

  $($.ajax({
    url: "php/getCapitalInfo.php",
    type: 'POST',
    dataType: 'json',
    data: {capital: capital},
    success: function(result) {

     // console.log(JSON.stringify(result));
          let lat = result.data[0]['lat'];
          let lng = result.data[0]['lng'];
          
          var capMarker = L.marker([lat, lng], { icon: cityMarker });
          capMarker.bindTooltip(capital);
          capMarker.openTooltip();
          capMarker.addTo(map);

          if (result.status.name == "ok") {    
            $.get('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lng + '&current_weather=true', function(data) {
            $('#temperature').html('<li>Temperature: ' + data['current_weather']['temperature'] + '°C </li>'); 
            $('#windspeed').html('<li>Wind Speed: ' + data['current_weather']['windspeed'] + '</li>'); 
            $('#windDirection').html('<li>Wind Direction: ' + data['current_weather']['winddirection'] + '</li>'); 
            $('#elevation').html('<li>Elevation: ' + data['elevation'] + '</li>'); 
            $('#timeZone').html('<li>Time Zone: ' + data['timezone'] + '</li>'); 
         });  }
    
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  }))} 
