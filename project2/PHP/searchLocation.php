<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {

    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;

}

$query = $conn->prepare('SELECT id, name FROM location WHERE name LIKE ?');

$locationName = '%' . $_REQUEST['location'] . '%';

if (!$query->bind_param("s", $locationName)) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "binding parameters";
    $output['status']['description'] = "binding parameters failed";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

$query->execute();

$query->bind_result($id, $name);

$data = [];

while ($query->fetch()) {

    $row = [
        'id' => $id,
        'name' => $name
    ];

    array_push($data, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

mysqli_close($conn);

echo json_encode($output);

?>
