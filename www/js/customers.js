import { peticionCust } from './cust_api.js';
import { alternarVistasCust, pintarTablaCust } from './cust_ui.js';
import { procesarGuardadoCust, procesarEdicionCust } from './cust_form.js';

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevo = document.querySelector("#btnNuevo");
const btnVolver = document.querySelector("#btnVolver");
const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formCustomers");

document.addEventListener("DOMContentLoaded", () => {
    cargarTabla();
});

async function cargarTabla() {
    const json = await peticionCust({ action: "getAll" });
    if (json.status === "success") {
        pintarTablaCust(tbody, json.data);
    }
}

if (btnNuevo) {
    btnNuevo.addEventListener('click', () => {
        form.reset();
        document.querySelector("#id_customer").value = ""; 
        document.querySelector("#tituloFormulario").textContent = "Registro de Clientes";
        alternarVistasCust(vistaFormulario, vistaTabla);
    });
}

if (btnVolver) {
    btnVolver.addEventListener('click', () => {
        alternarVistasCust(vistaTabla, vistaFormulario);
    });
}

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        const respuesta = await procesarGuardadoCust(form);
        
        Swal.fire(respuesta.status === "success" ? "Éxito" : "Error", respuesta.message, respuesta.status);
        
        if (respuesta.status === "success") {
            cargarTabla();
            alternarVistasCust(vistaTabla, vistaFormulario);
        }
    });
}

if (tbody) {
    tbody.addEventListener('click', async function(evento) {
        
        if (evento.target && evento.target.matches('.btn-editar')) {
            const id = evento.target.getAttribute('data-id');
            const tituloFormulario = document.querySelector("#tituloFormulario");
            
            await procesarEdicionCust(id, form, tituloFormulario, vistaFormulario, vistaTabla);
        }

        if (evento.target && evento.target.matches('.btn-eliminar')) {
            const id = evento.target.getAttribute('data-id');
            
            Swal.fire({
                title: "¿Estás seguro?",
                text: "Este registro se eliminará permanentemente.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar"
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const respuesta = await peticionCust({ action: "delete", id_customer: id });
                    
                    Swal.fire(respuesta.status === "success" ? "Eliminado" : "Error", respuesta.message, respuesta.status);
                    if (respuesta.status === "success") cargarTabla();
                } 
            });
        }
    });
}