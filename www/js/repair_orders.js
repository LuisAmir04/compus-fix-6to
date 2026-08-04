import { enviarPeticion } from './ro_api.js';
import { alternarVistas, pintarTabla, pintarPaginacion } from './ro_ui.js'; 
import { cargarCatalogos, procesarGuardado, cargarDatosOrden } from './ro_form.js'

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevaOrden = document.querySelector("#btnNuevaOrden");
const btnVolver = document.querySelector("#btnVolver");

const tbody = document.querySelector("#tbody");
const thead = document.querySelector("thead");
const form = document.querySelector("#formOrden");
const paginacionContainer = document.querySelector("#paginacion-container");
const inputBuscar = document.querySelector("#inputBuscar");
const btnBuscar = document.querySelector("#btnBuscar");

// Variables globales
let textoBusqueda = "";
let columnaActual = "id_order";
let direccion = "ASC";
let paginaActual = 1;
const limite = 50;

document.addEventListener("DOMContentLoaded", () => {
    if (tbody) cargarOrdenes();
    if (form) cargarCatalogos(form);
});

// Función que manda TODO a PHP
async function cargarOrdenes() {
    let offset = (paginaActual - 1) * limite;

    const json = await enviarPeticion({ 
        action: "getAll",
        ordenarPor: columnaActual,
        direccion: direccion,
        limite: limite,
        offset: offset,
        busqueda: textoBusqueda
    });
    
    if (json.status === "success") {
        pintarTabla(tbody, json.data);
        pintarPaginacion(paginacionContainer, json.total, limite, paginaActual, cambiarPagina);
    } else {
    console.error("Error al cargar órdenes:", json.message);
    alert(json.message);
}
}

// Función que ejecuta el paginador
function cambiarPagina(nuevaPagina) {
    paginaActual = nuevaPagina;
    cargarOrdenes();
}

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const respuesta = await procesarGuardado(form); 
        
        Swal.fire(respuesta.status === "success" ? "Éxito" : "Error", respuesta.message, respuesta.status);
        if (respuesta.status === "success") {
            cargarOrdenes(); 
            alternarVistas(vistaTabla, vistaFormulario); 
        }
    });
}

if (btnNuevaOrden) {
    btnNuevaOrden.addEventListener('click', () => {
        form.reset(); 
        document.querySelector("#id_order").value = "";
        document.querySelector("#tituloFormulario").textContent = "Nueva Orden de Reparación";
        alternarVistas(vistaFormulario, vistaTabla);
    });
}

if (btnVolver) {
    btnVolver.addEventListener('click', (e) => {
        e.preventDefault();
        alternarVistas(vistaTabla, vistaFormulario);
    });
}

if (tbody) {
    tbody.addEventListener('click', async function(evento) {
        if (evento.target && evento.target.matches('.btn-editar')) {
            const id = evento.target.getAttribute('data-id');
            document.querySelector("#tituloFormulario").textContent = "Editar Orden #" + id;
            await cargarDatosOrden(id, form);
            alternarVistas(vistaFormulario, vistaTabla);
        }

        if (evento.target && evento.target.matches('.btn-eliminar')) {
            const id = evento.target.getAttribute('data-id');
            
            Swal.fire({
                title: "¿Estás seguro de eliminar este registro?",
                text: "No vas a poder revertir esto!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const json = await enviarPeticion({ action: "delete_order", id_order: id });
                    
                    let response = { title: "Borrado", text: "Tu registro ha sido eliminado.", icon: "success" };
                    if (json.status === "error") {
                        response = { title: "Error", text: "No se pudo eliminar el registro.", icon: "error" };
                    }
                    
                    Swal.fire(response);
                    cargarOrdenes(); 
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
        cargarOrdenes(); // Llama a PHP con el nuevo orden
    });
}
// BUSCADOR
if (btnBuscar) {
    btnBuscar.addEventListener("click", () => {
        textoBusqueda = inputBuscar.value.trim();
        paginaActual = 1; 
        cargarOrdenes();
    });

    inputBuscar.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            btnBuscar.click();
        }
    });
}