export function pintarTablaSess(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(sesion => {
        const colorEstado = sesion.estado === "Activa" ? "text-green-600" : "text-gray-400";
        tbody.innerHTML += `
        <tr>
            <td class="px-6 py-4">${sesion.id_session}</td>
            <td class="px-6 py-4">${sesion.username}</td>
            <td class="px-6 py-4">${sesion.created_at}</td>
            <td class="px-6 py-4">${sesion.expires_at}</td>
            <td class="px-6 py-4 font-semibold ${colorEstado}">${sesion.estado}</td>
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