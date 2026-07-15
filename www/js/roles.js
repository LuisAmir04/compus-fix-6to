import { peticionRol } from './rol_api.js';
import { alternarVistasRol, pintarTablaRol } from './rol_ui.js';
import { procesarGuardadoRol, procesarEdicionRol } from './rol_form.js';

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevo = document.querySelector("#btnNuevo");
const btnVolver = document.querySelector("#btnVolver");
const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formRol");

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});

async function cargarTabla() {
    const json = await peticionRol({ action: "getAll" });
    if (json.status === "success") {
        pintarTablaRol(tbody, json.data);
    } else {
        pintarTablaRol(tbody, []);
    }
}

if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
        form.reset();
        document.querySelector("#id_role").value = ""; 
        document.querySelector("#tituloFormulario").textContent = "Registrar Nuevo Rol";
        vistaFormulario.classList.remove('hidden');
    });
}

if (btnVolver) {
    btnVolver.addEventListener('click', () => {
        vistaFormulario.classList.add('hidden');
    });
}

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const respuesta = await procesarGuardadoRol(form);
        
        Swal.fire(respuesta.status === "success" ? "Éxito" : "Error", respuesta.message, respuesta.status);
        
        if (respuesta.status === "success") {
            cargarTabla();
            vistaFormulario.classList.add('hidden');
        }
    });
}

if (tbody) {
    tbody.addEventListener('click', async function(evento) {
        
        if (evento.target && evento.target.matches('.btn-editar')) {
            const id = evento.target.getAttribute('data-id');
            const tituloFormulario = document.querySelector("#tituloFormulario");
            
            await procesarEdicionRol(id, form, tituloFormulario, vistaFormulario, vistaTabla);
        }

        if (evento.target && evento.target.matches('.btn-eliminar')) {
            const id = evento.target.getAttribute('data-id');
            
            Swal.fire({
                title: "¿Eliminar este rol?",
                text: "No se podrá borrar si hay usuarios que tengan este rol asignado.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const respuesta = await peticionRol({ action: "delete", id_role: id });
                    Swal.fire(respuesta.status === "success" ? "Borrado" : "Error", respuesta.message, respuesta.status);
                    
                    if (respuesta.status === "success") cargarTabla();
                } 
            });
        }
    });
}