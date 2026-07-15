import { peticionUsr } from './usr_api.js';
import { alternarVistasUsr, pintarTablaUsr } from './usr_ui.js';
import { cargarRolesUsr, procesarGuardadoUsr, procesarEdicionUsr } from './usr_form.js';

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevo = document.querySelector("#btnNuevo");
const btnVolver = document.querySelector("#btnVolver");
const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formUsers");

document.addEventListener("DOMContentLoaded", () => {
    if (tbody) cargarTabla();
    if (form) cargarRolesUsr(form);
});

async function cargarTabla() {
    const json = await peticionUsr({ action: "getAll" });
    if (json.status === "success") {
        pintarTablaUsr(tbody, json.data);
    }
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