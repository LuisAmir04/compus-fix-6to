const tbody = document.querySelector("#tbody");

if (tbody) {
fetch("../php/service_types.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
})
.then(res => res.json())
.then(json => {
    if (json.status === "success") {
        
        tbody.innerHTML = ""; 
        
        json.data.forEach(order => {
            tbody.innerHTML += `
<tr>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.id_service_type}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.name}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">
                        <a href="editar.html" class="link link-primary">editar</a>
                        <a href="eliminar.html" class="link link-error ml-2">eliminar</a>
                    </td>   

                </tr>
            `;
        });
    } else {
        console.error("Error o tabla vacía:", json.message);
    }
})
.catch(error => console.error("Error en la petición:", error));
}
if (!tbody) {
    const Nombre = document.querySelector("#Nombre");
    const btnGuardar = document.querySelector("#btnGuardar");

    btnGuardar.addEventListener("click", e => {
        e.preventDefault();

        const payload = {
            action: "insert",
            name: Nombre.value
        };

        fetch("../php/service_types.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(json => {
            if (json.status === "success") {
                window.location.href = "index.html";
            }
        })
        .catch(error => console.error("Error en la petición:", error));
    });
}