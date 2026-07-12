export function alternarVistas(vistaMostrar, vistaOcultar) {
    vistaMostrar.classList.remove('hidden');
    vistaOcultar.classList.add('hidden');
}

export function pintarTabla(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(order => {
        tbody.innerHTML += `
        <tr>
            <td>${order.id_order}</td>
            <td>${order.customer_name}</td>
            <td>${order.device_type}</td>
            <td>${order.service_type}</td>
            <td>${order.technician_name}</td>
            <td>${order.brand_model}</td>
            <td>${order.reported_fault}</td>
            <td>${order.technical_diagnosis}</td>
            <td>${order.final_price}</td>
            <td>${order.current_status}</td>
            <td>${order.created_at}</td>
            <td>
                <button data-id="${order.id_order}" class="btn btn-sm btn-warning btn-editar">Editar</button>
                <button data-id="${order.id_order}" class="btn btn-sm btn-error btn-eliminar">Eliminar</button>
            </td>
        </tr>`;
    });
}