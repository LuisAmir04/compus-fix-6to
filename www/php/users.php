<?php
require_once 'lib/functions.php';

$data = json_decode(file_get_contents("php://input"), true);
$action = $data['action'] ?? '';

switch ($action) {

    case 'insert':

        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $id_role  = $data['id_role'] ?? '';

        if(!$username || !$password || !$id_role){
            echo json_encode([
                "status" => "error",
                "message" => "Faltan datos"
            ]);
            exit;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $pdo->prepare("
            INSERT INTO users (username, password, id_role)
            VALUES (:username, :password, :id_role)
        ");

        $ok = $stmt->execute([
            "username" => $username,
            "password" => $hash,
            "id_role" => $id_role
        ]);

        echo json_encode([
            "status" => $ok ? "success" : "error"
        ]);

        exit;

    case 'getAll':

        $stmt = $pdo->query("SELECT id_user, username, id_role FROM users");
        $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["status" => "success","data" => $users]);
        exit;

    case 'getById':
    $id = $data['id_user'] ?? null;
    if (!$id) {
        echo json_encode([
            "status" => "error",
            "message" => "ID no recibido"
        ]);
        exit;
    }

    $stmt = $pdo->prepare("
        SELECT id_user, username, id_role
        FROM users
        WHERE id_user = :id
    ");

    $stmt->execute(["id" => $id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if($user){
        echo json_encode([
            "status" => "success",
            "data" => $user
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Usuario no encontrado"
        ]);
    }

exit;

 case 'update':

        $id = $data['id_user'] ?? null;
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $id_role  = $data['id_role'] ?? '';

        if (!$id || !$username || !$id_role) {
            echo json_encode([
                "status" => "error",
                "message" => "Faltan datos"
            ]);
            exit;
        }
  if (!empty($password)) {

            $hash = password_hash($password, PASSWORD_BCRYPT);

            $stmt = $pdo->prepare("
                UPDATE users 
                SET username = :username,
                    password = :password,
                    id_role = :id_role
                WHERE id_user = :id
            ");

            $ok = $stmt->execute([
                "username" => $username,
                "password" => $hash,
                "id_role" => $id_role,
                "id" => $id
            ]);

        } else {

            $stmt = $pdo->prepare("
                UPDATE users 
                SET username = :username,
                    id_role = :id_role
                WHERE id_user = :id
            ");

            $ok = $stmt->execute([
                "username" => $username,
                "id_role" => $id_role,
                "id" => $id
            ]);
        }

        echo json_encode([
            "status" => $ok ? "success" : "error"
        ]);
        exit; 
        
    default:
    echo json_encode([
        "status" => "error",
        "message" => "Acción no válida"
    ]);
    exit;    
}

?>