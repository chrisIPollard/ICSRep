<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

$query = 'SELECT id, name, locationID FROM department ORDER BY name ASC';

$result = $query->get_result();

while ($row = $result->fetch_assoc()) {
    echo $row['username'] . " - " . $row['email'] . "<br>";
}

$mysqli->close();

?>




