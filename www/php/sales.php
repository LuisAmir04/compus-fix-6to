<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

protegerModulo($post, [1, 2]);

switch ($action) {
case "getAll":
        $ordenarPor = $post['ordenarPor'] ?? 'id_sale';
        $direccion = $post['direccion'] ?? 'ASC';
        $limite = $post['limite'] ?? 50;
        $offset = $post['offset'] ?? 0;
        // Recibimos el texto del buscador
        $busqueda = $post['busqueda'] ?? '';
        // Pasamos la variable a ambas funciones
        $data = getAllSales($ordenarPor, $direccion, $limite, $offset, $busqueda);
        $total = getCountSales($busqueda);

        echo json_encode([
            "status" => "success", 
            "data" => $data,
            "total" => $total
        ]);
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