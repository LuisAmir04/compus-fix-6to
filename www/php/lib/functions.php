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
?>