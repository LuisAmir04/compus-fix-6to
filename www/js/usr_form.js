import { peticionUsr } from './usr_api.js';
import { alternarVistasUsr } from './usr_ui.js';

export async function cargarRolesUsr(form) {
    const json = await peticionUsr({ action: "get_roles" });
    if (json.status === "success") {
        const select = form.elements['id_role'];
        select.innerHTML = '<option value="">-- Selecciona --</option>';
        json.data.forEach(rol => {
            select.innerHTML += `<option value="${rol.id_role}">${rol.name}</option>`;
        });
    }
}

export async function procesarGuardadoUsr(form) {
    const datos = Object.fromEntries(new FormData(form));
    datos.action = datos.id_user ? "update" : "insert"; 
    return await peticionUsr(datos);
}

export async function procesarEdicionUsr(id, form, tituloElemento, vistaFormulario, vistaTabla) {
    tituloElemento.textContent = "Editar Usuario #" + id;
    form.elements['password'].required = false;
    
    const json = await peticionUsr({ action: "getById", id_user: id });
    
    if (json.status === "success" && json.data) {
        form.elements['id_user'].value = json.data.id_user;
        form.elements['username'].value = json.data.username;
        form.elements['id_role'].value = json.data.id_role;
        form.elements['password'].value = "";
        
        alternarVistasUsr(vistaFormulario, vistaTabla);
    }
}