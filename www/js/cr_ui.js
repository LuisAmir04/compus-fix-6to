export function alternarVistas(vistaMostrar, vistasOcultar) {
    vistasOcultar.forEach(vista => vista.classList.add('hidden'));
    vistaMostrar.classList.remove('hidden');
}

export function pintarTablaCaja(tbody, datos) {
    tbody.innerHTML = "";
    datos.forEach(order => {
        tbody.innerHTML += `
            <tr class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 text-sm text-gray-700">${order.id_cut}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${order.cashier_name}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${order.opening_time}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${order.initial_cash}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${order.closing_time ?? ""}</td>
                <td class="px-6 py-4 text-sm text-gray-700">${order.declared_cash ?? ""}</td>
                <td class="px-6 py-4">
                    <div class="flex gap-2">
                        <button class="btn btn-sm btn-warning btn-editar" data-id="${order.id_cut}">✏️ Editar</button>
                        <button class="btn btn-sm btn-error btn-eliminar" data-id="${order.id_cut}">🗑️ Eliminar</button>
                    </div>
                </td>
            </tr>
        `;
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
    btnPrev.onclick = () => { if (paginaActual > 1) callbackCambioPagina(paginaActual - 1); };

    const btnNext = document.createElement("button");
    btnNext.className = `btn btn-sm ${paginaActual === totalPaginas ? 'btn-disabled' : 'btn-outline'}`;
    btnNext.textContent = "Siguiente »";
    btnNext.onclick = () => { if (paginaActual < totalPaginas) callbackCambioPagina(paginaActual + 1); };

    btnContainer.appendChild(btnPrev);
    btnContainer.appendChild(btnNext);
    
    contenedor.appendChild(info);
    contenedor.appendChild(btnContainer);
}