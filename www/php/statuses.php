<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

switch ($action) {
    case "getAll":
        $data = getAllStatuses(); 
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "get_one":
        $data = getStatusById($post['id_status']);
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "insert":
        $id = insertStatus($post);
        echo json_encode(["status" => $id ? "success" : "error", "message" => $id ? "Status registrado" : "Error al registrar"]);
        break;

    case "update":
        $ok = updateStatus($post);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Status actualizado" : "Error al actualizar"]);
        break;

    case "delete":
        $ok = deleteStatus($post['id_status']);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Status eliminado" : "No se puede eliminar, está en uso"]);
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
        break;
}
?>