document.addEventListener("DOMContentLoaded", loadCashRegisters);

function loadCashRegisters() {
    fetch("../php/cash_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            const tbody = document.querySelector("#tbody");
            tbody.innerHTML = "";

            json.data.forEach(order => {
                tbody.innerHTML += `
                    <tr>
                        <td class="px-6 py-4 text-sm text-gray-700">${order.id_cut}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">${order.cashier_name}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">${order.opening_time}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">${order.initial_cash}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">${order.closing_time ?? ""}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">${order.declared_cash ?? ""}</td>
                        <td class="px-6 py-4 text-sm text-gray-700">
                           <td class="px-6 py-4">
                                <div class="flex gap-2">
                                    <button
                                        class="btn btn-sm btn-warning"
                                        onclick="editar(${order.id_cut})">
                                        ✏️ Editar
                                    </button>

                                        <button
                                            class="btn btn-sm btn-error"
                                            onclick="eliminar(${order.id_cut})">
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </td>
                        </td>
                    </tr>
                `;
            });
        } else {
            console.error("Error:", json.message);
        }
    })
    .catch(error => console.error("Error en la petición:", error));
}

function editar(id_cut) {
    window.location.href = `editar.html?id=${id_cut}`;
}

function eliminar(id_cut) {
    if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

    fetch("../php/cash_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "delete",
            id_cut: id_cut
        })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            alert("Registro eliminado correctamente");
            loadCashRegisters();
        } else {
            alert(json.message || "No se pudo eliminar");
        }
    })
    .catch(error => console.error("Error al eliminar:", error));
}