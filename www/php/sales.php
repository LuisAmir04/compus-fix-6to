<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

switch ($action) {
    case "getAll":
        $data = getAllSales(); 
<<<<<<< Updated upstream
        if ($data) {
            echo json_encode(["status" => "success", "data" => $data]);
=======
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    case "getById":
        $id = $post['id_sale'] ?? null;
        if (!$id) {
            echo json_encode(["status" => "error", "message" => "ID no recibido"]);
            exit;
        }
        // Asumiendo que tienes u obtienes esta función en lib/functions.php
        // Si no la tienes, puedes prepararla directo: $stmt = $pdo->prepare("SELECT * FROM sales WHERE id_sale = ?");
        $stmt = $pdo->prepare("SELECT id_sale, id_order, id_user, payment_method, total_paid FROM sales WHERE id_sale = :id");
        $stmt->execute(["id" => $id]);
        $sale = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($sale) {
            echo json_encode(["status" => "success", "data" => $sale]);
        } else {
            echo json_encode(["status" => "error", "message" => "Venta no encontrada"]);
        }
        break;

    case "delete_sale":
        $ok = deleteSale($post['id_sale']);
        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Venta eliminada" : "No se pudo eliminar"]);
        exit;

    case "get_catalogs":
        $data = getCatalogsForSales();
        echo json_encode(["status" => "success", "data" => $data]);
        break;

    Case "insert":
        if (insertSale($post)) {
            echo json_encode(["status" => "success", "message" => "Venta registrada con éxito"]);
>>>>>>> Stashed changes
        } else {
            echo json_encode(["status" => "error", "message" => "No hay datos para mostrar"]);
        }
        break;

<<<<<<< Updated upstream
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
=======
    case "update":
        // Lógica para actualizar los datos de la venta
        $id = $post['id_sale'] ?? null;
        if (!$id) {
            echo json_encode(["status" => "error", "message" => "Faltan datos para actualizar"]);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE sales SET id_order = :id_order, id_user = :id_user, payment_method = :payment_method, total_paid = :total_paid WHERE id_sale = :id");
        $ok = $stmt->execute([
            "id_order"       => $post['id_order'],
            "id_user"        => $post['id_user'],
            "payment_method" => $post['payment_method'],
            "total_paid"     => $post['total_paid'],
            "id"             => $id
        ]);

        echo json_encode(["status" => $ok ? "success" : "error", "message" => $ok ? "Venta actualizada" : "Error al actualizar"]);
>>>>>>> Stashed changes
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
        break;
}
?>