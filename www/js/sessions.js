import { peticionSess } from './sess_api.js';
import { pintarTablaSess, pintarPaginacion } from './sess_ui.js';

const tbody = document.querySelector("#tbody");
const thead = document.querySelector("thead");
const paginacionContainer = document.querySelector("#paginacion-container");
const inputBuscar = document.querySelector("#inputBuscar");
const btnBuscar = document.querySelector("#btnBuscar");

let textoBusqueda = "";
let columnaActual = "id_session";
let direccion = "DESC"; // Para ver las sesiones más recientes primero
let paginaActual = 1;
const limite = 50;

document.addEventListener("DOMContentLoaded", () => {
    if (tbody) cargarTabla();
});

async function cargarTabla() {
    let offset = (paginaActual - 1) * limite;

    const json = await peticionSess({
        action: "getAll",
        ordenarPor: columnaActual,
        direccion: direccion,
        limite: limite,
        offset: offset,
        busqueda: textoBusqueda
    });

    if (json.status === "success") {
        pintarTablaSess(tbody, json.data);
        pintarPaginacion(paginacionContainer, json.total, limite, paginaActual, cambiarPagina);

        if (json.data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-gray-500">No se encontraron sesiones</td></tr>`;
        }
    } else {
        console.error("Error al cargar sesiones:", json.message);
        alert(json.message);
    }
}

function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    cargarTabla();
}

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

        document.querySelectorAll(".sortable .sort-icon").forEach(icon => {
            icon.textContent = "▴▾";
            icon.classList.remove("text-blue-600");
            icon.classList.add("text-gray-400");
        });

        const iconoActivo = th.querySelector(".sort-icon");
        iconoActivo.textContent = (direccion === "ASC") ? "▴" : "▾";
        iconoActivo.classList.remove("text-gray-400");
        iconoActivo.classList.add("text-blue-600");

        paginaActual = 1;
        cargarTabla();
    });
}

if (btnBuscar) {
    btnBuscar.addEventListener("click", () => {
        textoBusqueda = inputBuscar.value.trim();
        paginaActual = 1;
        cargarTabla();
    });

    inputBuscar.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            btnBuscar.click();
        }
    });
}