fetch("../php/customers.php", {
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
                    <td class="px-6 py-4 text-sm text-gray-700">${order.id_customer}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.name}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.phone}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.email}</td>
                </tr>
            `;
        });
    } else {
        console.error("Error o tabla vacía:", json.message);
    }
})
.catch(error => console.error("Error en la petición:", error));