export function alternarVistasSale(mostrar, ocultar) {
    mostrar.classList.remove('hidden');
    ocultar.classList.add('hidden');
}

export function pintarTablaSale(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(sale => {
        tbody.innerHTML += `
            <tr class="border-b">
                <td class="font-bold text-sm text-gray-700">#${sale.id_sale}</td>
                <td class="text-gray-700">Orden #${sale.id_order}</td>
                <td class="text-gray-700"> ${sale.cashier_name}</td>
                <td class="text-gray-700">${sale.payment_method}</td>
                <td class="text-gray-700">$${parseFloat(sale.total_paid).toFixed(2)}</td>
                <td class="text-gray-700">${sale.sale_date}</td>
                <td>
                    <button class="btn btn-sm btn-info btn-editar text-white mr-2" data-id="${sale.id_sale}">Editar</button>
                    <button class="btn btn-sm btn-error btn-eliminar text-white" data-id="${sale.id_sale}">Eliminar</button>
                </td>
            </tr>
        `;
    });
}