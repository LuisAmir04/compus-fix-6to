export function alternarVistasST(vistaMostrar, vistaOcultar) {
    vistaMostrar.classList.remove('hidden');
    vistaOcultar.classList.add('hidden');
}

export function pintarTablaST(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(item => {
        tbody.innerHTML += `
        <tr>
            <td class="px-6 py-4 text-sm text-gray-700">${item.id_service_type}</td>
            <td class="px-6 py-4 text-sm text-gray-700">${item.name}</td>
            <td class="px-6 py-4 text-sm">
                <button data-id="${item.id_service_type}" class="btn btn-sm btn-warning btn-editar">Editar</button>
                <button data-id="${item.id_service_type}" class="btn btn-sm btn-error btn-eliminar ml-2">Eliminar</button>
            </td>
        </tr>`;
    });
}