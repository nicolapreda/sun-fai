<?php
$servername = "127.0.0.1:3306";
$username = "u191507796_info_account";
$dbname = "u191507796_sunfai";
$password = "Sunfai2024";
$error = false;

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // set the PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "DB Error: " . $e->getMessage();
    $error = true;
}
?>
