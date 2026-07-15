export function alternarVistasSal(vistaMostrar, vistaOcultar) {
    vistaMostrar.classList.remove('hidden');
    vistaOcultar.classList.add('hidden');
}

export function pintarTablaSal(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(sale => {
        tbody.innerHTML += `
        <tr class="border-b">
            <td class="px-6 py-4 font-bold text-sm text-gray-700">#${sale.id_sale}</td>
            <td class="px-6 py-4 text-sm text-gray-700">Orden #${sale.id_order}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${sale.cashier_name}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${sale.payment_method}</td>
            <td class="px-6 py-4 text-sm text-gray-700">$${sale.total_paid}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${sale.sale_date}</td>
            <td class="px-6 py-4 text-sm">
                <button data-id="${sale.id_sale}" class="btn-editar text-blue-600 mr-2 hover:underline">editar</button> | 
                <button data-id="${sale.id_sale}" class="btn-eliminar text-red-600 ml-2 hover:underline">eliminar</button>
            </td>
        </tr>`;
    });
}