import {
    getCashRegisters,
    getCashRegisterById,
    updateCashRegister,
    deleteCashRegister
} from "./api_cash_register.js?v=4";

document.addEventListener("DOMContentLoaded", () => {
    const tbody = document.getElementById("tbody");
    const btnAgregar = document.getElementById("btnAgregar");
    const btnCancelarAgregar = document.getElementById("btnCancelarAgregar");
    const btnActualizar = document.getElementById("btnActualizar");
    const btnCancelar = document.getElementById("btnCancelar");
    const tableSection = document.getElementById("tableSection");
    const addSection = document.getElementById("addSection");
    const editSection = document.getElementById("editSection");
    const navbar = document.getElementById("navbar-container");

    loadCashRegisters();

    if (tbody) {
        tbody.addEventListener("click", (event) => {
            const editButton = event.target.closest(".btn-editar");
            const deleteButton = event.target.closest(".btn-eliminar");

            if (editButton && editButton.dataset.id) {
                editar(editButton.dataset.id);
            }

            if (deleteButton && deleteButton.dataset.id) {
                eliminar(deleteButton.dataset.id);
            }
        });
    }

    if (btnAgregar) {
        btnAgregar.addEventListener("click", () => {
            if (tableSection) tableSection.classList.add("hidden");
            if (editSection) editSection.classList.add("hidden");
            if (navbar) navbar.classList.add("hidden");
            btnAgregar.classList.add("hidden");

            if (addSection) {
                addSection.classList.remove("hidden");
                addSection.scrollIntoView({ behavior: "smooth" });
            }
        });
    }

    if (btnCancelarAgregar) {
        btnCancelarAgregar.addEventListener("click", () => {
            resetAddForm();

            if (addSection) addSection.classList.add("hidden");
            if (tableSection) tableSection.classList.remove("hidden");
            if (navbar) navbar.classList.remove("hidden");
            if (btnAgregar) btnAgregar.classList.remove("hidden");
        });
    }

    if (btnActualizar) {
        btnActualizar.addEventListener("click", guardarEdicion);
    }

    if (btnCancelar) {
        btnCancelar.addEventListener("click", cerrarEdicion);
    }
});

function loadCashRegisters() {
    getCashRegisters()
        .then(json => {
            if (json.status === "success") {
                const tbody = document.getElementById("tbody");
                if (!tbody) return;

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
                                    <button class="btn btn-sm btn-warning btn-editar" data-id="${order.id_cut}">
                                        ✏️ Editar
                                    </button>
                                    <button class="btn btn-sm btn-error btn-eliminar" data-id="${order.id_cut}">
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `;
                });
            } else {
                console.error(json.message || "No se pudo cargar la tabla");
            }
        })
        .catch(error => {
            console.error("Error al cargar registros:", error);
        });
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
                const addSection = document.getElementById("addSection");

                if (
                    !idInput ||
                    !initialInput ||
                    !declaredInput ||
                    !section ||
                    !table ||
                    !btnAgregar ||
                    !navbar
                ) {
                    Swal.fire("Error", "Falta agregar algún id en index.html", "error");
                    return;
                }

                idInput.value = json.data.id_cut ?? "";
                initialInput.value = json.data.initial_cash ?? "";
                declaredInput.value = json.data.declared_cash ?? "";

                if (addSection) addSection.classList.add("hidden");
                table.classList.add("hidden");
                btnAgregar.classList.add("hidden");
                navbar.classList.add("hidden");

                section.classList.remove("hidden");
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
            deleteCashRegister(id_cut)
                .then(json => {
                    if (json.status === "success") {
                        Swal.fire("Eliminado", "El registro fue eliminado.", "success").then(() => {
                            loadCashRegisters();
                        });
                    } else {
                        Swal.fire("Error", json.message || "No se pudo eliminar", "error");
                    }
                })
                .catch(error => {
                    console.error("Error al eliminar:", error);
                    Swal.fire("Error", "No se pudo eliminar", "error");
                });
        }
    });
}

function guardarEdicion() {
    const id_cut = document.getElementById("edit_id_cut")?.value || "";
    const initial_cash = document.getElementById("edit_initial_cash")?.value || "";
    const declared_cash = document.getElementById("edit_declared_cash")?.value || "";

    if (!id_cut) {
        Swal.fire("Error", "No se encontró el ID del corte.", "error");
        return;
    }

    updateCashRegister({
        id_cut,
        initial_cash,
        declared_cash
    })
        .then(json => {
            if (json.status === "success") {
                Swal.fire("Listo", "Registro actualizado correctamente", "success").then(() => {
                    cerrarEdicion();
                    loadCashRegisters();
                });
            } else {
                Swal.fire("Error", json.message || "No se pudo actualizar", "error");
            }
        })
        .catch(error => {
            console.error("Error al actualizar:", error);
            Swal.fire("Error", "No se pudo actualizar", "error");
        });
}

function cerrarEdicion() {
    const idInput = document.getElementById("edit_id_cut");
    const initialInput = document.getElementById("edit_initial_cash");
    const declaredInput = document.getElementById("edit_declared_cash");
    const section = document.getElementById("editSection");
    const table = document.getElementById("tableSection");
    const btnAgregar = document.getElementById("btnAgregar");
    const navbar = document.getElementById("navbar-container");

    if (idInput) idInput.value = "";
    if (initialInput) initialInput.value = "";
    if (declaredInput) declaredInput.value = "";

    if (section) section.classList.add("hidden");
    if (table) table.classList.remove("hidden");
    if (btnAgregar) btnAgregar.classList.remove("hidden");
    if (navbar) navbar.classList.remove("hidden");
}

function resetAddForm() {
    const userSelect = document.getElementById("id_user");
    const initialCash = document.getElementById("initial_cash");

    if (userSelect) userSelect.value = "";
    if (initialCash) initialCash.value = "";
}