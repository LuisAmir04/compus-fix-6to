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

export function pintarPaginacion(contenedor, totalRegistros, registrosPorPagina, paginaActual, callbackCambioPagina) {
    contenedor.innerHTML = "";
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

    if (totalPaginas <= 1) return;

    const info = document.createElement("span");
    info.className = "text-sm text-gray-600 font-medium";
    info.textContent = `Mostrando página ${paginaActual} de ${totalPaginas} (${totalRegistros} registros)`;
    
    const btnContainer = document.createElement("div");
    btnContainer.className = "flex gap-2";

    const btnPrev = document.createElement("button");
    btnPrev.className = `btn btn-sm ${paginaActual === 1 ? 'btn-disabled' : 'btn-outline'}`;
    btnPrev.textContent = "« Anterior";
    btnPrev.onclick = () => {
        if (paginaActual > 1) callbackCambioPagina(paginaActual - 1);
    };

    const btnNext = document.createElement("button");
    btnNext.className = `btn btn-sm ${paginaActual === totalPaginas ? 'btn-disabled' : 'btn-outline'}`;
    btnNext.textContent = "Siguiente »";
    btnNext.onclick = () => {
        if (paginaActual < totalPaginas) callbackCambioPagina(paginaActual + 1);
    };

    btnContainer.appendChild(btnPrev);
    btnContainer.appendChild(btnNext);
    
    contenedor.appendChild(info);
    contenedor.appendChild(btnContainer);
}