import { peticionST } from './st_api.js';
import { alternarVistasST } from './st_ui.js';

export async function procesarGuardadoST(form) {
    const datos = Object.fromEntries(new FormData(form));
    datos.action = datos.id_service_type ? "update" : "insert"; 
    return await peticionST(datos);
}

export async function procesarEdicionST(id, form, tituloElemento, vistaFormulario, vistaTabla) {
    tituloElemento.textContent = "Editar Servicio #" + id;
    
    const json = await peticionST({ action: "get_one", id_service_type: id });
    
    if (json.status === "success" && json.data) {
        form.elements['id_service_type'].value = json.data.id_service_type;
        form.elements['name'].value = json.data.name;
        
        alternarVistasST(vistaFormulario, vistaTabla);
    }
}