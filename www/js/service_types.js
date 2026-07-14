import { peticionST } from './st_api.js';
import { alternarVistasST, pintarTablaST } from './st_ui.js';
import { procesarGuardadoST, procesarEdicionST } from './st_form.js';

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevo = document.querySelector("#btnNuevo");
const btnVolver = document.querySelector("#btnVolver");
const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formServiceType");

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});

async function cargarTabla() {
    const json = await peticionST({ action: "getAll" });
    if (json.status === "success") {
        pintarTablaST(tbody, json.data);
    }
}

if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
        form.reset();
        document.querySelector("#id_service_type").value = ""; 
        document.querySelector("#tituloFormulario").textContent = "Registrar tipo de servicio";
        alternarVistasST(vistaFormulario, vistaTabla);
    });
}

if (btnVolver) {
    btnVolver.addEventListener('click', (e) => {
        e.preventDefault();
        alternarVistasST(vistaTabla, vistaFormulario);
    });
}

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const respuesta = await procesarGuardadoST(form);
        
        Swal.fire(respuesta.status === "success" ? "Éxito" : "Error", respuesta.message, respuesta.status);
        
        if (respuesta.status === "success") {
            cargarTabla();
            alternarVistasST(vistaTabla, vistaFormulario);
        }
    });
}

if (tbody) {
    tbody.addEventListener('click', async function(evento) {
        
        if (evento.target && evento.target.matches('.btn-editar')) {
            const id = evento.target.getAttribute('data-id');
            const tituloFormulario = document.querySelector("#tituloFormulario");
            
            await procesarEdicionST(id, form, tituloFormulario, vistaFormulario, vistaTabla);
        }

        if (evento.target && evento.target.matches('.btn-eliminar')) {
            const id = evento.target.getAttribute('data-id');
            
            Swal.fire({
                title: "¿Eliminar este servicio?",
                text: "Si está en uso por alguna orden, no se podrá borrar.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const respuesta = await peticionST({ action: "delete", id_service_type: id });
                    Swal.fire(respuesta.status === "success" ? "Borrado" : "Error", respuesta.message, respuesta.status);
                    cargarTabla();
                } 
            });
        }
    });
}