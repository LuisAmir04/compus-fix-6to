const btnGuardar = document.querySelector("#btnGuardar")
const tbody = document.querySelector("#tbody")

fetch("../php/statuses.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
})
.then(res => res.json())
.then(json => {
    if (json.status === "success") {
        const tbody = document.querySelector("#tbody");
        
        tbody.innerHTML = ""; 
        
        json.data.forEach(order => {
            tbody.innerHTML += `
<tr>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.id_status}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.name}</td>
                    <td class="px-6 py-4 text-sm flex gap-2">
                            <a href="editar.html?id=${order.id_status}" class="bg-indigo-700 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-indigo-800 transition shadow-sm">
                                Editar
                            </a>
                            <a href="eliminar.html?id=${order.id_status}" class="bg-rose-500 text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-rose-600 transition shadow-sm">
                                Eliminar
                            </a>
                        </td>

                </tr>
            `;
        });
    } else {
        console.error("Error o tabla vacía:", json.message);
    }
})
.catch(error => console.error("Error en la petición:", error));

if (!tbody) {
    const statusName = document.querySelector("#statusName")

    if (btnGuardar) {
        btnGuardar.addEventListener("click", e => {
            e.preventDefault();
            
            const payload = {
                action: "insert",
                name: statusName.value
            }

            fetch("../php/statuses.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(json => {
                if (json.status === "success") {
                    window.location.href = "index.html"; 
                } else {
                    alert("Error al guardar");
                }
            })
            .catch(err => console.error("Error:", err));
        });
    }
    }