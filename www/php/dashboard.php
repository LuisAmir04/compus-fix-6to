<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

protegerModulo($post, [1, 2]); // Administrador y Técnico pueden ver el dashboard

switch ($action) {
case "get_dashboard_data":
    $usuario = protegerModulo($post, [1, 2]);

    $data = [
        "total_ordenes" => getTotalOrdenes(),
        "ordenes_por_servicio" => getOrdenesPorServicio(),
        "ordenes_por_estado" => getOrdenesPorEstado(),
        "ordenes_entregadas_por_mes" => getOrdenesEntregadasPorMes(),
    ];

    // Ventas y ranking de técnicos: solo para Administrador
    if ($usuario['id_role'] == 1) {
        $data["ventas_resumen"] = getVentasResumenMensual();
        $data["ventas_por_dia"] = getVentasPorDia();
        $data["ventas_por_metodo"] = getVentasPorMetodoPago();
        $data["rendimiento_tecnicos"] = getRendimientoTecnicos();
    }

    echo json_encode(["status" => "success", "data" => $data]);
    break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
}
?>