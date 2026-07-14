<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

switch ($action) {
    case "getAll":
        $data = getAllDeviceTypes(); 
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "get_one":
        $data = getDeviceTypeById($post['id_device_type']);
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "insert":
        $id = insertDeviceType($post);
        echo json_encode(["status" => $id ? "success" : "error", "message" => $id ? "Tipo registrado" : "Error al registrar"]);
        break;

    case "update":
        $ok = updateDeviceType($post);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Tipo actualizado" : "Error al actualizar"]);
        break;

    case "delete":
        $ok = deleteDeviceType($post['id_device_type']);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Tipo eliminado" : "No se puede eliminar porque está en uso"]);
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
        break;
}
?>