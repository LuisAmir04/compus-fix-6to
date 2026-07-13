document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id_cut = params.get("id");

    if (!id_cut) {
        Swal.fire("Error", "No se recibió el ID del corte.", "error");
        return;
    }

    cargarDatos(id_cut);

    document.getElementById("btnGuardar").addEventListener("click", () => {
        guardarCambios(id_cut);
    });
});

function cargarDatos(id_cut) {
    fetch("../php/cash_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "getOne",
            id_cut: id_cut
        })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success" && json.data) {
            document.getElementById("initial_cash").value = json.data.initial_cash ?? "";
            document.getElementById("declared_cash").value = json.data.declared_cash ?? "";
        } else {
            Swal.fire("Error", json.message || "No se pudo cargar el registro.", "error");
        }
    })
    .catch(error => {
        console.error("Error al cargar:", error);
        Swal.fire("Error", "No se pudo cargar el registro.", "error");
    });
}

function guardarCambios(id_cut) {
    const initial_cash = document.getElementById("initial_cash").value.trim();
    const declared_cash = document.getElementById("declared_cash").value.trim();

    if (initial_cash === "") {
        Swal.fire("Atención", "El dinero inicial es obligatorio.", "warning");
        return;
    }

    fetch("../php/cash_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "update",
            id_cut: id_cut,
            initial_cash: initial_cash,
            declared_cash: declared_cash
        })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            Swal.fire({
                title: "Guardado",
                text: "El corte fue actualizado correctamente.",
                icon: "success"
            }).then(() => {
                window.location.href = "index.html";
            });
        } else {
            Swal.fire("Error", json.message || "No se pudo actualizar.", "error");
        }
    })
    .catch(error => {
        console.error("Error al guardar:", error);
        Swal.fire("Error", "Ocurrió un problema al actualizar.", "error");
    });
}