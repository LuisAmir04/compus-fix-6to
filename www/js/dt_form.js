import { peticionDT } from './dt_api.js';
import { alternarVistasDT } from './dt_ui.js';

export async function procesarGuardadoDT(form) {
    const datos = Object.fromEntries(new FormData(form));
    datos.action = datos.id_device_type ? "update" : "insert"; 
    return await peticionDT(datos);
}

export async function procesarEdicionDT(id, form, tituloElemento, vistaFormulario, vistaTabla) {
    tituloElemento.textContent = "Editar Dispositivo #" + id; 
    const json = await peticionDT({ action: "get_one", id_device_type: id });
    if (json.status === "success" && json.data) {
        form.elements['id_device_type'].value = json.data.id_device_type;
        form.elements['name'].value = json.data.name;
        
        alternarVistasDT(vistaFormulario, vistaTabla);
    }
}