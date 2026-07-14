import { peticionStat } from './stat_api.js';
import { alternarVistasStat } from './stat_ui.js';

export async function procesarGuardadoStat(form) {
    const datos = Object.fromEntries(new FormData(form));
    datos.action = datos.id_status ? "update" : "insert"; 
    return await peticionStat(datos);
}

export async function procesarEdicionStat(id, form, tituloElemento, vistaFormulario, vistaTabla) {
    tituloElemento.textContent = "Editar Estatus #" + id;
    
    const json = await peticionStat({ action: "get_one", id_status: id });
    
    if (json.status === "success" && json.data) {
        form.elements['id_status'].value = json.data.id_status;
        form.elements['name'].value = json.data.name;
        
        alternarVistasStat(vistaFormulario, vistaTabla);
    }
}