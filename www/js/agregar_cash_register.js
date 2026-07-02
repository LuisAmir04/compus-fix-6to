document.addEventListener("DOMContentLoaded", () => {
    cargarUsuarios();
    document.getElementById("btnGuardar").addEventListener("click", guardarCorte);
});

function cargarUsuarios() {
    fetch("../php/cash_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getUsers" })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            const select = document.getElementById("id_user");

            json.data.forEach(user => {
                select.innerHTML += `
                    <option value="${user.id_user}">
                        ${user.username}
                    </option>
                `;
            });
        } else {
            alert(json.message || "No se pudieron cargar los usuarios");
        }
    })
    .catch(error => console.error("Error al cargar usuarios:", error));
}

function guardarCorte() {
    const id_user = document.getElementById("id_user").value;
    const initial_cash = document.getElementById("initial_cash").value;

    if (!id_user || !initial_cash) {
        alert("Completa todos los campos");
        return;
    }

    fetch("../php/cash_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "open_shift",
            id_user: id_user,
            initial_cash: initial_cash
        })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            window.location.href = "index.html";
        } else {
            alert(json.message || "No se pudo guardar");
        }
    })
    .catch(error => console.error("Error al guardar:", error));
}