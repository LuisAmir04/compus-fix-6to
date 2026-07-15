export function alternarVistasCust(vistaMostrar, vistaOcultar) {
    vistaMostrar.classList.remove('hidden');
    vistaOcultar.classList.add('hidden');
}

export function pintarTablaCust(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(item => {
        tbody.innerHTML += `
        <tr class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 text-sm text-gray-700 font-medium">${item.id_customer}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${item.name}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${item.email}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${item.phone}</td>
            <td class="px-6 py-4 text-sm space-x-3">
                <button class="btn-editar text-green-600 hover:text-green-800 hover:underline font-semibold transition" data-id="${item.id_customer}" type="button">Editar</button>
                <button class="btn-eliminar text-red-600 hover:text-red-800 hover:underline font-semibold transition" data-id="${item.id_customer}" type="button">Eliminar</button>
            </td>
        </tr>`;
    });
}