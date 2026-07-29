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