export function alternarVistasUsr(vistaMostrar, vistaOcultar) {
    vistaMostrar.classList.remove('hidden');
    vistaOcultar.classList.add('hidden');
}

export function pintarTablaUsr(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(user => {
        tbody.innerHTML += `
        <tr>
            <td class="px-6 py-4">${user.id_user}</td>
            <td class="px-6 py-4">${user.username}</td>
            
            <td class="px-6 py-4 font-semibold text-blue-600">${user.role_name}</td>
            
            <td class="px-6 py-4 flex gap-2">
                <button data-id="${user.id_user}" class="btn-editar btn btn-primary btn-sm">Editar</button>
                <button data-id="${user.id_user}" class="btn-eliminar btn btn-error btn-sm">Eliminar</button>
            </td>
        </tr>`;
    });
}