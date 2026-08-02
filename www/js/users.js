import { peticionUsr } from './usr_api.js';
import { alternarVistasUsr, pintarTablaUsr, pintarPaginacion } from './usr_ui.js'; 
import { cargarRolesUsr, procesarGuardadoUsr, procesarEdicionUsr } from './usr_form.js';

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevo = document.querySelector("#btnNuevo");
const btnVolver = document.querySelector("#btnVolver");
const tbody = document.querySelector("#tbody");
const thead = document.querySelector("thead");
const form = document.querySelector("#formUsers");
const paginacionContainer = document.querySelector("#paginacion-container");

// Variables globales
let columnaActual = "id_user";
let direccion = "ASC";
let paginaActual = 1;
const limite = 50; 

document.addEventListener("DOMContentLoaded", () => {
    if (tbody) cargarTabla();
    if (form) cargarRolesUsr(form);
});

// Función que manda TODO a PHP
async function cargarTabla() {
    let offset = (paginaActual - 1) * limite;

    const json = await peticionUsr({ 
        action: "getAll",
        ordenarPor: columnaActual,
        direccion: direccion,
        limite: limite,
        offset: offset
    });

    if (json.status === "success") {
        pintarTablaUsr(tbody, json.data);
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
        document.querySelector("#id_user").value = ""; 
        document.querySelector("#password").required = true;
        document.querySelector("#tituloFormulario").textContent = "Insertar usuario";
        alternarVistasUsr(vistaFormulario, vistaTabla);
    });
}

if (btnVolver) {
    btnVolver.addEventListener('click', () => {
        alternarVistasUsr(vistaTabla, vistaFormulario);
    });
}

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const respuesta = await procesarGuardadoUsr(form);
        
        Swal.fire(respuesta.status === "success" ? "Éxito" : "Error", respuesta.message || "Ocurrió un error", respuesta.status);
        
        if (respuesta.status === "success") {
            cargarTabla(); 
            alternarVistasUsr(vistaTabla, vistaFormulario);
        }
    });
}

if (tbody) {
    tbody.addEventListener('click', async function(evento) {
        
        if (evento.target && evento.target.matches('.btn-editar')) {
            const id = evento.target.getAttribute('data-id');
            const tituloFormulario = document.querySelector("#tituloFormulario");
            
            await procesarEdicionUsr(id, form, tituloFormulario, vistaFormulario, vistaTabla);
        }

        if (evento.target && evento.target.matches('.btn-eliminar')) {
            const id = evento.target.getAttribute('data-id');
            
            Swal.fire({
                title: "¿Deseas eliminarlo?",
                text: "Esta acción no se puede deshacer.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const respuesta = await peticionUsr({ action: "delete", id_user: id });
                    Swal.fire(respuesta.status === "success" ? "Eliminado" : "Error", respuesta.message, respuesta.status);
                    
                    if (respuesta.status === "success") {
                        cargarTabla();
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

        // Actualizar visualmente los íconos
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
        cargarTabla(); // Hacemos la consulta SQL nuevamente
    });
}