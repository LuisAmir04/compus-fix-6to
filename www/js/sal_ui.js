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
            <td class="px-6 py-4 text-sm text-gray-700 font-medium">Orden #${sale.id_order} <br> <span class="text-xs text-gray-500 font-normal">${sale.brand_model}</span></td>
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

export function ordenarDatosTabla(datos, columna, ascendente) {
    return datos.sort((a, b) => {
        let valA = a[columna] !== null ? a[columna] : '';
        let valB = b[columna] !== null ? b[columna] : '';

        if (!isNaN(valA) && !isNaN(valB) && valA !== '' && valB !== '') {
            return ascendente ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
        }

        valA = valA.toString().toLowerCase();
        valB = valB.toString().toLowerCase();

        if (valA < valB) return ascendente ? -1 : 1;
        if (valA > valB) return ascendente ? 1 : -1;
        return 0; 
    });
}