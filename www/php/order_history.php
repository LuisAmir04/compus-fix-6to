<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

protegerModulo($post, [1]);

switch ($action) {
    case "getAll":
        $ordenarPor = $post['ordenarPor'] ?? 'fecha_cambio';
        $direccion = $post['direccion'] ?? 'DESC';
        $limite = $post['limite'] ?? 50;
        $offset = $post['offset'] ?? 0;
        $busqueda = $post['busqueda'] ?? '';

        $data = getAllOrderHistory($ordenarPor, $direccion, $limite, $offset, $busqueda);
        $total = getCountOrderHistory($busqueda);

        echo json_encode([
            "status" => "success",
            "data" => $data,
            "total" => $total
        ]);
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
}
?>