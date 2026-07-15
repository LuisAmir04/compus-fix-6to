<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

switch ($action) {
    case "getAll":
        $data = getAllSales(); 
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "get_one":
        $data = getSaleById($post['id_sale']);
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "get_catalogs":
        $data = getCatalogsForSales();
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "insert":
        if (insertSale($post)) {
            echo json_encode(["status" => "success", "message" => "Venta registrada"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al registrar la venta"]);
        }
        break;

    case "update":
        if (updateSale($post)) {
            echo json_encode(["status" => "success", "message" => "Venta actualizada"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al actualizar la venta"]);
        }
        break;

    case "delete":
        if (deleteSale($post['id_sale'])) {
            echo json_encode(["status" => "success", "message" => "Venta eliminada"]);
        } else {
            echo json_encode(["status" => "error", "message" => "No se pudo eliminar la venta"]);
        }
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
        break;
}
?>