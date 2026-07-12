<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

switch ($action) {
    case "getAll":
        $data = getAllRepairOrders();
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "delete_order":
        $ok = deleteRepairOrder($post['id_order']);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Orden eliminada" : "No se pudo eliminar"]);
        break;

    case "get_catalogs":
        $data = getCatalogsForOrder();
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "insert_order":
        $ok = insertRepairOrder($post);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Orden creada" : "No se pudo crear"]);
        break;

    case "get_order":
        $data = getOrderById($post['id_order']);
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "update_order":
        $ok = updateRepairOrderRow($post);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Orden actualizada" : "No se pudo actualizar"]);
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
}
?>