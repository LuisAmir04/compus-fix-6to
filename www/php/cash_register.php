<?php
require_once 'lib/functions.php';

if (!isset($_SESSION['id_user'])) {
    echo json_encode(["status" => "error", "message" => "Acceso denegado. Sesión no válida."]);
    exit;
}

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

switch ($action) {

    case "getAll":
        $data = getAllCashRegister(); 
        if ($data) {
            echo json_encode(["status" => "success", "data" => $data]);
        } else {
            echo json_encode(["status" => "error", "message" => "No hay datos para mostrar"]);
        }
        break;

    case 'check_status':
        echo json_encode(checkShiftStatus($post['id_user']));
        break;

    case 'open_shift':
        echo json_encode(openShift($post));
        break;

    case 'close_shift':
        echo json_encode(closeShift($post));
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
        exit;
}
?>