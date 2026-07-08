<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

switch ($action) {
    case "getAll":
        $data = getAllSales(); 
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "get_catalogs":
        $data = getCatalogsForSales();
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "insert":
        if (insertSale($post)) {
            echo json_encode(["status" => "success"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al registrar la venta"]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
        break;
}
?>