document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id_cut = params.get("id");

    const inputInitialCash = document.getElementById("initial_cash");
    const inputDeclaredCash = document.getElementById("declared_cash");
    const form = document.getElementById("formCorte");

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

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const initial_cash = inputInitialCash.value.trim();
        const declared_cash = inputDeclaredCash.value.trim();

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
                window.location.href = "index.html";
            } else {
                console.error(json.message);
            }
        })
        .catch(err => console.error(err));
    });
});