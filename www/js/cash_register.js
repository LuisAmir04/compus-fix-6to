import { peticionCaja } from './cr_api.js';
import { alternarVistas, pintarTablaCaja, pintarPaginacion } from './cr_ui.js';

// DOM Elements
const tbody = document.getElementById("tbody");
const thead = document.querySelector("thead");
const paginacionContainer = document.getElementById("paginacion-container");

const tableSection = document.getElementById("tableSection");
const addSection = document.getElementById("addSection");
const editSection = document.getElementById("editSection");
const navbar = document.getElementById("navbar-container");

const btnAgregar = document.getElementById("btnAgregar");
const btnCancelarAgregar = document.getElementById("btnCancelarAgregar");
const btnGuardar = document.getElementById("btnGuardar");
const btnActualizar = document.getElementById("btnActualizar");
const btnCancelar = document.getElementById("btnCancelar");

// Variables globales
let columnaActual = "id_cut";
let direccion = "ASC";
let paginaActual = 1;
const limite = 50;

document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();
    cargarCortes();
});

// 1. CARGA Y PAGINACIÓN
async function cargarCortes() {
    let offset = (paginaActual - 1) * limite;

    const json = await peticionCaja({ 
        action: "getAll",
        ordenarPor: columnaActual,
        direccion: direccion,
        limite: limite,
        offset: offset
    });

    if (json.status === "success") {
        pintarTablaCaja(tbody, json.data);
        pintarPaginacion(paginacionContainer, json.total, limite, paginaActual, (nuevaPagina) => {
            paginaActual = nuevaPagina;
            cargarCortes();
        });
    } else {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4">${json.message}</td></tr>`;
    }
}
// 2. ORDENAMIENTO POR SQL
if (thead) {
    thead.addEventListener("click", (evento) => {
        const th = evento.target.closest(".sortable");
        if (!th) return; 

        const columna = th.getAttribute("data-sort");
        
        if (columna === columnaActual) {
            direccion = (direccion === "ASC") ? "DESC" : "ASC";
        } else {
            direccion = "ASC"; 
            columnaActual = columna; 
        }

        // Actualizar iconos
        document.querySelectorAll(".sortable .sort-icon").forEach(icon => {
            icon.textContent = "▴▾";
            icon.classList.remove("text-blue-600");
            icon.classList.add("text-gray-400");
        });

        const iconoActivo = th.querySelector(".sort-icon");
        iconoActivo.textContent = (direccion === "ASC") ? "▴" : "▾";
        iconoActivo.classList.remove("text-gray-400");
        iconoActivo.classList.add("text-blue-600");

        paginaActual = 1; // Volver a la pagina 1
        cargarCortes(); // Pedirle a PHP los datos ordenados
    });
}
// 3. LÓGICA DE CATÁLOGOS Y GUARDADO
async function cargarUsuarios() {
    const json = await peticionCaja({ action: "getUsers" });
    if (json.status === "success") {
        const select = document.getElementById("id_user");
        json.data.forEach(user => {
            select.innerHTML += `<option value="${user.id_user}">${user.username}</option>`;
        });
    }
}

// Botones de navegación
if (btnAgregar) {
    btnAgregar.addEventListener("click", () => {
        alternarVistas(addSection, [tableSection, editSection]);
        btnAgregar.classList.add("hidden");
    });
}

if (btnCancelarAgregar) {
    btnCancelarAgregar.addEventListener("click", () => {
        document.getElementById("id_user").value = "";
        document.getElementById("initial_cash").value = "";
        alternarVistas(tableSection, [addSection, editSection]);
        btnAgregar.classList.remove("hidden");
    });
}

// Guardar nuevo
if (btnGuardar) {
    btnGuardar.addEventListener("click", async () => {
        const id_user = document.getElementById("id_user").value;
        const initial_cash = document.getElementById("initial_cash").value;

        if (!id_user || !initial_cash) {
            Swal.fire("Error", "Completa todos los campos", "error");
            return;
        }

        const json = await peticionCaja({ action: "open_shift", id_user: id_user, initial_cash: initial_cash });
        if (json.status === "success") {
            Swal.fire("Éxito", json.message, "success");
            btnCancelarAgregar.click();
            cargarCortes();
        } else {
            Swal.fire("Error", json.message, "error");
        }
    });
}

// 4. LÓGICA DE EDICIÓN Y ELIMINACIÓN
if (tbody) {
    tbody.addEventListener("click", async (event) => {
        const editButton = event.target.closest(".btn-editar");
        const deleteButton = event.target.closest(".btn-eliminar");

        if (editButton && editButton.dataset.id) {
            const id = editButton.dataset.id;
            const json = await peticionCaja({ action: "getOne", id_cut: id });
            
            if (json.status === "success" && json.data) {
                document.getElementById("edit_id_cut").value = json.data.id_cut ?? "";
                document.getElementById("edit_initial_cash").value = json.data.initial_cash ?? "";
                document.getElementById("edit_declared_cash").value = json.data.declared_cash ?? "";
                
                alternarVistas(editSection, [tableSection, addSection]);
                btnAgregar.classList.add("hidden");
            }
        }

        if (deleteButton && deleteButton.dataset.id) {
            const id = deleteButton.dataset.id;
            
            Swal.fire({
                title: "¿Estás seguro?",
                text: "No podrás revertir esta acción.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                confirmButtonText: "Sí, eliminar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const json = await peticionCaja({ action: "delete", id_cut: id });
                    Swal.fire(json.status === "success" ? "Eliminado" : "Error", json.message, json.status);
                    if (json.status === "success") cargarCortes();
                }
            });
        }
    });
}

if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
        alternarVistas(tableSection, [editSection, addSection]);
        btnAgregar.classList.remove("hidden");
    });
}

if (btnActualizar) {
    btnActualizar.addEventListener("click", async () => {
        const id_cut = document.getElementById("edit_id_cut").value;
        const initial_cash = document.getElementById("edit_initial_cash").value;
        const declared_cash = document.getElementById("edit_declared_cash").value;

        const json = await peticionCaja({ action: "update", id_cut, initial_cash, declared_cash });
        
        if (json.status === "success") {
            Swal.fire("Listo", json.message, "success");
            btnCancelar.click(); // Vuelve a la tabla
            cargarCortes();
        } else {
            Swal.fire("Error", json.message, "error");
        }
    });
}