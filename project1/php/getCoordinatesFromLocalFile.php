<?php

$jsonCountryBordersData = file_get_contents('json/countryBorders.geo.json');

$decoded_json = json_decode($jsonCountryBordersData, true);

foreach($features as $feature) {

    if ($feature[properties][iso_a2] == ['countryCode'])
    {
        echo $feature[geometry][coordinates];
        $output['result'] = $feature[geometry][coordinates];
    }

}

?>
