document.addEventListener("DOMContentLoaded", () => {

    const tbody = document.querySelector("#tbody");
    const btnGuardar = document.querySelector("#btnGuardar");

    if (tbody) {
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
                            <td class="px-6 py-4 text-sm px-4 py-2 space-x-2">
                                <a href="#" class="text-green-600 hover:underline font-semibold">Editar</a>
                                <a href="#" class="text-red-600 hover:underline font-semibold">Eliminar</a>
                            </td>
                        </tr>
                    `;
                });
            } else {
                console.error("Error o tabla vacía:", json.message);
            }
        })
        .catch(error => console.error("Error en la petición:", error)); 
    return;
}

const form = document.querySelector("#formCustomers");
const name = document.querySelector("#name");
const phone = document.querySelector("#phone");
const email = document.querySelector("#email");

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const payload = {
        action: "insert",
        name: name.value.trim(),
        phone: phone.value.trim(),
        email: email.value.trim()
    };

    fetch("../php/customers.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
})
.then(res => res.json())
.then(json => {

    if (json.status === "success") {
        alert("Cliente registrado correctamente.");

        window.location.href = "index.html";
    } else {
        alert(json.message);
    }

})
.catch(error => console.error(error));

    });

})