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
        $data = getAllRepairOrders(); 
        if ($data) {
            echo json_encode(["status" => "success", "data" => $data]);
        } else {
            echo json_encode(["status" => "error", "message" => "No hay datos para mostrar"]);
        }
        break;

    case "get_catalogs":
        $data = getCatalogsForOrder();
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "create_order":
        $resultado = createNewOrder($post);
        echo json_encode($resultado);
        break;

        case "get_my_orders":
        $id_user = $post['id_user'] ?? null;
        $data = getMyOrders($id_user);
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "update_order":
        $resultado = updateRepairOrder($post);
        echo json_encode($resultado);
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
        exit;
}
?>