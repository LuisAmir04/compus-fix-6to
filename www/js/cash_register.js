import {
    getCashRegisters,
    getCashRegisterById,
    updateCashRegister,
    deleteCashRegister
} from "./api_cash_register.js?v=3";

document.addEventListener("DOMContentLoaded", () => {
    loadCashRegisters();

    const btnActualizar = document.getElementById("btnActualizar");
    const btnCancelar = document.getElementById("btnCancelar");

    if (btnActualizar) btnActualizar.addEventListener("click", guardarEdicion);
    if (btnCancelar) btnCancelar.addEventListener("click", cerrarEdicion);
});

function loadCashRegisters() {
    getCashRegisters()
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
                            <td class="px-6 py-4">
                                <div class="flex gap-2">
                                    <button class="btn btn-sm btn-warning btn-editar" data-id="${order.id_cut}">✏️ Editar</button>
                                    <button class="btn btn-sm btn-error btn-eliminar" data-id="${order.id_cut}">🗑️ Eliminar</button>
                                </div>
                            </td>
                        </tr>
                    `;
                });

                document.querySelectorAll(".btn-editar").forEach(btn => {
                    btn.addEventListener("click", () => editar(btn.dataset.id));
                });

                document.querySelectorAll(".btn-eliminar").forEach(btn => {
                    btn.addEventListener("click", () => eliminar(btn.dataset.id));
                });
            }
        })
        .catch(err => console.error(err));
}

function editar(id_cut) {
    console.log("Editar ID:", id_cut);

    getCashRegisterById(id_cut)
        .then(json => {
            console.log("Respuesta completa:", JSON.stringify(json, null, 2));

            if (json.status === "success" && json.data) {
                const idInput = document.getElementById("edit_id_cut");
                const initialInput = document.getElementById("edit_initial_cash");
                const declaredInput = document.getElementById("edit_declared_cash");
                const section = document.getElementById("editSection");
                const table = document.getElementById("tableSection");
                const btnAgregar = document.getElementById("btnAgregar");
                const navbar = document.getElementById("navbar-container");

                if (!idInput || !initialInput || !declaredInput || !section || !table || !btnAgregar) {
                    Swal.fire("Error", "Falta agregar algún id en index.html", "error");
                    return;
                }

                idInput.value = json.data.id_cut ?? "";
                initialInput.value = json.data.initial_cash ?? "";
                declaredInput.value = json.data.declared_cash ?? "";

                table.classList.add("hidden");
                btnAgregar.classList.add("hidden");

                if (navbar) {
                         navbar.classList.add("hidden");
                }

                section.classList.remove("hidden");
                section.scrollIntoView({ behavior: "smooth" });
                section.scrollIntoView({ behavior: "smooth" });
            } else {
                Swal.fire("Error", json.message || "No se pudo cargar el registro", "error");
            }
        })
        .catch(error => {
            console.error("Fallo al cargar:", error);
            Swal.fire("Error", "No se pudo cargar el registro", "error");
        });
}

function eliminar(id_cut) {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "No podrás revertir esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then(result => {
        if (result.isConfirmed) {
            deleteCashRegister(id_cut).then(json => {
                if (json.status === "success") {
                    Swal.fire("Eliminado", "El registro fue eliminado.", "success").then(() => {
                        loadCashRegisters();
                    });
                } else {
                    Swal.fire("Error", json.message || "No se pudo eliminar", "error");
                }
            });
        }
    });
}

function guardarEdicion() {
    const id_cut = document.getElementById("edit_id_cut").value;
    const initial_cash = document.getElementById("edit_initial_cash").value;
    const declared_cash = document.getElementById("edit_declared_cash").value;

    updateCashRegister({
        id_cut,
        initial_cash,
        declared_cash
    }).then(json => {
        if (json.status === "success") {
            Swal.fire("Listo", "Registro actualizado correctamente", "success");
            cerrarEdicion();
            loadCashRegisters();
        } else {
            Swal.fire("Error", json.message || "No se pudo actualizar", "error");
        }
    });
}

function cerrarEdicion() {

    document.getElementById("edit_id_cut").value = "";
    document.getElementById("edit_initial_cash").value = "";
    document.getElementById("edit_declared_cash").value = "";

    document.getElementById("editSection").classList.add("hidden");
    document.getElementById("tableSection").classList.remove("hidden");
    document.getElementById("btnAgregar").classList.remove("hidden");

    const navbar = document.getElementById("navbar-container");
    if (navbar) {
        navbar.classList.remove("hidden");
    }
}