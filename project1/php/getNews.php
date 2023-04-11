<?php

    $queryString = http_build_query([
        'access_key' => 'fd27801071497026a5481faae57b362a',
        'countries' => $_REQUEST['country'],
		'date' => date("Y-m-d",strtotime("-2 days"))
      ]);

      $ch = curl_init(sprintf('%s?%s', 'http://api.mediastack.com/v1/news', $queryString));
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      
      $json = curl_exec($ch);
      
      curl_close($ch);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>
