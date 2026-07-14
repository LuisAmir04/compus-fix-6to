import { peticionStat } from './stat_api.js';
import { alternarVistasStat, pintarTablaStat } from './stat_ui.js';
import { procesarGuardadoStat, procesarEdicionStat } from './stat_form.js';

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevo = document.querySelector("#btnNuevo");
const btnVolver = document.querySelector("#btnVolver");
const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formStatus");

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});

async function cargarTabla() {
    const json = await peticionStat({ action: "getAll" });
    if (json.status === "success") {
        pintarTablaStat(tbody, json.data);
    }
}

if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
        form.reset();
        document.querySelector("#id_status").value = ""; 
        document.querySelector("#tituloFormulario").textContent = "Registrar Nuevo Estatus";
        alternarVistasStat(vistaFormulario, vistaTabla);
    });
}

if (btnVolver) {
    btnVolver.addEventListener('click', (e) => {
        e.preventDefault();
        alternarVistasStat(vistaTabla, vistaFormulario);
    });
}

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const respuesta = await procesarGuardadoStat(form);
        
        Swal.fire(respuesta.status === "success" ? "Éxito" : "Error", respuesta.message, respuesta.status);
        
        if (respuesta.status === "success") {
            cargarTabla();
            alternarVistasStat(vistaTabla, vistaFormulario);
        }
    });
}

if (tbody) {
    tbody.addEventListener('click', async function(evento) {
        
        if (evento.target && evento.target.matches('.btn-editar')) {
            const id = evento.target.getAttribute('data-id');
            const tituloFormulario = document.querySelector("#tituloFormulario");
            
            await procesarEdicionStat(id, form, tituloFormulario, vistaFormulario, vistaTabla);
        }

        if (evento.target && evento.target.matches('.btn-eliminar')) {
            const id = evento.target.getAttribute('data-id');
            
            Swal.fire({
                title: "¿Eliminar este estatus?",
                text: "Si está en uso por alguna orden, no se podrá borrar.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const respuesta = await peticionStat({ action: "delete", id_status: id });
                    Swal.fire(respuesta.status === "success" ? "Borrado" : "Error", respuesta.message, respuesta.status);
                    cargarTabla();
                } 
            });
        }
    });
}