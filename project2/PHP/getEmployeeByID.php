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

    // SQL statement accepts parameters and so is prepared to avoid SQL injection.
    // $_REQUEST used for development / debugging. Remember to change to $_POST for production

    $query = $conn->prepare('SELECT p.id, p.firstName, p.lastName, p.jobTitle, p.email, p.departmentID, d.name AS departmentName
    FROM personnel p
    JOIN department d ON p.departmentID = d.id
    WHERE p.id = ?');

	$query->bind_param("i", $_REQUEST['id']);

	$query->execute();

    if (false === $query) {

        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";    
        $output['data'] = [];

        echo json_encode($output); 
    
        mysqli_close($conn);
        exit;

    }

    $query->bind_result($id, $firstName, $lastName, $jobTitle, $email, $departmentID, $departmentName);

    $data = [];

    while ($query->fetch()) {

        $row = array(
            "id" => $id,
            "firstName" => $firstName,
            "lastName" => $lastName,
            "jobTitle" => $jobTitle,
            "email" => $email,
            "departmentID" => $departmentID,
            "departmentName" => $departmentName,
        );

        array_push($data, $row);
    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $data;

    echo json_encode($output); 

    mysqli_close($conn);

?>
