<?php
$host = "204.93.224.200";
$dbname = "ssfmyfom_compu_fixes";
$username = "ssfmyfom_domingo"; 
$password = "2m_iM9u8_i";     

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "Error de conexión: " . $e->getMessage()]));
}
?>