<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

switch ($action) {
    case "getAll":
        $data = getAllSales(); 
        if ($data) {
            echo json_encode(["status" => "success", "data" => $data]);
        } else {
            echo json_encode(["status" => "error", "message" => "No hay datos para mostrar"]);
        }
        break;

    case "process_sale":
        $resultado = processSale($post);
        echo json_encode($resultado);
        break;

    case "update_sale":
        $resultado = updateSale($post); 
        echo json_encode($resultado);
        break;

    case "delete_sale":
        $id_sale = $post['id_sale'] ?? 0;
        $resultado = deleteSale($id_sale); 
        echo json_encode($resultado);
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
        break;
}
?>