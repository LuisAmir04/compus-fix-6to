document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id_cut = params.get("id");

    const inputInitialCash = document.getElementById("initial_cash");
    const inputDeclaredCash = document.getElementById("declared_cash");
    const btnGuardar = document.getElementById("btnGuardar");

    if (!id_cut) return;

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
        if (json.status === "success") {
            inputInitialCash.value = json.data.initial_cash;
            inputDeclaredCash.value = json.data.declared_cash;
        }
    })
    .catch(err => console.error(err));

    btnGuardar.addEventListener("click", (e) => {
        e.preventDefault();

        fetch("../php/cash_register.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "update",
                id_cut: id_cut,
                initial_cash: inputInitialCash.value,
                declared_cash: inputDeclaredCash.value
            })
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);

            if (json.status === "success") {
                window.location.href = "index.html";
            } else {
                alert(json.message || "No se pudo actualizar");
            }
        })
        .catch(err => console.error(err));
    });
});