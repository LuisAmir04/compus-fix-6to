import { peticionSal } from './sal_api.js';
import { alternarVistasSal, pintarTablaSal, pintarPaginacion } from './sal_ui.js'; 
import { cargarCatalogosSal, procesarGuardadoSal, procesarEdicionSal } from './sal_form.js';

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevo = document.querySelector("#btnNuevo");
const btnVolver = document.querySelector("#btnVolver");
const tbody = document.querySelector("#tbody");
const thead = document.querySelector("thead");
const form = document.querySelector("#formNuevaVenta");
const paginacionContainer = document.querySelector("#paginacion-container");
const inputBuscar = document.querySelector("#inputBuscar");
const btnBuscar = document.querySelector("#btnBuscar");
// Variables globales
let textoBusqueda = "";
let columnaActual = "id_sale";
let direccion = "ASC";
let paginaActual = 1;
const limite = 50;

document.addEventListener("DOMContentLoaded", () => {
    if (tbody) cargarTabla();
    if (form) cargarCatalogosSal(form);
});

// Función que manda TODO a PHP
async function cargarTabla() {
    let offset = (paginaActual - 1) * limite;

    const json = await peticionSal({ 
        action: "getAll",
        ordenarPor: columnaActual,
        direccion: direccion,
        limite: limite,
        offset: offset,
        busqueda: textoBusqueda
    });

    if (json.status === "success") {
        pintarTablaSal(tbody, json.data);
        pintarPaginacion(paginacionContainer, json.total, limite, paginaActual, cambiarPagina);
    }
}

// Función que ejecuta el paginador
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    cargarTabla();
}

if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
        form.reset();
        document.querySelector("#id_sale").value = ""; 
        document.querySelector("#tituloFormulario").textContent = "Registrar Nueva Venta";
        alternarVistasSal(vistaFormulario, vistaTabla);
    });
}

if (btnVolver) {
    btnVolver.addEventListener('click', () => {
        alternarVistasSal(vistaTabla, vistaFormulario);
    });
}

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const respuesta = await procesarGuardadoSal(form);
        
        if (respuesta.status === "success") {
            Swal.fire("Éxito", respuesta.message, "success");
            cargarTabla();
            alternarVistasSal(vistaTabla, vistaFormulario);
        } else {
            Swal.fire("Error", respuesta.message, "error");
        }
    });
}

if (tbody) {
    tbody.addEventListener('click', async function(evento) {
        
        if (evento.target && evento.target.matches('.btn-editar')) {
            const id = evento.target.getAttribute('data-id');
            const tituloFormulario = document.querySelector("#tituloFormulario");
            
            await procesarEdicionSal(id, form, tituloFormulario, vistaFormulario, vistaTabla);
        }

        if (evento.target && evento.target.matches('.btn-eliminar')) {
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
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const json = await peticionSal({ action: "delete", id_sale: id });
                    
                    if (json.status === "success") {
                        Swal.fire("Borrado", json.message, "success");
                        cargarTabla();
                    } else {
                        Swal.fire("Error", json.message, "error");
                    }
                } 
            });
        }
    });
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

        // Actualiza iconografía visual
        document.querySelectorAll(".sortable .sort-icon").forEach(icon => {
            icon.textContent = "▴▾";
            icon.classList.remove("text-blue-600");
            icon.classList.add("text-gray-400");
        });

        const iconoActivo = th.querySelector(".sort-icon");
        iconoActivo.textContent = (direccion === "ASC") ? "▴" : "▾";
        iconoActivo.classList.remove("text-gray-400");
        iconoActivo.classList.add("text-blue-600");
        
        paginaActual = 1; // Resetea la paginación a 1
        cargarTabla();
    });
}

// BUSCADOR CON SQL
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