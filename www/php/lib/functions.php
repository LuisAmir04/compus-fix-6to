<?php
session_start();
require_once 'db.php';

function getAllRoles() {
    global $pdo; 
    $stmt = $pdo->query("SELECT id_role, name FROM roles");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllDeviceTypes() {
    global $pdo;
    $stmt = $pdo->query("SELECT id_device_type, name FROM device_types");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllServiceTypes() {
    global $pdo;
    $stmt = $pdo->query("SELECT id_service_type, name FROM service_types");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllStatuses() {
    global $pdo;
    $stmt = $pdo->query("SELECT id_status, name FROM statuses");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllCustomers() {
    global $pdo;
    $stmt = $pdo->query("SELECT id_customer, name, phone, email FROM customers");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function insertCustomer($name, $phone, $email) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT customers(name, phone, email) VALUES (:name, :phone, :email)");
    return $stmt->execute([
        ':name' => $name,
        ':phone' => $phone,
        ':email' => $email
    ]);
}

function getAllUsers() {
    global $pdo;
    $stmt = $pdo->query("SELECT u.id_user, u.username, r.name AS role_name 
                         FROM users u 
                         INNER JOIN roles r ON u.id_role = r.id_role");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllRepairOrders() {
    global $pdo;
    $stmt = $pdo->query("
        SELECT 
            o.id_order, 
            c.name AS customer_name,
            dt.name AS device_type,
            st.name AS service_type,
            u.username AS technician_name,
            o.brand_model,
            o.reported_fault,
            o.technical_diagnosis,
            o.final_price,
            s.name AS current_status,
            o.created_at
        FROM repair_orders o
        INNER JOIN customers c ON o.id_customer = c.id_customer
        INNER JOIN device_types dt ON o.id_device_type = dt.id_device_type
        INNER JOIN service_types st ON o.id_service_type = st.id_service_type
        INNER JOIN statuses s ON o.id_status = s.id_status
        INNER JOIN users u ON o.id_user = u.id_user
    ");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllSales() {
    global $pdo;
    $stmt = $pdo->query("
        SELECT 
            s.id_sale,
            s.id_order,
            u.username AS cashier_name,
            s.payment_method,
            s.total_paid,
            s.sale_date
        FROM sales s
        INNER JOIN users u ON s.id_user = u.id_user
    ");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllCashRegister() {
    global $pdo;
    $stmt = $pdo->query("
        SELECT 
            cr.id_cut,
            u.username AS cashier_name,
            cr.opening_time,
            cr.initial_cash,
            cr.closing_time,
            cr.declared_cash
        FROM cash_register cr
        INNER JOIN users u ON cr.id_user = u.id_user
    ");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// ---------------------------------------------
// FUNCIONES PARA EL CORTE DE CAJA (TURNOS)
// ---------------------------------------------

function checkShiftStatus($id_user) {
    global $pdo;
    
    $stmt = $pdo->prepare("SELECT * FROM cash_register WHERE id_user = :id_user AND closing_time IS NULL ORDER BY opening_time DESC LIMIT 1");
    $stmt->execute(['id_user' => $id_user]);
    $shift = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($shift) {
        $stmtSales = $pdo->prepare("
            SELECT SUM(total_paid) as cash_sales 
            FROM sales 
            WHERE id_user = :id_user AND payment_method = 'Efectivo' AND sale_date >= :opening_time
        ");
        $stmtSales->execute([
            'id_user' => $id_user,
            'opening_time' => $shift['opening_time']
        ]);
        $sales = $stmtSales->fetch(PDO::FETCH_ASSOC);
        
        $shift['cash_sales'] = $sales['cash_sales'] ?? 0;
        $shift['expected_cash'] = $shift['initial_cash'] + $shift['cash_sales'];
        
        return ["status" => "open", "data" => $shift];
    }
    
    return ["status" => "closed"];
}

function updateCashRegister($data) {
    global $pdo;

    try {
        $stmt = $pdo->prepare("
            UPDATE cash_register
            SET initial_cash = :initial_cash,
                declared_cash = :declared_cash
            WHERE id_cut = :id_cut
        ");

        $stmt->execute([
            'initial_cash' => $data['initial_cash'],
            'declared_cash' => $data['declared_cash'],
            'id_cut' => $data['id_cut']
        ]);

        return ["status" => "success", "message" => "Registro actualizado correctamente."];
    } catch (Exception $e) {
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

function deleteCashRegister($id_cut) {
    global $pdo;

    try {
        $stmt = $pdo->prepare("DELETE FROM cash_register WHERE id_cut = :id_cut");
        $stmt->execute([
            'id_cut' => $id_cut
        ]);

        return ["status" => "success", "message" => "Registro eliminado correctamente."];
    } catch (Exception $e) {
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

function openShift($data) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("INSERT INTO cash_register (id_user, initial_cash) VALUES (:id_user, :initial_cash)");
        $stmt->execute([
            'id_user' => $data['id_user'],
            'initial_cash' => $data['initial_cash']
        ]);
        return ["status" => "success", "message" => "Turno abierto correctamente."];
    } catch (Exception $e) {
        return ["status" => "error", "message" => "Error al abrir turno: " . $e->getMessage()];
    }
}

function insertRole($data) {
    global $pdo;
    $name = trim($data['name'] ?? '');

    if ($name === '') {
        return ["status" => "error", "message" => "El nombre del rol es obligatorio"];
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO roles (name) VALUES (:name)");
        $stmt->execute(['name' => $name]);

        return [
            "status" => "success",
            "message" => "Rol registrado correctamente",
            "id" => $pdo->lastInsertId()
        ];

    } catch (Exception $e) {
        return [
            "status" => "error",
            "message" => "Error al registrar el rol: " . $e->getMessage()
        ];
    }
}

function updateRole($data) {
    global $pdo;

    $id_role = $data['id_role'] ?? null;
    $name = trim($data['name'] ?? '');

    if (!$id_role || $name === '') {
        return [
            "status" => "error",
            "message" => "Datos incompletos para actualizar el rol"
        ];
    }

    try {
        $stmt = $pdo->prepare("
            UPDATE roles
            SET name = :name
            WHERE id_role = :id_role
        ");

        $stmt->execute([
            'name' => $name,
            'id_role' => $id_role
        ]);

        return [
            "status" => "success",
            "message" => "Rol actualizado correctamente"
        ];

    } catch (Exception $e) {
        return [
            "status" => "error",
            "message" => "Error al actualizar el rol: " . $e->getMessage()
        ];
    }
}

function deleteRole($data) {
    global $pdo;

    $id_role = $data['id_role'] ?? null;

    if (!$id_role) {
        return [
            "status" => "error",
            "message" => "Falta el ID del rol a eliminar"
        ];
    }

    try {

        $stmt = $pdo->prepare("
            DELETE FROM roles
            WHERE id_role = :id_role
        ");

        $stmt->execute([
            'id_role' => $id_role
        ]);

        return [
            "status" => "success",
            "message" => "Rol eliminado correctamente"
        ];

    } catch (PDOException $e) {

        if ($e->getCode() == 23000) {
            return [
                "status" => "error",
                "message" => "No se puede eliminar: hay usuarios asignados a este rol"
            ];
        }

        return [
            "status" => "error",
            "message" => "Error al eliminar el rol: " . $e->getMessage()
        ];
    }
}
function insertDeviceType($datos) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO device_types (name) VALUES (:name)");
    $stmt->execute([":name" => $datos["name"]]);
    return $pdo->lastInsertId();
}

function insertServiceType($datos) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO service_types (name) VALUES (:name)");
    $stmt->execute([":name" => $datos["name"]]);
    return $pdo->lastInsertId();
}

function insertStatus($datos) {
    global $pdo; // O la variable de tu conexión PDO que uses en este proyecto
    $name = $datos["name"];
    
    try {
        $stmt = $pdo->prepare("INSERT INTO statuses (name) VALUES (:name)");
        $result = $stmt->execute([':name' => $name]);
        return $result;
    } catch (Exception $e) {
        return false;
    }
}

function getCashRegisterById($id_cut) {
    global $pdo;

    try {
        $stmt = $pdo->prepare("SELECT * FROM cash_register WHERE id_cut = :id_cut");
        $stmt->execute(['id_cut' => $id_cut]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($data) {
            return ["status" => "success", "data" => $data];
        }

        return ["status" => "error", "message" => "Registro no encontrado"];
    } catch (Exception $e) {
        return ["status" => "error", "message" => $e->getMessage()];
    }
}

function insertRepairOrder($post) {
    global $pdo;
    $sql = "INSERT INTO repair_orders (id_customer, id_device_type, id_service_type, id_user, brand_model, reported_fault, technical_diagnosis, final_price, id_status)
            VALUES ({$post['id_customer']}, {$post['id_device_type']}, {$post['id_service_type']}, {$post['id_user']}, '{$post['brand_model']}', '{$post['reported_fault']}', '{$post['technical_diagnosis']}', {$post['final_price']}, {$post['id_status']})";
    return $pdo->exec($sql);
}

function getCatalogsForOrder() {
    return [
        "customers" => getAllCustomers(),
        "device_types" => getAllDeviceTypes(),
        "service_types" => getAllServiceTypes(),
        "statuses" => getAllStatuses(),
        "users" => getAllUsers()
    ];
}

function deleteRepairOrder($id_order) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM repair_orders WHERE id_order = :id_order");
    $stmt->execute(['id_order' => $id_order]);
    return $stmt->rowCount() > 0; // Returns true if a row was deleted
}

?>
