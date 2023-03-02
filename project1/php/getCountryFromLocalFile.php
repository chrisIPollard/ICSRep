<?php

$jsonCountryBordersData = file_get_contents('countryBorders.geo.json');

$decoded_json = json_decode($jsonCountryBordersData, true);

foreach($decoded_json['features'] as $feature) {

    if ($feature['properties']['iso_a2'] == $_REQUEST['countryCode'])

    {
                $output['result'] = $feature['properties']['name'];
    }

}

echo json_encode($output);

?>
