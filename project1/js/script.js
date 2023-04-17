//creating global variables:

let countryNamesAndCodes;
let select = document.getElementById("selCountry");
let localCountryCode;
let area;
let borders;
let cap;
let continent;
let country;
let capital;
let currencyCode;
let countryCode;
let days;
let languages;
let population;
let weatherIcons;

//time variables:
let today = new Date();
let todayPlusOne = new Date(today);
todayPlusOne.setDate(todayPlusOne.getDate() + 1);
let todayPlusTwo = new Date(today);
todayPlusTwo.setDate(todayPlusTwo.getDate() + 2);
let dateDisplay = { month: 'long', day: 'numeric'};

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
    if (!result.data){console.log('no information available')}
    else
    {
    //console.log(JSON.stringify(result));
          
    if (result.status.code == 200) {

      airports.clearLayers();
      
      result.data.forEach(function(item) {

        L.marker([item.lat, item.lng], {icon: airportIcon})
          .bindTooltip(item.name, {direction: 'top', sticky: true})
          .addTo(airports);
        
      })}
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
    if (!result.data){console.log('no information available')}
    else
    {
    //console.log(JSON.stringify(result));
          
    if (result.status.code == 200) {

      cities.clearLayers();  

      result.data.forEach(function(item) {

        L.marker([item.lat, item.lng], {icon: cityIcon})
          .bindTooltip(item.name, {direction: 'top', sticky: true})
          .addTo(cities);
        
      })}
    } 
  },
  error: function (jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
  }
});   

//shared ajax calls within the dropdown: 

$.ajax({
  url: "php/getCountryInfo.php",
  type: 'POST',
  dataType: 'json',
  data: {country: $('#selCountry').val()},
  success: function(result) {

    //console.log(JSON.stringify(result));

    area = '';
    capital = '';
    continent = '';
    country = '';
    population = '';
    languages = '';
    currencyCode = '';

  if (result.status.name == "ok") {

    area = result['data'][0]['areaInSqKm'];
    capital = result['data'][0]['capital'];
    continent = result['data'][0]['continent'];
    country = result['data'][0]['countryName'];
    currencyCode = result['data'][0]['currencyCode'];
    population = result['data'][0]['population'];
    languages = result['data'][0]['languages'];

    }
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log(jqXHR);
  }
})

    //this bracket closes the dropdown led functions:
    }   
  
// data modal: 

L.easyButton('fa-solid fa-flag fa-lg', function(btn, map){
  $('#dataModal').modal("show"); 
  $('.flag').html(`<span class='fi fi-${$('#selCountry').val().toLowerCase()}'></span>`);
  
        if (capital === ''){
            $('#countryName').html('information unavailable');
            $('#continent').html('');
            $('#capital').html('');
            $('#languages').html('');
            $('#population').html('');
            $('#area').html(''); 
        }
        else{
        $('#countryName').html(country);
        $('#continent').html(continent);
        $('#capital').html(capital);
        $('#languages').html(languages);
        $('#population').html(giveCommas(population));
        $('#area').html(giveCommas(Math.round(area)));       
      }
    
}).addTo(map); 

// weather modal

L.easyButton('fa-cloud fa-lg', function(btn, map){
  $('#weatherModal').modal("show"); 
  $('.flag').html(`<span class='fi fi-${$('#selCountry').val().toLowerCase()}'></span>`);
  if (capital == ''){         
    $('#weatherModalLabel').html('information unavailable');
    $('#todayIcon').attr("src",'');
    $('#todayMinTemp').html('')
    $('#day1Date').text('');
    $('#day1Icon').attr("src",'');
    $('#day1MinTemp').text('');
    $('#day2Date').text('');
    $('#day2Icon').attr("src",'');
    $('#day2MinTemp').text('');
  } else {    
  $.ajax({
        url: "php/getWeather.php",
        type: 'POST',
        dataType: 'json',
        data: {capital: capital},
    
        success: function(result) {
      
        //console.log(JSON.stringify(result));
        
        if (result.status.name == "ok") { 
          
          if (result.data === null){
            $('#weatherModalLabel').html('information unavailable for ' + country);
            $('#todayIcon').attr("src",'');
            $('#todayMinTemp').html('')
            $('#day1Date').text('');
            $('#day1Icon').attr("src",'');
            $('#day1MinTemp').text('');
            $('#day2Date').text('');
            $('#day2Icon').attr("src",'');
            $('#day2MinTemp').text('');
          }
          else
          {
            $('#weatherModalLabel').html(result.data.location.name + ", " + result.data.location.country);
            $('#todayIcon').attr("src", result.data.current.condition['icon']);
            $('#todayMinTemp').html(result.data.forecast['forecastday'][0].day['mintemp_c'] + ' - ' + result.data.forecast['forecastday'][0].day['maxtemp_c']+ '°C')
            $('#day1Date').text(todayPlusOne.toLocaleDateString("en-GB", dateDisplay));
            $('#day1Icon').attr("src", result.data.forecast.forecastday[1].day.condition.icon);
            $('#day1MinTemp').text(result.data.forecast.forecastday[1].day['mintemp_c'] + ' - ' + result.data.forecast.forecastday[1].day['maxtemp_c'] + '°C'); 
            $('#day2Date').text(todayPlusTwo.toLocaleDateString("en-GB", dateDisplay));
            $('#day2Icon').attr("src", result.data.forecast.forecastday[2].day.condition.icon);
            $('#day2MinTemp').text(result.data.forecast.forecastday[2].day['mintemp_c'] + ' - ' + result.data.forecast.forecastday[2].day['maxtemp_c'] + '°C');
          }}},
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          }
        })}

}).addTo(map); 

// wiki modal

L.easyButton('fa-w fa-lg', function(btn, map){
  $('#wikiModal').modal("show"); 
  $('.flag').html(`<span class='fi fi-${$('#selCountry').val().toLowerCase()}'></span>`);
  console.log(country);
  if (country === ''){
    $('#countryNameb').html('no information available');
    $('#wikiData').html('');
  }
  else{
        $('#countryNameb').html(country);
        $('#wikiData').html('no information available');   
        country = country.replace(/\s/g, '-');
        $.ajax({
          url: "php/getWikiCountryInfo.php",
          type: 'POST',
          dataType: 'json',
          data: {
            country: country
          },
          success: function(result) {
        
          //console.log(JSON.stringify(result));
    
        if (result.status.name == "ok") {
          if (country == 'Palestine')
          {
            country = 'State-of-Palestine';
          }  
        for (let i = 0; i < result.data.length; i ++){
          
          //populating the wiki popup 
          let newData = result.data[i]
          let summary = newData['summary'];
          
            //not all the titles from the geo.JSON match to the wiki find, so I've made an exception for Palestine but would like a general solution. The includes method below is not sufficient. I could use country code but this does appear on some other entries.  
            country = country.replace(/-/g, ' ');
            
            if (newData['title'] == country )
            //if ( newData['title'].includes(country))
            {
              summary = summary.substring(0, summary.length-6);
              //console.log(summary);
              $('#wikiData').html('<p>' + summary + '... ' + '<a id=\'wiki\' href=\'https://' + newData['wikipediaUrl'] + '\'>' + '(Wikipedia entry)' + '</a></p>'); 
            }
        }
      }
    
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log(jqXHR);
          }
        })
        country = country.replace(/-/g, ' ');

  }
}).addTo(map); 

  //exchange rate modal: 

  L.easyButton('fa-money-bill fa-lg', function(btn, map){
    $('#exchangeModal').modal("show"); 
    $('.flag').html(`<span class='fi fi-${$('#selCountry').val().toLowerCase()}'></span>`);
      if (currencyCode == '') {
        $('#currency').html('<span>no information available</span>');
        $('#currencyName').html('');}
        else{
          $.ajax({
            url: "php/getCurrencyName.php",
            type: 'GET',
            dataType: 'json',
            
            success: function(result) {
        
              //console.log(JSON.stringify(result));
        
              if (result.status.name == "ok") {
                let currencyNames = Object.values(result.data);
                let currencies = Object.keys(result.data);
                for (let c = 0; c < currencies.length; c ++){
                if (currencies[c] == currencyCode)
                {$('#currencyName').html('<span>' + currencyNames[c] + '<span>');}
              }}
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
            }
          })
          $.ajax({
            url: "php/getCurrency.php",
            type: 'GET',
            dataType: 'json',
            
            success: function(result) {
        
              //console.log(JSON.stringify(result));
        
            if (result.status.name == "ok") {
              if (currencyCode == 'USD'){
                let rates = result.data.rates.GBP;
                rates = rates.toFixed(2);
              $('#currency').html('<span>Trading at ' + rates +' USD to GBP on </span>' + today.toLocaleDateString("en-GB", dateDisplay) + '.'); 
              }
              else{ 
                let rates = '1' / result.data.rates[currencyCode];
                rates = rates.toFixed(2);
                if (rates == 0){ $('#currency').html(''); }
                else{
                $('#currency').html('<span>Trading at ' + rates + ' ' +currencyCode + ' to USD on </span>'+ today.toLocaleDateString("en-GB", dateDisplay) + '.');} 
                }
        
              }
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.log(jqXHR);
            }
          }) 
        }
  }).addTo(map); 

//news modal:

L.easyButton('fa-newspaper fa-lg', function(btn, map){
  $('#newsModal').modal("show"); 
  $('.flag').html(`<span class='fi fi-${$('#selCountry').val().toLowerCase()}'></span>`);

  $.ajax({
    url: "php/getNews.php",
    type: 'POST',
    dataType: 'json',
    data: {country: $('#selCountry').val()},
    success: function(result) {

      //console.log(JSON.stringify(result));
      
    if (result.status.name == "ok") {

          for (let n = 0; n < 5; n ++){
            if (n<4){
        $(`#news${n}`).html(`<a href='${result.data.data[n]['url']}'> ${result.data.data[n]['title']} </a><hr />`);}
        else
        {$(`#news${n}`).html(`<a href='${result.data.data[n]['url']}'> ${result.data.data[n]['title']} </a>`);}
        }
  }},
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    }
  })
}).addTo(map);

// image modal: 

L.easyButton('fa-solid fa-camera fa-lg', function(btn, map){
  $('#imageModal').modal("show"); 
  $('.flag').html(`<span class='fi fi-${$('#selCountry').val().toLowerCase()}'></span>`);
  if (capital == '') {
    $('#cityPic').html('image unavailable'); }
        else{
        $('#capitalTitle').html(capital);   
        capitalLower = capital.toLowerCase();
        $.ajax({
          url: "php/getPhoto.php",
          type: 'POST',
          dataType: 'json',
          data: {capital: capitalLower},
          success: function(result) {
      
            //console.log(JSON.stringify(result));
      
          if (result.status.name == "ok") {
            if (result.data.message){$('#cityPic').html('image unavailable')}
            else{
            $('#cityPic').html(`<img style='height: 100%; width: 100%; object-fit: contain' src="${result.data.photos[0].image.mobile}">`);}
            }
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          }})}      
}).addTo(map); 

// days modal: 

L.easyButton('fa-regular fa-calendar fa-lg', function(btn, map){
  $('#daysModal').modal("show"); 
  $('.flag').html(`<span class='fi fi-${$('#selCountry').val().toLowerCase()}'></span>`);
  $('#daysTitle').html(`${country} National Holidays`);   
        countryCode = $('#selCountry').val();
        if (countryCode == 'UK'){code = 'GB'};
        $.ajax({
          url: "php/getDays.php",
          type: 'POST',
          dataType: 'json',
          data: {code: countryCode},
          success: function(result) {
            
            //console.log(JSON.stringify(result));
      
          if (result.status.name == "ok") {
            $(`#daysData`).html(``);
          days = result.data;
          days = days.reduce((c, n) =>
          c.find(i => i.name == n.name) ? c : [...c, n], []);
      
          for (let d = 0; d < days.length; d ++){
      
              $(`#daysData`).append(`<tr>
              <td>${days[d]['date']}</td>
              <td>${days[d]['name']}</td>
      </tr>`);
            }}
          },
          error: function(jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
          }
        });

}).addTo(map); 

//below function is embedded above to get dates:

function getDays (code) {
  
}