import { peticionSal } from './sal_api.js';
import { alternarVistasSal } from './sal_ui.js';

export async function cargarCatalogosSal(form) {
    const json = await peticionSal({ action: "get_catalogs" });
    if (json.status === "success") {
        const selectOrder = form.elements['id_order'];
        const selectUser = form.elements['id_user'];
        
        selectOrder.innerHTML = '<option value="">-- Selecciona --</option>';
        json.data.orders.forEach(o => {
            selectOrder.innerHTML += `<option value="${o.id_order}">Orden #${o.id_order} - ${o.customer_name}</option>`;
        });

        selectUser.innerHTML = '<option value="">-- Selecciona --</option>';
        json.data.users.forEach(u => {
            selectUser.innerHTML += `<option value="${u.id_user}">${u.username}</option>`;
        });
    }
}

export async function procesarGuardadoSal(form) {
    const datos = Object.fromEntries(new FormData(form));
    datos.action = datos.id_sale ? "update" : "insert"; 
    return await peticionSal(datos);
}

export async function procesarEdicionSal(id, form, tituloElemento, vistaFormulario, vistaTabla) {
    tituloElemento.textContent = "Editar Venta #" + id;
    
    const json = await peticionSal({ action: "get_one", id_sale: id });
    
    if (json.status === "success" && json.data) {
        form.elements['id_sale'].value = json.data.id_sale;
        form.elements['id_order'].value = json.data.id_order;
        form.elements['id_user'].value = json.data.id_user;
        form.elements['payment_method'].value = json.data.payment_method;
        form.elements['total_paid'].value = json.data.total_paid;
        
        alternarVistasSal(vistaFormulario, vistaTabla);
    }
}