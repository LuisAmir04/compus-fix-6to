import { enviarPeticion } from './ro_api.js';

function llenarSelect(formulario, name, items, valueField, textField) {
    const select = formulario.elements[name];
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Selecciona --</option>';
    items.forEach(item => {
        select.innerHTML += `<option value="${item[valueField]}">${item[textField]}</option>`;
    });
}

export async function cargarCatalogos(form) {
    const json = await enviarPeticion({ action: "get_catalogs" });
    if (json.status === "success") {
        llenarSelect(form, "id_customer", json.data.customers, "id_customer", "name");
        llenarSelect(form, "id_device_type", json.data.device_types, "id_device_type", "name");
        llenarSelect(form, "id_service_type", json.data.service_types, "id_service_type", "name");
        llenarSelect(form, "id_status", json.data.statuses, "id_status", "name");
        llenarSelect(form, "id_user", json.data.users, "id_user", "username");
    }
}

export async function cargarDatosOrden(id_order, form) {
    const json = await enviarPeticion({ action: "get_order", id_order: id_order });
    if (json.status === "success" && json.data) {
        form.elements['id_order'].value = json.data.id_order;
        for (const campo in json.data) {
            if (form.elements[campo]) {
                form.elements[campo].value = json.data[campo];
            }
        }
    }
}

export async function procesarGuardado(form) {
    const datos = Object.fromEntries(new FormData(form));
    datos.action = datos.id_order ? "update_order" : "insert_order"; 
    
    return await enviarPeticion(datos);
}