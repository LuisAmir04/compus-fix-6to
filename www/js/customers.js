document.addEventListener("DOMContentLoaded", () => {
    console.log("customers.js cargado");

    const apiUrl = "../php/customers.php";
    const tbody = document.querySelector("#tbody");
    const form = document.querySelector("#formCustomers");

    if (tbody) {
        fetch(apiUrl, {
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
                            <td class="px-6 py-4 text-sm text-gray-700">${order.id_customer}</td>
                            <td class="px-6 py-4 text-sm text-gray-700">${order.name}</td>
                            <td class="px-6 py-4 text-sm text-gray-700">${order.email}</td>
                            <td class="px-6 py-4 text-sm text-gray-700">${order.phone}</td>
                            <td class="px-6 py-4 text-sm px-4 py-2 space-x-2">
                                <button class="btn-edit text-green-600 hover:underline font-semibold cursor-pointer" data-id="${order.id_customer}" type="button">Editar</button>
                                <button class="btn-delete text-red-600 hover:underline font-semibold cursor-pointer" data-id="${order.id_customer}" type="button">Eliminar</button>
                            </td>
                        </tr>
                    `;
                    });
                } else {
                    console.error("Error o tabla vacía:", json.message);
                }
            })
            .catch(error => console.error("Error en la petición:", error));

        tbody.addEventListener("click", (evento) => {
            const btnEditar = evento.target.closest(".btn-edit");
            if (!btnEditar) return;

            const id = btnEditar.dataset.id;
            window.location.href = `../customers/edit.html?id=${id}`;
        });

        tbody.addEventListener("click", async (evento) => {
            const btnEditar = evento.target.closest(".btn-edit");
            if (btnEditar) {
                const id = btnEditar.dataset.id;
                window.location.href = `../customers/edit.html?id=${id}`;
                return;
            }

            const btnEliminar = evento.target.closest(".btn-delete");
            if (!btnEliminar) return;

            const id = btnEliminar.dataset.id;

            const result = await Swal.fire({
                title: "¿Estás seguro?",
                text: "Este registro se eliminará permanentemente.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Sí, eliminar"
            });

            if (!result.isConfirmed) return;

            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "delete",
                    id_customer: id
                })
            })
                .then(res => res.json())
                .then(json => {
                    if (json.status === "success") {
                        Swal.fire({
                            icon: "success",
                            title: "Eliminado",
                            text: "El cliente fue eliminado correctamente."
                        });
                        location.reload();
                    } else {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: json.message || "No se pudo eliminar."
                        });
                    }
                })
                .catch(error => {
                    console.error(error);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Error en la petición."
                    });
                });
        });

    }

    if (form) {
        const name = document.querySelector("#name");
        const phone = document.querySelector("#phone");
        const email = document.querySelector("#email");

        const params = new URLSearchParams(window.location.search);
        const id = params.get("id");

        if (id) {
            loadCustomerById(id);
        }

        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const payload = {
                action: id ? "update" : "insert",
                name: name.value.trim(),
                phone: phone.value.trim(),
                email: email.value.trim()
            };

            if (id) {
                payload.id_customer = id;
            }

            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(json => {
                    if (json.status === "success") {
                        alert(id ? "Cliente actualizado correctamente." : "Cliente registrado correctamente.");
                        window.location.href = "index.html";
                    } else {
                        alert(json.message || "Ocurrió un error");
                    }
                })
                .catch(error => console.error(error));
        });

        function loadCustomerById(id_customer) {
            fetch("../php/customers.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    action: "getById",
                    id_customer: id_customer
                })
            })
                .then(res => res.json())
                .then(json => {
                    console.log("Respuesta getById:", json);
                    if (json.status === "success") {
                        const customer = json.data;
                        name.value = customer.name || "";
                        email.value = customer.email || "";
                        phone.value = customer.phone || "";
                    } else {
                        console.error(json.message || "No se pudo cargar el cliente");
                    }
                })
                .catch(error => console.error(error));
        }
    }

});

