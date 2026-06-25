<?php
require_once 'lib/functions.php';

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

switch ($action) {
    case 'login':
        $user = $data['username'] ?? '';
        $pass = $data['password'] ?? '';
        
        $stmt = $pdo->prepare("SELECT id_user, username, password, id_role FROM users WHERE username = :username");
        $stmt->execute(['username' => $user]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result && password_verify($pass, $result['password'])) {
            
            $_SESSION['id_user'] = $result['id_user'];
            $_SESSION['id_role'] = $result['id_role'];

            echo json_encode([
                "status" => "success",
                "data" => [
                    "id_user"  => $result['id_user'],
                    "username" => $result['username'],
                    "id_role"  => $result['id_role']
                ]
            ]);
        } else {
            echo json_encode(["status"=>"error","message"=>"Usuario o contraseña incorrectos"]);
        }
        break;

    case 'logout':
        session_destroy();
        echo json_encode(["status" => "success"]);
        break;

        //Esto de abajo es para obtener los datos de la tabla de usuarios, lo de arriba es para el login y logout

        case 'getAll':
        $usersList = getAllUsers();
        if ($usersList) {
            echo json_encode(["status" => "success", "data" => $usersList]);
        } else {
            echo json_encode(["status" => "error", "message" => "No hay usuarios para mostrar"]);
        }
        break;

    default:
        echo json_encode(["status"=>"error","message"=>"Acción no válida"]);
}
?>