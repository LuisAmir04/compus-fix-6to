<?php
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

function getAllCustomers($ordenarPor, $direccion, $limite, $offset, $busqueda = '') {
    global $pdo;
    
    // Validar por seguridad que ordenarPor no esté vacío y dirección sea válida
    $ordenarPor = $ordenarPor ?: 'id_customer';
    $direccion = ($direccion === 'DESC') ? 'DESC' : 'ASC';
    
    // Base de la consulta
    $sql = "SELECT id_customer, name, phone, email FROM customers ";
    
    // Si el usuario escribió algo en el buscador, agregamos el WHERE
    if ($busqueda !== '') {
        $sql .= " WHERE name LIKE :busqueda OR email LIKE :busqueda OR phone LIKE :busqueda ";
    }
    
    // Agregamos el ordenamiento y límite
    $sql .= " ORDER BY " . $ordenarPor . " " . $direccion . " LIMIT " . (int)$limite . " OFFSET " . (int)$offset;
    
    $stmt = $pdo->prepare($sql);
    
    // Si hay búsqueda, pasamos el parámetro de forma segura para evitar Inyección SQL
    if ($busqueda !== '') {
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $stmt->execute();
    }
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getCustomerById($id_customer) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM customers WHERE id_customer = :id_customer");
    $stmt->execute(['id_customer' => $id_customer]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function insertCustomer($name, $email, $phone) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO customers(name, email, phone) VALUES (:name, :email, :phone)");
    return $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone
    ]);
}

function updateCustomer($id_customer, $name, $phone , $email ) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE customers SET name = :name, email = :email, phone = :phone WHERE id_customer = :id_customer");
    return $stmt->execute([
        ':id_customer' => $id_customer,
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone
    ]);
}

function deleteCustomer($id_customer) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM customers WHERE id_customer = :id_customer");
    return $stmt->execute([':id_customer' => $id_customer]);
}


function getAllUsers($ordenarPor, $direccion, $limite, $offset, $busqueda = '') {
    global $pdo;
    
    $ordenarPor = $ordenarPor ?: 'id_user';
    $direccion = ($direccion === 'DESC') ? 'DESC' : 'ASC';
    
    $sql = "
        SELECT 
            u.id_user, 
            u.username, 
            r.name AS role_name 
        FROM users u 
        INNER JOIN roles r ON u.id_role = r.id_role
    ";
    
    if ($busqueda !== '') {
        $sql .= "
            WHERE u.username LIKE :busqueda 
               OR r.name LIKE :busqueda
        ";
    }
    
    $sql .= " ORDER BY " . $ordenarPor . " " . $direccion . " LIMIT " . (int)$limite . " OFFSET " . (int)$offset;
    
    $stmt = $pdo->prepare($sql);
    
    if ($busqueda !== '') {
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $stmt->execute();
    }
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getUsersForCatalog() {
    global $pdo;
    $stmt = $pdo->query("SELECT id_user, username, id_role FROM users ORDER BY username ASC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllRepairOrders($ordenarPor, $direccion, $limite, $offset, $busqueda = '') {
    global $pdo;
    
    // Validaciones básicas de seguridad
    $ordenarPor = $ordenarPor ?: 'id_order';
    $direccion = ($direccion === 'DESC') ? 'DESC' : 'ASC';
    
    // Base de la consulta con todos los JOINs
    $sql = "
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
    ";
    
    // Agregamos los filtros de búsqueda
    if ($busqueda !== '') {
        $sql .= "
            WHERE c.name LIKE :busqueda 
               OR u.username LIKE :busqueda 
               OR o.brand_model LIKE :busqueda 
               OR s.name LIKE :busqueda
               OR o.created_at LIKE :busqueda
        ";
    }
    
    // Agregamos el ordenamiento y el paginador
    $sql .= " ORDER BY " . $ordenarPor . " " . $direccion . " LIMIT " . (int)$limite . " OFFSET " . (int)$offset;
    
    $stmt = $pdo->prepare($sql);
    
    if ($busqueda !== '') {
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $stmt->execute();
    }
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getAllSales($ordenarPor, $direccion, $limite, $offset, $busqueda = '') {
    global $pdo;
    
    $ordenarPor = $ordenarPor ?: 'id_sale';
    $direccion = ($direccion === 'DESC') ? 'DESC' : 'ASC';
    
    $sql = "
        SELECT 
            s.id_sale,
            s.id_order,
            ro.brand_model,
            u.username AS cashier_name,
            s.payment_method,
            s.total_paid,
            s.sale_date
        FROM sales s
        INNER JOIN users u ON s.id_user = u.id_user
        INNER JOIN repair_orders ro ON s.id_order = ro.id_order
    ";
    
    if ($busqueda !== '') {
        $sql .= "
            WHERE s.id_order LIKE :busqueda
               OR ro.brand_model LIKE :busqueda 
               OR u.username LIKE :busqueda 
               OR s.payment_method LIKE :busqueda
               OR s.sale_date LIKE :busqueda
        ";
    }
    
    $sql .= " ORDER BY " . $ordenarPor . " " . $direccion . " LIMIT " . (int)$limite . " OFFSET " . (int)$offset;
    
    $stmt = $pdo->prepare($sql);
    
    if ($busqueda !== '') {
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $stmt->execute();
    }
    
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function getAllCashRegister($ordenarPor, $direccion, $limite, $offset, $busqueda = '') {
    global $pdo;
    
    $ordenarPor = $ordenarPor ?: 'id_cut';
    $direccion = ($direccion === 'DESC') ? 'DESC' : 'ASC';
    
    $sql = "
        SELECT 
            cr.id_cut,
            u.username AS cashier_name,
            cr.opening_time,
            cr.initial_cash,
            cr.closing_time,
            cr.declared_cash
        FROM cash_register cr
        INNER JOIN users u ON cr.id_user = u.id_user
    ";
    
    if ($busqueda !== '') {
        $sql .= "
            WHERE u.username LIKE :busqueda 
               OR cr.opening_time LIKE :busqueda
               OR cr.closing_time LIKE :busqueda
        ";
    }
    
    $sql .= " ORDER BY " . $ordenarPor . " " . $direccion . " LIMIT " . (int)$limite . " OFFSET " . (int)$offset;
    
    $stmt = $pdo->prepare($sql);
    
    if ($busqueda !== '') {
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $stmt->execute();
    }
    
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

    $declared_cash = $data['declared_cash'] !== '' ? $data['declared_cash'] : null;

    try {
        if ($declared_cash !== null) {
            $stmt = $pdo->prepare("
                UPDATE cash_register
                SET initial_cash = :initial_cash,
                    declared_cash = :declared_cash,
                    closing_time = IFNULL(closing_time, NOW())
                WHERE id_cut = :id_cut
            ");
        } else {
            $stmt = $pdo->prepare("
                UPDATE cash_register
                SET initial_cash = :initial_cash,
                    declared_cash = NULL,
                    closing_time = NULL
                WHERE id_cut = :id_cut
            ");
        }

        $stmt->execute([
            'initial_cash' => $data['initial_cash'],
            'declared_cash' => $declared_cash,
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

function closeShift($data) {
    global $pdo;

    try {
        $stmt = $pdo->prepare("
            UPDATE cash_register
            SET closing_time = NOW(),
                declared_cash = :declared_cash
            WHERE id_cut = :id_cut
        ");

        $stmt->execute([
            'declared_cash' => $data['declared_cash'],
            'id_cut' => $data['id_cut']
        ]);

        return [
            "status" => "success",
            "message" => "Turno cerrado correctamente."
        ];

    } catch (Exception $e) {
        return [
            "status" => "error",
            "message" => $e->getMessage()
        ];
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
    
    $sql = "INSERT INTO repair_orders 
            (id_customer, id_device_type, id_service_type, id_user, brand_model, reported_fault, technical_diagnosis, final_price, id_status)
            VALUES (:id_customer, :id_device_type, :id_service_type, :id_user, :brand_model, :reported_fault, :technical_diagnosis, :final_price, :id_status)";
            
    $stmt = $pdo->prepare($sql);
    $ok = $stmt->execute([
        ':id_customer' => $post['id_customer'],
        ':id_device_type' => $post['id_device_type'],
        ':id_service_type' => $post['id_service_type'],
        ':id_user' => $post['id_user'],
        ':brand_model' => $post['brand_model'],
        ':reported_fault' => $post['reported_fault'],
        ':technical_diagnosis' => $post['technical_diagnosis'],
        ':final_price' => $post['final_price'],
        ':id_status' => $post['id_status']
    ]);

    if ($ok) {
        $id_order = $pdo->lastInsertId();
        registrarCambioEstado($id_order, $post['id_status'], $post['id_user']);
    }

    return $ok;
}

function getCatalogsForOrder() {
    return [
        "customers" => getCustomersForCatalog(),
        "device_types" => getAllDeviceTypes(),
        "service_types" => getAllServiceTypes(),
        "statuses" => getAllStatuses(),
        "users" => getUsersForCatalog()
    ];
}

//Solo para el menú desplegable, trae todos sin paginar
function getCustomersForCatalog() {
    global $pdo;
    $stmt = $pdo->query("
        SELECT 
            id_customer, 
            name,
            CONCAT(name, ' - Tel: ', phone, IF(email IS NOT NULL AND email != '', CONCAT(' (', email, ')'), '')) AS display_name
        FROM customers 
        ORDER BY name ASC
    ");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function deleteRepairOrder($id_order) {
    global $pdo;
    $stmt = $pdo->prepare("DELETE FROM repair_orders WHERE id_order = :id_order");
    $stmt->execute(['id_order' => $id_order]);
    return $stmt->rowCount() > 0; // Returns true if a row was deleted
}

function getRepairOrdersForCatalog() {
    global $pdo;
    $sql = "
        SELECT 
            o.id_order, 
            o.brand_model, 
            c.name AS customer_name
        FROM repair_orders o
        INNER JOIN customers c ON o.id_customer = c.id_customer
        ORDER BY o.id_order DESC
    ";
    
    $stmt = $pdo->query($sql);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
function getCatalogsForSales() {
    return [
        "users" => getUsersForCatalog(),
        "orders" => getRepairOrdersForCatalog()
    ];
}

function insertSale($datos) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("INSERT INTO sales (id_order, id_user, payment_method, total_paid) 
                               VALUES (:id_order, :id_user, :payment_method, :total_paid)");
        return $stmt->execute([
            ':id_order' => $datos['id_order'],
            ':id_user' => $datos['id_user'],
            ':payment_method' => $datos['payment_method'],
            ':total_paid' => $datos['total_paid']
        ]);
    } catch (PDOException $e) {
        return false;
    }
}

function deleteSale($id_sale) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("DELETE FROM sales WHERE id_sale = :id_sale");
        $stmt->execute([':id_sale' => $id_sale]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        return false;
    }
}

function getOrderById($id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM repair_orders WHERE id_order = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateRepairOrderRow($post) {
    global $pdo;

    $stmtActual = $pdo->prepare("SELECT id_status FROM repair_orders WHERE id_order = :id_order");
    $stmtActual->execute([':id_order' => $post['id_order']]);
    $ordenActual = $stmtActual->fetch(PDO::FETCH_ASSOC);

    $sql = "UPDATE repair_orders SET
            id_customer = :id_customer,
            id_device_type = :id_device_type,
            id_service_type = :id_service_type,
            id_user = :id_user,
            brand_model = :brand_model,
            reported_fault = :reported_fault,
            technical_diagnosis = :technical_diagnosis,
            final_price = :final_price,
            id_status = :id_status
            WHERE id_order = :id_order";
            
    $stmt = $pdo->prepare($sql);
    $ok = $stmt->execute([
        ':id_customer' => $post['id_customer'],
        ':id_device_type' => $post['id_device_type'],
        ':id_service_type' => $post['id_service_type'],
        ':id_user' => $post['id_user'],
        ':brand_model' => $post['brand_model'],
        ':reported_fault' => $post['reported_fault'],
        ':technical_diagnosis' => $post['technical_diagnosis'],
        ':final_price' => $post['final_price'],
        ':id_status' => $post['id_status'],
        ':id_order' => $post['id_order']
    ]);

    // Solo registra en el historial si el estado en verdad cambió
    if ($ok && $ordenActual && $ordenActual['id_status'] != $post['id_status']) {
        registrarCambioEstado($post['id_order'], $post['id_status'], $post['id_user']);
    }

    return $ok;
}
function getDeviceTypeById($id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM device_types WHERE id_device_type = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateDeviceType($datos) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE device_types SET name = :name WHERE id_device_type = :id");
    return $stmt->execute([
        ':name' => $datos['name'], 
        ':id' => $datos['id_device_type']
    ]);
}

function deleteDeviceType($id) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("DELETE FROM device_types WHERE id_device_type = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        return false;
    }
}

function getServiceTypeById($id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM service_types WHERE id_service_type = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateServiceType($datos) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE service_types SET name = :name WHERE id_service_type = :id");
    return $stmt->execute([
        ':name' => $datos['name'], 
        ':id' => $datos['id_service_type']
    ]);
}

function deleteServiceType($id) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("DELETE FROM service_types WHERE id_service_type = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        return false;
    }
}

function getStatusById($id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM statuses WHERE id_status = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateStatus($datos) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE statuses SET name = :name WHERE id_status = :id");
    return $stmt->execute([
        ':name' => $datos['name'], 
        ':id' => $datos['id_status']
    ]);
}

function deleteStatus($id) {
    global $pdo;
    try {
        $stmt = $pdo->prepare("DELETE FROM statuses WHERE id_status = :id");
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    } catch (PDOException $e) {
        return false;
    }
}

function getSaleById($id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM sales WHERE id_sale = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateSale($datos) {
    global $pdo;
    $stmt = $pdo->prepare("UPDATE sales SET 
                            id_order = :id_order, 
                            id_user = :id_user, 
                            payment_method = :payment_method, 
                            total_paid = :total_paid 
                           WHERE id_sale = :id_sale");
    return $stmt->execute([
        ':id_order' => $datos['id_order'],
        ':id_user' => $datos['id_user'],
        ':payment_method' => $datos['payment_method'],
        ':total_paid' => $datos['total_paid'],
        ':id_sale' => $datos['id_sale']
    ]);
}

function getRoleById($id) {
    global $pdo;
    $stmt = $pdo->prepare("SELECT * FROM roles WHERE id_role = :id");
    $stmt->execute(['id' => $id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getCountCustomers($busqueda = '') {
    global $pdo;
    // Si hay un término de búsqueda, ajustamos la consulta para filtrar por nombre, correo o teléfono
    if ($busqueda !== '') {
        $sql = "SELECT COUNT(*) as total FROM customers WHERE name LIKE :busqueda OR email LIKE :busqueda OR phone LIKE :busqueda";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $sql = "SELECT COUNT(*) as total FROM customers";
        $stmt = $pdo->query($sql);
    }
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['total'];
}

function getCountRepairOrders($busqueda = '') {
    global $pdo;
    
    if ($busqueda !== '') {
        // Debemos hacer los mismos JOINs aquí para poder contar usando los nombres (cliente, tecnico, status)
        $sql = "
            SELECT COUNT(*) as total 
            FROM repair_orders o
            INNER JOIN customers c ON o.id_customer = c.id_customer
            INNER JOIN users u ON o.id_user = u.id_user
            INNER JOIN statuses s ON o.id_status = s.id_status
            WHERE c.name LIKE :busqueda 
               OR u.username LIKE :busqueda 
               OR o.brand_model LIKE :busqueda 
               OR s.name LIKE :busqueda
               OR o.created_at LIKE :busqueda
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $sql = "SELECT COUNT(*) as total FROM repair_orders";
        $stmt = $pdo->query($sql);
    }
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['total'];
}

function getCountCashRegister($busqueda = '') {
    global $pdo;
    
    if ($busqueda !== '') {
        $sql = "
            SELECT COUNT(*) as total 
            FROM cash_register cr
            INNER JOIN users u ON cr.id_user = u.id_user
            WHERE u.username LIKE :busqueda 
               OR cr.opening_time LIKE :busqueda
               OR cr.closing_time LIKE :busqueda
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $sql = "SELECT COUNT(*) as total FROM cash_register";
        $stmt = $pdo->query($sql);
    }
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['total'];
}

function getCountSales($busqueda = '') {
    global $pdo;
    
    if ($busqueda !== '') {
        $sql = "
            SELECT COUNT(*) as total 
            FROM sales s
            INNER JOIN users u ON s.id_user = u.id_user
            INNER JOIN repair_orders ro ON s.id_order = ro.id_order
            WHERE s.id_order LIKE :busqueda
               OR ro.brand_model LIKE :busqueda 
               OR u.username LIKE :busqueda 
               OR s.payment_method LIKE :busqueda
               OR s.sale_date LIKE :busqueda
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $sql = "SELECT COUNT(*) as total FROM sales";
        $stmt = $pdo->query($sql);
    }
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['total'];
}

function getCountUsers($busqueda = '') {
    global $pdo;
    
    if ($busqueda !== '') {
        $sql = "
            SELECT COUNT(*) as total 
            FROM users u
            INNER JOIN roles r ON u.id_role = r.id_role
            WHERE u.username LIKE :busqueda 
               OR r.name LIKE :busqueda
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $sql = "SELECT COUNT(*) as total FROM users";
        $stmt = $pdo->query($sql);
    }
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['total'];
}

function protegerModulo($post, $rolesPermitidos) {
    global $pdo;

    $token = $post['token'] ?? '';

    if (!$token) {
        echo json_encode(["status" => "error", "message" => "No has iniciado sesión"]);
        exit;
    }

    // Verifica el token contra la BD con una consulta
    $stmt = $pdo->prepare("
        SELECT u.id_user, u.id_role 
        FROM sessions s
        INNER JOIN users u ON s.id_user = u.id_user
        WHERE s.token = :token AND s.expires_at > NOW()
    ");
    $stmt->execute(["token" => $token]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        echo json_encode(["status" => "error", "message" => "Sesión inválida o expirada"]);
        exit;
    }

    if (!in_array($usuario['id_role'], $rolesPermitidos)) {
        echo json_encode(["status" => "error", "message" => "No tienes permiso para este módulo"]);
        exit;
    }

    return $usuario;
}

function getAllSessions($ordenarPor, $direccion, $limite, $offset, $busqueda = '') {
    global $pdo;

    $ordenarPor = $ordenarPor ?: 'id_session';
    $direccion = ($direccion === 'DESC') ? 'DESC' : 'ASC';

    $sql = "
        SELECT 
            s.id_session,
            u.username,
            s.created_at,
            s.expires_at,
            CASE WHEN s.expires_at > NOW() THEN 'Activa' ELSE 'Cerrada' END AS estado
        FROM sessions s
        INNER JOIN users u ON s.id_user = u.id_user
    ";

    if ($busqueda !== '') {
        $sql .= " WHERE u.username LIKE :busqueda ";
    }

    $sql .= " ORDER BY " . $ordenarPor . " " . $direccion . " LIMIT " . (int)$limite . " OFFSET " . (int)$offset;

    $stmt = $pdo->prepare($sql);

    if ($busqueda !== '') {
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $stmt->execute();
    }

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getCountSessions($busqueda = '') {
    global $pdo;

    if ($busqueda !== '') {
        $sql = "
            SELECT COUNT(*) as total 
            FROM sessions s
            INNER JOIN users u ON s.id_user = u.id_user
            WHERE u.username LIKE :busqueda
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $sql = "SELECT COUNT(*) as total FROM sessions";
        $stmt = $pdo->query($sql);
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['total'];
}

function registrarCambioEstado($id_order, $id_status, $id_user) {
    global $pdo;
    $stmt = $pdo->prepare("INSERT INTO repair_order_status_history (id_order, id_status, id_user) VALUES (:id_order, :id_status, :id_user)");
    $stmt->execute([
        ':id_order' => $id_order,
        ':id_status' => $id_status,
        ':id_user' => $id_user
    ]);
}

function getOrdenesPorServicio() {
    global $pdo;
    $sql = "
        SELECT st.name AS servicio, COUNT(*) AS total
        FROM repair_orders o
        INNER JOIN service_types st ON o.id_service_type = st.id_service_type
        GROUP BY st.name
        ORDER BY total DESC
    ";
    return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
}

function getOrdenesPorEstado() {
    global $pdo;
    $sql = "
        SELECT s.name AS estado, COUNT(*) AS total
        FROM repair_orders o
        INNER JOIN statuses s ON o.id_status = s.id_status
        GROUP BY s.name
        ORDER BY total DESC
    ";
    return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
}

function getOrdenesEntregadasPorMes() {
    global $pdo;
    $sql = "
        SELECT 
            DATE_FORMAT(h.changed_at, '%Y-%m') AS mes,
            COUNT(DISTINCT h.id_order) AS total
        FROM repair_order_status_history h
        INNER JOIN statuses s ON h.id_status = s.id_status
        WHERE s.name = 'Entregado'
          AND h.changed_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(h.changed_at, '%Y-%m')
        ORDER BY mes ASC
    ";
    return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
}

function getVentasResumenMensual() {
    global $pdo;
    $sql = "
        SELECT
            SUM(CASE WHEN MONTH(sale_date) = MONTH(CURDATE()) AND YEAR(sale_date) = YEAR(CURDATE()) THEN total_paid ELSE 0 END) AS mes_actual,
            SUM(CASE WHEN MONTH(sale_date) = MONTH(CURDATE() - INTERVAL 1 MONTH) AND YEAR(sale_date) = YEAR(CURDATE() - INTERVAL 1 MONTH) THEN total_paid ELSE 0 END) AS mes_pasado
        FROM sales
    ";
    return $pdo->query($sql)->fetch(PDO::FETCH_ASSOC);
}

function getVentasPorDia() {
    global $pdo;
    $sql = "
        SELECT DATE(sale_date) AS dia, SUM(total_paid) AS total
        FROM sales
        WHERE sale_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY DATE(sale_date)
        ORDER BY dia ASC
    ";
    return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
}

function getVentasPorMetodoPago() {
    global $pdo;
    $sql = "
        SELECT payment_method, COUNT(*) AS cantidad, SUM(total_paid) AS total
        FROM sales
        GROUP BY payment_method
        ORDER BY total DESC
    ";
    return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
}

function getRendimientoTecnicos() {
    global $pdo;
    $sql = "
        SELECT 
            u.username AS tecnico,
            COUNT(o.id_order) AS ordenes_atendidas,
            SUM(CASE WHEN s.name = 'Entregado' THEN 1 ELSE 0 END) AS ordenes_completadas,
            COALESCE(SUM(CASE WHEN s.name = 'Entregado' THEN o.final_price ELSE 0 END), 0) AS total_generado
        FROM users u
        INNER JOIN repair_orders o ON o.id_user = u.id_user
        INNER JOIN statuses s ON o.id_status = s.id_status
        WHERE u.id_role = 2
        GROUP BY u.username
        ORDER BY ordenes_completadas DESC
    ";
    return $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
}

function getTotalOrdenes() {
    global $pdo;
    $stmt = $pdo->query("SELECT COUNT(*) AS total FROM repair_orders");
    return $stmt->fetch(PDO::FETCH_ASSOC)['total'];
}

function getAllOrderHistory($ordenarPor, $direccion, $limite, $offset, $busqueda = '') {
    global $pdo;

    $ordenarPor = $ordenarPor ?: 'fecha_cambio';
    $direccion = ($direccion === 'ASC') ? 'ASC' : 'DESC';

    $sql = "
        SELECT 
            h.id_order,
            c.name AS cliente,
            s.name AS estado,
            u.username AS tecnico,
            o.created_at AS fecha_creacion,
            h.changed_at AS fecha_cambio
        FROM repair_order_status_history h
        INNER JOIN repair_orders o ON h.id_order = o.id_order
        INNER JOIN customers c ON o.id_customer = c.id_customer
        INNER JOIN statuses s ON h.id_status = s.id_status
        INNER JOIN users u ON h.id_user = u.id_user
    ";

    if ($busqueda !== '') {
        $sql .= "
            WHERE c.name LIKE :busqueda 
               OR u.username LIKE :busqueda
               OR DATE_FORMAT(o.created_at, '%Y-%m-%d') LIKE :busqueda
               OR DATE_FORMAT(h.changed_at, '%Y-%m-%d') LIKE :busqueda
        ";
    }

    $sql .= " ORDER BY " . $ordenarPor . " " . $direccion . " LIMIT " . (int)$limite . " OFFSET " . (int)$offset;

    $stmt = $pdo->prepare($sql);

    if ($busqueda !== '') {
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $stmt->execute();
    }

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getCountOrderHistory($busqueda = '') {
    global $pdo;

    $sql = "
        SELECT COUNT(*) as total 
        FROM repair_order_status_history h
        INNER JOIN repair_orders o ON h.id_order = o.id_order
        INNER JOIN customers c ON o.id_customer = c.id_customer
        INNER JOIN users u ON h.id_user = u.id_user
    ";

    if ($busqueda !== '') {
        $sql .= "
            WHERE c.name LIKE :busqueda 
               OR u.username LIKE :busqueda
               OR DATE_FORMAT(o.created_at, '%Y-%m-%d') LIKE :busqueda
               OR DATE_FORMAT(h.changed_at, '%Y-%m-%d') LIKE :busqueda
        ";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':busqueda' => "%$busqueda%"]);
    } else {
        $stmt = $pdo->query($sql);
    }

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    return $result['total'];
}

?>