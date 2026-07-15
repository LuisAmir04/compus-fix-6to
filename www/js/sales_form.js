import { peticionSale } from './sales_api.js';
import { alternarVistasSale } from './sales_ui.js';

export async function cargarCatalogosSale() {
    const selectOrder = document.querySelector("#id_order");
    const selectUser = document.querySelector("#id_user");
    
    const json = await peticionSale({ action: "get_catalogs" });
    if (json.status === "success") {
        if (selectOrder) {
            selectOrder.innerHTML = '<option value="">-- Selecciona --</option>';
            json.data.orders.forEach(o => {
                selectOrder.innerHTML += `<option value="${o.id_order}">Orden #${o.id_order} - ${o.customer_name}</option>`;
            });
        }
        if (selectUser) {
            selectUser.innerHTML = '<option value="">-- Selecciona --</option>';
            json.data.users.forEach(u => {
                selectUser.innerHTML += `<option value="${u.id_user}">${u.username}</option>`;
            });
        }
    }
}

export async function procesarGuardadoSale(formulario) {
    const formData = new FormData(formulario);
    const datos = Object.fromEntries(formData.entries());
    
    // Si id_sale tiene contenido actualiza, si no inserta
    datos.action = datos.id_sale ? "update" : "insert";
    return await peticionSale(datos);
}

export async function procesarEdicionSale(id, formulario, titulo, vistaForm, vistaTabla) {
    const json = await peticionSale({ action: "getById", id_sale: id });
    if (json.status === "success") {
        const sale = json.data;
        formulario.querySelector("#id_sale").value = sale.id_sale;
        formulario.querySelector("#id_order").value = sale.id_order;
        formulario.querySelector("#id_user").value = sale.id_user;
        formulario.querySelector("#payment_method").value = sale.payment_method;
        formulario.querySelector("#total_paid").value = sale.total_paid;
        
        titulo.textContent = "Editar Venta #" + sale.id_sale;
        alternarVistasSale(vistaForm, vistaTabla);
    }
}