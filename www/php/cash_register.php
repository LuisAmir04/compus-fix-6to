<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

protegerModulo($post, [1, 2]);

switch ($action) {
   
case "delete":
    echo json_encode(deleteCashRegister($post['id_cut']));
    break;
    
    case "getUsers":
    $users = getUsersForCatalog();
    echo json_encode(["status" => "success", "data" => $users]);
    break;
    
    case "getOne":
    echo json_encode(getCashRegisterById($post['id_cut']));
    break;

case "update":
    echo json_encode(updateCashRegister($post));
    break;

case "getAll":
        $ordenarPor = $post['ordenarPor'] ?? 'id_cut';
        $direccion = $post['direccion'] ?? 'ASC';
        $limite = $post['limite'] ?? 50;
        $offset = $post['offset'] ?? 0;
        // Recibimos el texto del buscador
        $busqueda = $post['busqueda'] ?? '';

        $data = getAllCashRegister($ordenarPor, $direccion, $limite, $offset, $busqueda);
        $total = getCountCashRegister($busqueda);

        if ($data || $total == 0) { 
            echo json_encode([
                "status" => "success", 
                "data" => $data ?: [],
                "total" => $total
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "No hay datos para mostrar"]);
        }
        break;

    case 'check_status':
        echo json_encode(checkShiftStatus($post['id_user']));
        break;
        

    case 'open_shift':
        echo json_encode(openShift($post));
        break;

    case 'close_shift':
        echo json_encode(closeShift($post));
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción inválida"]);
        exit;
}
?>