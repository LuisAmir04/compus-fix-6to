const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formOrden");
const idOrden = new URLSearchParams(window.location.search).get("id");

if (tbody) cargarOrdenes();
if (form) iniciarFormulario();

function cargarOrdenes() {
    fetch("../php/repair_orders.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        tbody.innerHTML = "";
        json.data.forEach(order => {
            tbody.innerHTML += `
            <tr>
                <td>${order.id_order}</td>
                <td>${order.customer_name}</td>
                <td>${order.device_type}</td>
                <td>${order.service_type}</td>
                <td>${order.technician_name}</td>
                <td>${order.brand_model}</td>
                <td>${order.reported_fault}</td>
                <td>${order.technical_diagnosis}</td>
                <td>${order.final_price}</td>
                <td>${order.current_status}</td>
                <td>${order.created_at}</td>
                <td>
                    <a href="formulario.html?id=${order.id_order}" class="btn btn-sm btn-warning">Editar</a>
                    <button class="btn btn-sm btn-error" onclick="eliminarOrden(${order.id_order})">Eliminar</button>
                </td>
            </tr>`;
        });
    });
}

function eliminarOrden(id) {
    if (!confirm("¿Eliminar esta orden?")) return;
    fetch("../php/repair_orders.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_order", id_order: id })
    })
    .then(res => res.json())
    .then(json => {
        alert(json.message);
        cargarOrdenes();
    });
}

function iniciarFormulario() {
    fetch("../php/repair_orders.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_catalogs" })
    })
    .then(res => res.json())
    .then(json => {
        llenarSelect("id_customer", json.data.customers, "id_customer", "name");
        llenarSelect("id_device_type", json.data.device_types, "id_device_type", "name");
        llenarSelect("id_service_type", json.data.service_types, "id_service_type", "name");
        llenarSelect("id_status", json.data.statuses, "id_status", "name");
        llenarSelect("id_user", json.data.users, "id_user", "username");

        if (idOrden) cargarDatosOrden();
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(form));
        datos.action = idOrden ? "update_order" : "insert_order";

        fetch("../php/repair_orders.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(json => {
            alert(json.message);
            if (json.status === "success") window.location.href = "index.html";
        });
    });
}

function llenarSelect(name, items, valueField, textField) {
    const select = form.elements[name];
    select.innerHTML = '<option value="">-- Selecciona --</option>';
    items.forEach(item => {
        select.innerHTML += `<option value="${item[valueField]}">${item[textField]}</option>`;
    });
}

function cargarDatosOrden() {
    fetch("../php/repair_orders.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_order", id_order: idOrden })
    })
    .then(res => res.json())
    .then(json => {
        for (const campo in json.data) {
            if (form.elements[campo]) form.elements[campo].value = json.data[campo];
        }
    });
}