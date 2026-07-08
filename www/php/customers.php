<?php
require_once 'lib/functions.php';

$post = json_decode(file_get_contents("php://input"), true);
$action = $post['action'] ?? '';

switch ($action) {
    case "getAll":
        $data = getAllCustomers();
        echo json_encode([
            "status" => "success",
            "data" => $data
        ]);
        break;

    case "getById":
        $id_customer = $post['id_customer'] ?? '';
        $data = getCustomerById($id_customer);

        if ($data) {
            echo json_encode([
                "status" => "success",
                "data" => $data
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "Cliente no encontrado"
            ]);
        }
        break;

    case "insert":
        $name = $post['name'] ?? '';
        $email = $post['email'] ?? '';
        $phone = $post['phone'] ?? '';

        $result = insertCustomer($name, $email, $phone);

        echo json_encode([
            "status" => $result ? "success" : "error",
            "message" => $result ? "Cliente insertado" : "No se pudo insertar"
        ]);
        break;

    case "update":
        $id_customer = $post['id_customer'] ?? '';
        $name = $post['name'] ?? '';
        $email = $post['email'] ?? '';
        $phone = $post['phone'] ?? '';

        $result = updateCustomer($id_customer, $name, $phone, $email  );

        echo json_encode([
            "status" => $result ? "success" : "error",
            "message" => $result ? "Cliente actualizado" : "No se pudo actualizar"
        ]);
        break;
        
    case "delete":
        $id_customer = $post['id_customer'] ?? '';
        $result = deleteCustomer($id_customer);

        echo json_encode([
            "status" => $result ? "success" : "error",
            "message" => $result ? "Cliente eliminado" : "No se pudo eliminar"
        ]);
        break;

    default:
        echo json_encode([
            "status" => "error",
            "message" => "Acción inválida"
        ]);
        break;
}