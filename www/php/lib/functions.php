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

function getOrderById($id) {
    global $pdo;
    return $pdo->query("SELECT * FROM repair_orders WHERE id_order = $id")->fetch(PDO::FETCH_ASSOC);
}

function insertRepairOrder($post) {
    global $pdo;
    $sql = "INSERT INTO repair_orders (id_customer, id_device_type, id_service_type, id_user, brand_model, reported_fault, technical_diagnosis, final_price, id_status)
            VALUES ({$post['id_customer']}, {$post['id_device_type']}, {$post['id_service_type']}, {$post['id_user']}, '{$post['brand_model']}', '{$post['reported_fault']}', '{$post['technical_diagnosis']}', {$post['final_price']}, {$post['id_status']})";
    return $pdo->exec($sql);
}

function updateRepairOrderRow($post) {
    global $pdo;
    $sql = "UPDATE repair_orders SET
            id_customer = {$post['id_customer']},
            id_device_type = {$post['id_device_type']},
            id_service_type = {$post['id_service_type']},
            id_user = {$post['id_user']},
            brand_model = '{$post['brand_model']}',
            reported_fault = '{$post['reported_fault']}',
            technical_diagnosis = '{$post['technical_diagnosis']}',
            final_price = {$post['final_price']},
            id_status = {$post['id_status']}
            WHERE id_order = {$post['id_order']}";
    return $pdo->exec($sql);
}

function deleteRepairOrder($id) {
    global $pdo;
    return $pdo->exec("DELETE FROM repair_orders WHERE id_order = $id");
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