export function alternarVistas(vistaMostrar, vistaOcultar) {
    vistaMostrar.classList.remove('hidden');
    vistaOcultar.classList.add('hidden');
}

export function pintarTabla(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(order => {
        tbody.innerHTML += `
        <tr>
            <td>${order.id_order}</td>
            <td>${order.customer_name}</td>
            <td>${order.device_type}</td>
            <td>${order.service_type}</td>
            <td>${order.technician_name}</td>
            <td>${order.brand_model}</td>
            <td>${order.reported_fault}</td>
            <td>${order.technical_diagnosis}</td>
            <td>${order.final_price}</td>
            <td>${order.current_status}</td>
            <td>${order.created_at}</td>
            <td>
                <button data-id="${order.id_order}" class="btn btn-sm btn-warning btn-editar">Editar</button>
                <button data-id="${order.id_order}" class="btn btn-sm btn-error btn-eliminar">Eliminar</button>
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