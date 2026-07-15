export function alternarVistasRol(vistaMostrar, vistaOcultar) {
    vistaMostrar.classList.remove('hidden');
    vistaOcultar.classList.add('hidden');
}

export function pintarTablaRol(tbody, datos) {
    tbody.innerHTML = "";
    
    if (datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-gray-500">No hay datos disponibles</td></tr>`;
        return;
    }

    datos.forEach(rol => {
        tbody.innerHTML += `
        <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">#${rol.id_role}</td>
            <td class="px-6 py-4 text-sm text-gray-700 font-semibold">${rol.name}</td>
            <td class="px-6 py-4 text-sm text-gray-700">
                <button data-id="${rol.id_role}" class="btn-editar text-black hover:text-blue-600 hover:underline text-sm mr-3 font-semibold transition">Editar</button>
                <button data-id="${rol.id_role}" class="btn-eliminar text-black hover:text-red-600 hover:underline text-sm font-semibold transition">Eliminar</button>
            </td>
        </tr>`;
    });
}