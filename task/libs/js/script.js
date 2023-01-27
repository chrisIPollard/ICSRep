	$('#btnRun').click(function() {

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

					$('#txtClouds').html(result['data'][0]['clouds']);
					$('#txtTemperature').html(result['data'][0]['temperature']);
					$('#txtHumidity').html(result['data'][0]['humidity']);
					$('#txtWindDirection').html(result['data'][0]['windDirection']);
					$('#txtWindSpeed').html(result['data'][0]['windSpeed']);

				}
			
			},
			error: function(jqXHR, textStatus, errorThrown) {
				// your error code
			}
		}); 
	
	});

	