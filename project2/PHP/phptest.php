<?php
		// database credentials
		$servername = "localhost";
		$username = "chris320_user";
		$password = "579dogbiscuits";
		$dbname = "chris320_companydirectory";

		// create connection
		$conn = mysqli_connect($servername, $username, $password, $dbname);

		// check connection
		if (!$conn) {
		    die("Connection failed: " . mysqli_connect_error());
		}

		// select names from employees table
		$sql = "SELECT * FROM personnel";
		$result = mysqli_query($conn, $sql);

		// output names
    
    $row = mysqli_fetch_array($result);
		echo $row["firstName"];
		

		// close connection
		mysqli_close($conn);
	?>