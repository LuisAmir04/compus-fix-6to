import { peticionDT } from './dt_api.js';
import { alternarVistasDT, pintarTablaDT } from './dt_ui.js';
import { procesarGuardadoDT, procesarEdicionDT } from './dt_form.js';

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevo = document.querySelector("#btnNuevo");
const btnVolver = document.querySelector("#btnVolver");
const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formDeviceType");

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});

async function cargarTabla() {
    const json = await peticionDT({ action: "getAll" });
    if (json.status === "success") {
        pintarTablaDT(tbody, json.data);
    }
}

if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
        form.reset();
        document.querySelector("#id_device_type").value = ""; 
        document.querySelector("#tituloFormulario").textContent = "Registrar tipo de dispositivo";
        alternarVistasDT(vistaFormulario, vistaTabla);
    });
}

if (btnVolver) {
    btnVolver.addEventListener('click', (e) => {
        e.preventDefault();
        alternarVistasDT(vistaTabla, vistaFormulario);
    });
}

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const respuesta = await procesarGuardadoDT(form);
        
        Swal.fire(respuesta.status === "success" ? "Éxito" : "Error", respuesta.message, respuesta.status);
        
        if (respuesta.status === "success") {
            cargarTabla();
            alternarVistasDT(vistaTabla, vistaFormulario);
        }
    });
}

if (tbody) {
    tbody.addEventListener('click', async function(evento) {
        
        if (evento.target && evento.target.matches('.btn-editar')) {
            const id = evento.target.getAttribute('data-id');
            const tituloFormulario = document.querySelector("#tituloFormulario");
            
            await procesarEdicionDT(id, form, tituloFormulario, vistaFormulario, vistaTabla);
        }

        if (evento.target && evento.target.matches('.btn-eliminar')) {
            const id = evento.target.getAttribute('data-id');
            
            Swal.fire({
                title: "¿Eliminar este dispositivo?",
                text: "Si está en uso por alguna orden, no se podrá borrar.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Confirmar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const respuesta = await peticionDT({ action: "delete", id_device_type: id });
                    Swal.fire(respuesta.status === "success" ? "Borrado" : "Error", respuesta.message, respuesta.status);
                    cargarTabla();
                } 
            });
        }
    });
}