<?php
$host = 'localhost';
$user = 'chrispollard';
$password = '300882';
$dbname = 'employee';

$conn = mysql_connect($host, $user, $password, $dbname);

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>