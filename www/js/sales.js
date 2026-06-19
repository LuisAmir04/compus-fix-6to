fetch("../php/sales.php", {
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
                    <td class="px-6 py-4 text-sm text-gray-700">${order.id_sale}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.id_order}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.cashier_name}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.payment_method}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.total_paid}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${order.sale_date}</td>
                </tr>
            `;
        });
    } else {
        console.error("Error o tabla vacía:", json.message);
    }
})
.catch(error => console.error("Error en la petición:", error));