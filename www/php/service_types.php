<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

switch ($action) {
    case "getAll":
        $data = getAllServiceTypes(); 
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "get_one":
        $data = getServiceTypeById($post['id_service_type']);
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "insert":
        $id = insertServiceType($post);
        echo json_encode(["status" => $id ? "success" : "error", "message" => $id ? "Servicio registrado" : "Error al registrar"]);
        break;

    case "update":
        $ok = updateServiceType($post);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Servicio actualizado" : "Error al actualizar"]);
        break;

    case "delete":
        $ok = deleteServiceType($post['id_service_type']);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Servicio eliminado" : "No se puede eliminar porque está en uso"]);
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
        break;
}
?>