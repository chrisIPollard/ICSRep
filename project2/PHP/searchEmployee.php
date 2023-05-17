<?php

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

    $query = $conn->prepare('SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, p.departmentID, d.name as department, l.name as location 
	FROM personnel p 
	LEFT JOIN department d ON (d.id = p.departmentID) 
	LEFT JOIN location l ON (l.id = d.locationID) 
	WHERE LOWER(p.lastName) LIKE LOWER(?) 
	OR LOWER(p.firstName) LIKE LOWER(?)
	ORDER BY p.lastName, p.firstName, d.name, l.name');

    $query->bind_param("ss", $lastName, $firstName);

    $lastName = '%' . $_REQUEST['lastName'] . '%';
    $firstName = '%' . $_REQUEST['firstName'] . '%';

    $query->execute();

    $query->bind_result($id, $lastName, $firstName, $jobTitle, $email, $departmentID, $department, $location);

    $data = [];

    while ($query->fetch()) {
        $row = [
            'id' => $id,
            'lastName' => $lastName,
            'firstName' => $firstName,
            'jobTitle' => $jobTitle,
            'email' => $email,
            'departmentID' => $departmentID,
            'department' => $department,
            'location' => $location
        ];
        array_push($data, $row);
    }

    mysqli_stmt_close($query);
    mysqli_close($conn);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = $data;

    echo json_encode($output);
?>