document.addEventListener("DOMContentLoaded", () => {

    const tbody = document.querySelector("#tbody");
    const form = document.querySelector("#formRol");
    const idInput = document.querySelector("#id_role");
    const nameInput = document.querySelector("#name");
    const btnNuevo = document.querySelector("#btnNuevo");
    const btnCancelar = document.querySelector("#btnCancelar");
    const msgArea = document.querySelector("#msgArea");

    function mostrarMensaje(texto, tipo) {
        const clase = tipo === "success" ? "alert-success" : "alert-error";
        msgArea.innerHTML = `<div class="alert ${clase}"><span>${texto}</span></div>`;
        setTimeout(() => { msgArea.innerHTML = ""; }, 3000);
    }

    function cargarRoles() {
        fetch("../php/roles.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "getAll" })
        })
        .then(res => res.json())
        .then(json => {
            console.log("Respuesta:", json);

            if (!tbody) {
                console.error("No existe #tbody en el HTML");
                return;
            }

            if (json.status === "success" && json.data.length > 0) {
                tbody.innerHTML = json.data.map(d => `
                    <tr class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td class="px-6 py-4 text-sm font-medium text-gray-900">#${d.id_role}</td>

                        <td class="px-6 py-4 text-sm text-gray-700 font-semibold">
                            ${d.name}
                        </td>

                        <td class="px-6 py-4 text-sm text-gray-700">
                            <button class="text-black hover:underline text-sm mr-3">Editar</button>
                            <button class="text-black hover:underline text-sm">Eliminar</button>
                        </td>
                    </tr>
                `).join('');
            } else {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="3" class="text-center py-4 text-gray-500">
                            No hay datos disponibles
                        </td>
                    </tr>
                `;
            }
        })
        .catch(err => {
            console.error("Error en fetch:", err);
        });
    }

    function abrirNuevo() {
        idInput.value = "";
        nameInput.value = "";
        form.classList.remove("hidden");
    }

    btnNuevo.addEventListener("click", abrirNuevo);

    btnCancelar.addEventListener("click", () => {
        form.classList.add("hidden");
        form.reset();
        idInput.value = "";
    });

    form.addEventListener("submit", e => {
        e.preventDefault();

        const id_role = idInput.value;
        const name = nameInput.value.trim();
        const action = id_role ? "update" : "insert";

        fetch("../php/roles.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action, id_role, name })
        })
        .then(res => res.json())
        .then(json => {
            console.log("Respuesta:", json);
            mostrarMensaje(json.message, json.status);
            if (json.status === "success") {
                form.classList.add("hidden");
                form.reset();
                idInput.value = "";
                cargarRoles();
            }
        })
        .catch(err => console.error("Error en fetch:", err));
    });

    cargarRoles();

});