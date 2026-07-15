import { peticionCust } from './cust_api.js';
import { alternarVistasCust } from './cust_ui.js';

export async function procesarGuardadoCust(form) {
    const datos = Object.fromEntries(new FormData(form));
    datos.action = datos.id_customer ? "update" : "insert"; 
    return await peticionCust(datos);
}

export async function procesarEdicionCust(id, form, tituloElemento, vistaFormulario, vistaTabla) {
    tituloElemento.textContent = "Editar Cliente #" + id;
    
    const json = await peticionCust({ action: "getById", id_customer: id });
    
    if (json.status === "success" && json.data) {
        form.elements['id_customer'].value = json.data.id_customer;
        form.elements['name'].value = json.data.name;
        form.elements['email'].value = json.data.email;
        form.elements['phone'].value = json.data.phone;
        
        alternarVistasCust(vistaFormulario, vistaTabla);
    }
}