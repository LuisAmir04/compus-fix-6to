const tbody = document.querySelector("#tbody");
const formNuevaVenta = document.querySelector("#formNuevaVenta");

if (tbody) cargarVentas();
if (formNuevaVenta) iniciarFormulario();

function cargarVentas() {
    fetch("../php/sales.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            tbody.innerHTML = ""; 
            json.data.forEach(sale => {
                tbody.innerHTML += `
                    <tr class="border-b">
                        <td class="px-6 py-4 font-bold text-sm text-gray-700">#${sale.id_sale}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">Orden #${sale.id_order}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">${sale.cashier_name}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">${sale.payment_method}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">$${sale.total_paid}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">${sale.sale_date}</td>
                        <td class="px-6 py-4 text-sm">
                            <a href="editar.html" class="text-blue-600 mr-2 hover:underline">editar</a> | 
                            <a href="#" data-id="${sale.id_sale}" class="elim text-red-600 ml-2 hover:underline">eliminar</a>
                        </td>
                    </tr>
                `;
            });
        }
    });
}

function iniciarFormulario() {
    const selectOrder = document.querySelector("#id_order");
    const selectUser = document.querySelector("#id_user");
    
    fetch("../php/sales.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_catalogs" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            selectOrder.innerHTML = '<option value="">-- Selecciona --</option>';
            json.data.orders.forEach(o => {
                selectOrder.innerHTML += `<option value="${o.id_order}">Orden #${o.id_order} - ${o.customer_name}</option>`;
            });

            selectUser.innerHTML = '<option value="">-- Selecciona --</option>';
            json.data.users.forEach(u => {
                selectUser.innerHTML += `<option value="${u.id_user}">${u.username}</option>`;
            });
        }
    });

    formNuevaVenta.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const datos = {
            action: "insert",
            id_order: document.querySelector("#id_order").value,
            id_user: document.querySelector("#id_user").value,
            payment_method: document.querySelector("#payment_method").value,
            total_paid: document.querySelector("#total_paid").value
        };

        fetch("../php/sales.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                window.location.href = "index.html"; 
            } else {
                alert(json.message);
            }
        });
    });
}

if (tbody) {
    tbody.addEventListener('click', function(evento) {
        if (evento.target && evento.target.matches('.elim')) {
            evento.preventDefault(); 
            const id = evento.target.getAttribute('data-id');
            
            Swal.fire({
                title: "¿Estás seguro de eliminar esta venta?",
                text: "¡No vas a poder revertir esto!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch("../php/sales.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "delete_sale", id_sale: id })
                    })
                    .then(res => res.json())
                    .then(json => {
                        if (json.status === "success") {
                            Swal.fire("Borrado", "La venta ha sido eliminada.", "success").then(() => {
                                cargarVentas(); 
                            });
                        } else {
                            Swal.fire("Error", json.message, "error");
                        }
                    })
                    .catch(error => console.error("Error en la petición:", error));
                } 
            });
        }
    });
}