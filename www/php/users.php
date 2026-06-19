<?php
header('Content-Type: application/json');
require_once 'lib/db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['action']) && $data['action'] === 'login') {
    $user = $data['username'];
    $pass = $data['password'];

    $stmt = $pdo->prepare("SELECT id_user, username, password, id_role FROM users WHERE username = :username");
    $stmt->execute(['username' => $user]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result && password_verify($pass, $result['password'])) {
        
        echo json_encode([
            "status" => "success",
            "data" => [
                "id_user" => $result['id_user'],
                "username" => $result['username'],
                "id_role" => $result['id_role']
            ]
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Usuario o contraseña incorrectos"
        ]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Acción no válida"]);
}
?>