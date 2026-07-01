document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.querySelector("#tbody");
    const formSale = document.getElementById("form-sale");
    const idSaleInput = document.getElementById("id_sale");
    const idOrderInput = document.getElementById("id_order");
    const cashierNameInput = document.getElementById("cashier_name");
    const paymentMethodInput = document.getElementById("payment_method");
    const totalPaidInput = document.getElementById("total_paid");
    
    const formTitle = document.getElementById("form-title");
    const btnSubmit = document.getElementById("btn-submit");
    const btnCancel = document.getElementById("btn-cancel");

    // Cargar las ventas al iniciar
    getAllSales();

    function getAllSales() {
        fetch("../php/sales.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getAll" })
        })
        .then(res => res.json())
        .then(json => {
            tbody.innerHTML = ""; 
            if (json.status === "success") {
                json.data.forEach(order => {
                    tbody.innerHTML += `
                        <tr class="hover">
                            <td class="px-6 py-4 text-sm text-gray-700 font-bold">${order.id_sale}</td>
                            <td class="px-6 py-4 text-sm text-gray-700">${order.id_order}</td>
                            <td class="px-6 py-4 text-sm text-gray-700">${order.cashier_name}</td>
                            <td class="px-6 py-4 text-sm text-gray-700"><span class="badge badge-neutral">${order.payment_method}</span></td>
                            <td class="px-6 py-4 text-sm text-gray-700 font-semibold">$${order.total_paid}</td>
                            <td class="px-6 py-4 text-sm text-gray-700">${order.sale_date}</td>
                            <td class="px-6 py-4 text-sm text-center flex justify-center gap-2">
                                <button class="btn btn-warning btn-sm btn-edit" data-sale='${JSON.stringify(order)}'>Editar</button>
                                <button class="btn btn-error btn-sm btn-delete" data-id="${order.id_sale}">Eliminar</button>
                            </td>
                        </tr>
                    `;
                });
                asignarEventosAcciones();
            } else {
                tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-gray-500">${json.message}</td></tr>`;
            }
        })
        .catch(error => console.error("Error en la petición:", error));
    }

    // Procesar Envío de Formulario (Insertar o Actualizar)
    formSale.addEventListener("submit", (e) => {
        e.preventDefault();

        const id_sale = idSaleInput.value;
        const payload = {
            action: id_sale ? "update_sale" : "process_sale",
            id_order: idOrderInput.value,
            cashier_name: cashierNameInput.value,
            payment_method: paymentMethodInput.value,
            total_paid: totalPaidInput.value
        };

        if (id_sale) {
            payload.id_sale = id_sale;
        }

        fetch("../php/sales.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                alert(json.message || "Operación realizada con éxito");
                resetForm();
                getAllSales();
            } else {
                alert("Error: " + json.message);
            }
        })
        .catch(error => console.error("Error al procesar:", error));
    });

    // Asignar controladores dinámicos a los botones Editar/Eliminar
    function asignarEventosAcciones() {
        // Evento Editar
        document.querySelectorAll(".btn-edit").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const orderData = JSON.parse(e.target.getAttribute("data-sale"));
                
                idSaleInput.value = orderData.id_sale;
                idOrderInput.value = orderData.id_order;
                cashierNameInput.value = orderData.cashier_name;
                paymentMethodInput.value = orderData.payment_method;
                totalPaidInput.value = orderData.total_paid;

                formTitle.textContent = "✏️ Editar Venta #" + orderData.id_sale;
                btnSubmit.textContent = "Actualizar Venta";
                btnSubmit.className = "btn btn-warning";
                btnCancel.classList.remove("hidden");
            });
        });

        // Evento Eliminar
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const id = e.target.getAttribute("data-id");
                if (confirm(`¿Estás seguro de que deseas eliminar la venta #${id}?`)) {
                    fetch("../php/sales.php", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "delete_sale", id_sale: id })
                    })
                    .then(res => res.json())
                    .then(json => {
                        if (json.status === "success") {
                            alert(json.message);
                            getAllSales();
                        } else {
                            alert("Error: " + json.message);
                        }
                    })
                    .catch(error => console.error("Error al eliminar:", error));
                }
            });
        });
    }

    btnCancel.addEventListener("click", resetForm);

    function resetForm() {
        formSale.reset();
        idSaleInput.value = "";
        formTitle.textContent = "📦 Registrar Nueva Venta";
        btnSubmit.textContent = "Guardar Venta";
        btnSubmit.className = "btn btn-primary";
        btnCancel.classList.add("hidden");
    }
});