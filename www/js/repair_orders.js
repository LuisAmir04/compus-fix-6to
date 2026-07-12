import { enviarPeticion } from './ro_api.js';
import { alternarVistas, pintarTabla } from './ro_ui.js';
import { cargarCatalogos, procesarGuardado, cargarDatosOrden } from './ro_form.js';

const vistaTabla = document.querySelector("#vista-tabla");
const vistaFormulario = document.querySelector("#vista-formulario");
const btnNuevaOrden = document.querySelector("#btnNuevaOrden");
const btnVolver = document.querySelector("#btnVolver");

const tbody = document.querySelector("#tbody");
const form = document.querySelector("#formOrden");

document.addEventListener("DOMContentLoaded", () => {
    if (tbody) cargarOrdenes();
    if (form) cargarCatalogos(form);
});

async function cargarOrdenes() {
    const json = await enviarPeticion({ action: "getAll" });
    if (json.status === "success") {
        pintarTabla(tbody, json.data);
    }
}

if (form) {
    form.addEventListener("submit", async function(e) {
        e.preventDefault();
        
        const respuesta = await procesarGuardado(form); 
        
        alert(respuesta.message);
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