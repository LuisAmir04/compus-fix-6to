fetch("../php/repair_orders.php", {
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
                    <td class="px-6 py-4 text-sm text-gray-700">${order.id_order}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.customer_name}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.device_type}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.service_type}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.technician_name}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.brand_model}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.reported_fault}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.technical_diagnosis}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.final_price}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.current_status}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.created_at}</td>
                </tr>
            `;
        });
    } else {
        console.error("Error o tabla vacía:", json.message);
    }
})
.catch(error => console.error("Error en la petición:", error));