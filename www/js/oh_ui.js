const coloresEstado = {
    "Recibido": "text-gray-500",
    "En Reparación": "text-blue-600",
    "Listo para Entrega": "text-amber-600",
    "Entregado": "text-green-600",
    "Cancelado": "text-red-600"
};

export function pintarTablaHistorial(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(fila => {
        tbody.innerHTML += `
        <tr>
            <td class="px-6 py-4">#${fila.id_order}</td>
            <td class="px-6 py-4">${fila.cliente}</td>
            <td class="px-6 py-4 font-semibold ${coloresEstado[fila.estado] || ''}">${fila.estado}</td>
            <td class="px-6 py-4">${fila.tecnico}</td>
            <td class="px-6 py-4">${fila.fecha_creacion}</td>
            <td class="px-6 py-4">${fila.fecha_cambio}</td>
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