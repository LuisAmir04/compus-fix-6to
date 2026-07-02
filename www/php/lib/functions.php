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
// FUNCIONES NUEVAS PARA LA RECEPCIÓN DE EQUIPOS
// ---------------------------------------------

function getCatalogsForOrder() {
    global $pdo;
    $devices = $pdo->query("SELECT id_device_type, name FROM device_types")->fetchAll(PDO::FETCH_ASSOC);
    $services = $pdo->query("SELECT id_service_type, name FROM service_types")->fetchAll(PDO::FETCH_ASSOC);
    return ["devices" => $devices, "services" => $services];
}

function createNewOrder($orderData) {
    global $pdo;
    
    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("SELECT id_customer FROM customers WHERE phone = :phone");
        $stmt->execute(['phone' => $orderData['customer_phone']]);
        $cliente_existente = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($cliente_existente) {
            $id_customer = $cliente_existente['id_customer'];
        } else {
            $stmt = $pdo->prepare("INSERT INTO customers (name, phone, email) VALUES (:name, :phone, :email)");
            $stmt->execute([
                'name' => $orderData['customer_name'],
                'phone' => $orderData['customer_phone'],
                'email' => $orderData['customer_email']
            ]);
            $id_customer = $pdo->lastInsertId();
        }

        $stmt = $pdo->prepare("
            INSERT INTO repair_orders (id_customer, id_device_type, id_service_type, id_user, brand_model, reported_fault, final_price, id_status)
            VALUES (:id_customer, :id_device_type, :id_service_type, :id_user, :brand_model, :reported_fault, :final_price, 1)
        ");
        $stmt->execute([
            'id_customer'     => $id_customer,
            'id_device_type'  => $orderData['id_device_type'],
            'id_service_type' => $orderData['id_service_type'],
            'id_user'         => $orderData['id_user'],
            'brand_model'     => $orderData['brand_model'],
            'reported_fault'  => $orderData['reported_fault'],
            'final_price'     => $orderData['final_price'] ?? 0
        ]);

        $pdo->commit();
        return ["status" => "success", "message" => "Orden registrada correctamente"];

    } catch (Exception $e) {
        $pdo->rollBack();
        return ["status" => "error", "message" => "Error al guardar: " . $e->getMessage()];
    }
}

// ---------------------------------------------
// FUNCIONES PARA LA MESA DE TRABAJO DEL TÉCNICO
// ---------------------------------------------

function getMyOrders($id_user) {
    global $pdo;
    $stmt = $pdo->prepare("
        SELECT o.id_order, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email, 
            o.brand_model, o.reported_fault, o.technical_diagnosis, o.final_price, s.name AS current_status, o.id_status
        FROM repair_orders o
        INNER JOIN customers c ON o.id_customer = c.id_customer
        INNER JOIN statuses s ON o.id_status = s.id_status
        WHERE o.id_user = :id_user AND o.id_status IN (1, 2, 3)
        ORDER BY o.created_at DESC
    ");
    $stmt->execute(['id_user' => $id_user]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function updateRepairOrder($data) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("
            UPDATE repair_orders 
            SET technical_diagnosis = :diagnosis, 
                final_price = :price, 
                id_status = :status 
            WHERE id_order = :id_order
        ");
        $stmt->execute([
            'diagnosis' => $data['technical_diagnosis'],
            'price'     => $data['final_price'],
            'status'    => $data['id_status'],
            'id_order'  => $data['id_order']
        ]);
        return ["status" => "success", "message" => "Orden actualizada correctamente"];
    } catch (Exception $e) {
        return ["status" => "error", "message" => "Error al actualizar: " . $e->getMessage()];
    }
}
// ---------------------------------------------
// FUNCIONES PARA VENTAS Y COBROS
// ---------------------------------------------

function processSale($data) {
    global $pdo;
    
    $estadoCaja = checkShiftStatus($data['id_user']);
    if ($estadoCaja['status'] === 'closed') {
        return ["status" => "error", "message" => "Operación denegada: Debes abrir un turno en 'Mi Corte de Caja' antes de poder cobrar un equipo."];
    }
    try {
        $pdo->beginTransaction();

        $stmt = $pdo->prepare("
            INSERT INTO sales (id_order, id_user, payment_method, total_paid) 
            VALUES (:id_order, :id_user, :payment_method, :total_paid)
        ");
        $stmt->execute([
            'id_order'       => $data['id_order'],
            'id_user'        => $data['id_user'],
            'payment_method' => $data['payment_method'],
            'total_paid'     => $data['total_paid']
        ]);

        $stmt = $pdo->prepare("UPDATE repair_orders SET id_status = 4 WHERE id_order = :id_order");
        $stmt->execute(['id_order' => $data['id_order']]);

        $pdo->commit();
        return ["status" => "success", "message" => "Cobro procesado exitosamente"];

    } catch (Exception $e) {
        $pdo->rollBack();
        return ["status" => "error", "message" => "Error al procesar: " . $e->getMessage()];
    }
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

function closeShift($data) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("
            UPDATE cash_register 
            SET closing_time = current_timestamp(), declared_cash = :declared_cash 
            WHERE id_cut = :id_cut
        ");
        $stmt->execute([
            'declared_cash' => $data['declared_cash'],
            'id_cut' => $data['id_cut']
        ]);
        return ["status" => "success", "message" => "Turno cerrado correctamente."];
    } catch (Exception $e) {
        return ["status" => "error", "message" => "Error al cerrar turno: " . $e->getMessage()];
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
?>