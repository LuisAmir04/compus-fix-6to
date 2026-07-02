const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formOrden");

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
        if (json.status === "success") {
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
                        <a href="editar.html" class="btn btn-sm btn-warning">Editar</a>
                        <a href="#" data-id="${order.id_order}" class="btn btn-sm btn-error">Eliminar</a>
                    </td>
                </tr>`;
            });
        }
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
        if(json.status === "success") {
            llenarSelect("id_customer", json.data.customers, "id_customer", "name");
            llenarSelect("id_device_type", json.data.device_types, "id_device_type", "name");
            llenarSelect("id_service_type", json.data.service_types, "id_service_type", "name");
            llenarSelect("id_status", json.data.statuses, "id_status", "name");
            llenarSelect("id_user", json.data.users, "id_user", "username");
        }
    });

    form.addEventListener("submit", function(e) {
        e.preventDefault();
        const datos = Object.fromEntries(new FormData(form));
        datos.action = "insert_order";

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

tbody.addEventListener('click', function(evento) {
  // Verificamos si el elemento clickeado coincide con nuestro elemento dinámico
  if (evento.target && evento.target.matches('.btn-error')) {
    const id = evento.target.getAttribute('data-id');
    console.log('¡Elemento dinámico clickeado! ID:', id);
    Swal.fire({
        title: "Estas seguro de eliminar este registro?",
        text: "No vas a poder revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirmar",
        }).then((result) => {
        if (result.isConfirmed) {
            const datos = { action: "delete_order", id_order: id };
            fetch("../php/repair_orders.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(json => {
                let response = {
                        title: "Borrado",
                        text: "Tu registro ha sido eliminado.",
                        icon: "success"
                    }
                if (json.status === "error") {
                    response = {
                        title: "Error",
                        text: "No se pudo eliminar el registro.",
                        icon: "error"
                    }
                }
                Swal.fire(response);
                cargarOrdenes();
            })
        } 
    });
  }
});