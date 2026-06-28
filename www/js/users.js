fetch("../php/users.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
})
.then(res => res.json())
.then(json => {
    if (json.status === "success") {
        const tbody = document.querySelector("#tbody");
        tbody.innerHTML = "";

        json.data.forEach(user => {
            tbody.innerHTML += `
                <tr>
                    <td class="px-6 py-4 text-sm text-gray-700">${user.id_user}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${user.username}</td>
                    <td class="px-6 py-4 text-sm text-gray-700">${user.role_name}</td>
                </tr>
            `;
        });
    } else {
        console.error("Error o tabla vacía:", json.message);
    }
})
.catch(error => console.error("Error en la petición:", error));