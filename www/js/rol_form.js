import { peticionRol } from './rol_api.js';
import { alternarVistasRol } from './rol_ui.js';

export async function procesarGuardadoRol(form) {
    const datos = Object.fromEntries(new FormData(form));
    datos.action = datos.id_role ? "update" : "insert"; 
    return await peticionRol(datos);
}

export async function procesarEdicionRol(id, form, tituloElemento, vistaFormulario, vistaTabla) {
    tituloElemento.textContent = "Editar Rol #" + id;
    
    const json = await peticionRol({ action: "get_one", id_role: id });
    
    if (json.status === "success" && json.data) {
        form.elements['id_role'].value = json.data.id_role;
        form.elements['name'].value = json.data.name;
        
        vistaFormulario.classList.remove('hidden'); 
    }
}