export function alternarVistasStat(vistaMostrar, vistaOcultar) {
    vistaMostrar.classList.remove('hidden');
    vistaOcultar.classList.add('hidden');
}

export function pintarTablaStat(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(item => {
        tbody.innerHTML += `
        <tr>
            <td class="px-6 py-4 text-sm text-gray-700">${item.id_status}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${item.name}</td>
            <td class="px-6 py-4 text-sm flex gap-2">
                <button data-id="${item.id_status}" class="btn-editar bg-indigo-700 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-indigo-800 transition shadow-sm">
                    Editar
                </button>
                <button data-id="${item.id_status}" class="btn-eliminar bg-rose-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-rose-600 transition shadow-sm">
                    Eliminar
                </button>
            </td>
        </tr>`;
    });
}