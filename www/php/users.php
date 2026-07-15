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
                    "id_user" => $result['id_user'],
                    "username" => $result['username'],
                    "id_role" => $result['id_role']
                ]
            ]);
        } else {
            echo json_encode(["status"=>"error", "message"=>"Usuario o contraseña incorrectos"]);
        }
        exit;

    case 'logout':
        session_destroy();
        echo json_encode(["status" => "success"]);
        exit;

    case 'get_roles':
        $roles = getAllRoles(); 
        echo json_encode(["status" => "success", "data" => $roles]);
        exit;

    case 'getAll':
        $users = getAllUsers(); 
        echo json_encode(["status" => "success", "data" => $users]);
        exit;

    case 'getById':
        $id = $data['id_user'] ?? null;
        if (!$id) {
            echo json_encode(["status" => "error", "message" => "ID no recibido"]);
            exit;
        }

        $stmt = $pdo->prepare("SELECT id_user, username, id_role FROM users WHERE id_user = :id");
        $stmt->execute(["id" => $id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if($user){
            echo json_encode(["status" => "success", "data" => $user]);
        } else {
            echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
        }
        exit;

    case 'insert':
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $id_role  = $data['id_role'] ?? '';

        if(!$username || !$password || !$id_role){
            echo json_encode(["status" => "error", "message" => "Faltan datos (La contraseña es obligatoria al crear)"]);
            exit;
        }

        $hash = password_hash($password, PASSWORD_BCRYPT);
        $stmt = $pdo->prepare("INSERT INTO users (username, password, id_role) VALUES (:username, :password, :id_role)");
        $ok = $stmt->execute([
            "username" => $username,
            "password" => $hash,
            "id_role" => $id_role
        ]);

        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Usuario creado" : "Error al crear"]);
        exit;

    case 'update':
        $id = $data['id_user'] ?? null;
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $id_role  = $data['id_role'] ?? '';

        if (!$id || !$username || !$id_role) {
            echo json_encode(["status" => "error", "message" => "Faltan datos"]);
            exit;
        }

        if (!empty($password)) {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("UPDATE users SET username = :username, password = :password, id_role = :id_role WHERE id_user = :id");
            $ok = $stmt->execute([
                "username" => $username,
                "password" => $hash,
                "id_role" => $id_role,
                "id" => $id
            ]);
        } else {
            $stmt = $pdo->prepare("UPDATE users SET username = :username, id_role = :id_role WHERE id_user = :id");
            $ok = $stmt->execute([
                "username" => $username,
                "id_role" => $id_role,
                "id" => $id
            ]);
        }

        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Usuario actualizado" : "Error al actualizar"]);
        exit; 

    case 'delete':
        $id = $data['id_user'] ?? null;
        try {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id_user = :id");
            $stmt->execute(['id' => $id]);
            $ok = $stmt->rowCount() > 0;
            echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Usuario eliminado" : "No se pudo eliminar"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "No se puede eliminar, el usuario está ligado a otras tablas"]);
        }
        exit;

    default:
        echo json_encode(["status" => "error", "message" => "Acción no válida"]);
        exit;    
}
?>