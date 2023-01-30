	document.getElementById('btnRun1').onclick = function btnfunc1(){

	$.ajax({
		url: "libs/php/getAirportInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			ICAO: $('#selAirport').val()
			
		},
		success: function(result) {

			console.log(JSON.stringify(result));

			if (result.status.name == "ok") {

				$('#txtClouds').html(result['data']['clouds']);
				$('#txtTemperature').html(result['data']['temperature']);
				$('#txtHumidity').html(result['data']['humidity']);
				

			}
		
		},
		error: function(jqXHR, textStatus, errorThrown) {
			console.log(jqXHR);
		}
	}); 

};	


document.getElementById('btnRun2').onclick = function btnfunc2(){

		$.ajax({
			url: "libs/php/getLLWeatherInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				lat: $('#selLat').val(),
				lng: $('#selLng').val()
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtClouds').html(result['data']['clouds']);
					$('#txtTemperature').html(result['data']['temperature']);
					$('#txtHumidity').html(result['data']['humidity']);
					
					
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}
		}); 
	
	};

	document.getElementById('btnRun3').onclick = function btnfunc3(){

		$.ajax({
			url: "libs/php/getNeighbourInfo.php",
			type: 'POST',
			dataType: 'json',
			data: {
				geonameId: $('#selCountry').val()
				
			},
			success: function(result) {

				console.log(JSON.stringify(result));

				if (result.status.name == "ok") {

					$('#txtNeighbour').html(result['data'][1]['countryName']);
										
				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				console.log(jqXHR);
			}
		}); 
	
	};
	
