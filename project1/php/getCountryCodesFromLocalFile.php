<?php

$jsonCountryBordersData = file_get_contents('countryBorders.geo.json');

$decoded_json = json_decode($jsonCountryBordersData, true);

//echo $decoded_json;

//this make an array in PHP that has alphabetical sets of countries and country codes. I am trying to find a way to send the array to javascript, but I have not been able to get recognition there. 

$newArray = [];

foreach($decoded_json['features'] as $feature) {

    
    array_push($newArray, [$feature['properties']['name'], $feature['properties']['iso_a2']]);
    }


sort($newArray);
//$output['countryCodes'] = $newArray;
//echo json_encode($newArray);
$output['status']['description'] = "success";
$output['countryCodes'] = json_encode($newArray);
echo json_encode($output);


?>
