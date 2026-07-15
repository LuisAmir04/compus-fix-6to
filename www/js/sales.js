import { peticionSal } from './sal_api.js';
import { alternarVistasSal, pintarTablaSal } from './sal_ui.js';
import { cargarCatalogosSal, procesarGuardadoSal, procesarEdicionSal } from './sal_form.js';

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevo = document.querySelector("#btnNuevo");
const btnVolver = document.querySelector("#btnVolver");
const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formNuevaVenta");

document.addEventListener("DOMContentLoaded", () => {
    if (tbody) cargarTabla();
    if (form) cargarCatalogosSal(form);
});

async function cargarTabla() {
    const json = await peticionSal({ action: "getAll" });
    if (json.status === "success") {
        pintarTablaSal(tbody, json.data);
    }
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