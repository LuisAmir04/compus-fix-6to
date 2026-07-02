


fetch("../php/users.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "getAll" })
})
.then(res => res.json())
.then(json => {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";
    json.data.forEach(user => {
        tbody.innerHTML += `
                <tr>
                    <td>${user.id_user}</td>
                    <td>${user.username}</td>
                    <td>${user.id_role}</td>
                <td class="flex gap-2">
                        <a href="editar.html?id=${user.id_user}" class="btn btn-primary btn-sm">
                            Editar
                        </a>

                        <button onclick="eliminarUsuario(${user.id_user})" class="btn btn-error btn-sm">
                            Eliminar
                        </button>
                    </td>
                </tr>
            `;
              });
        });          
    function eliminarUsuario(id) {

    if (!confirm("¿Deseas eliminarlo?")) return;

    const filas = document.querySelectorAll("#tbody tr");

    filas.forEach(fila => {

        const idFila = fila.children[0].textContent.trim();

        if (idFila == id) {
            fila.remove();
        }

    });

}