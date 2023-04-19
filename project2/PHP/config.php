<?php
$db = new PDO($dsn, $user, $password);

$sql = file_get_contents('SQL/employee_info.sql');

$qr = $db->exec($sql);
?>
