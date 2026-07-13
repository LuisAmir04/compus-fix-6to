export function getCashRegisters() {
    return fetch("../php/cash_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getAll" })
    }).then(res => res.json());
}

export function getCashRegisterById(id_cut) {
    return fetch("../php/cash_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "getOne",
            id_cut: id_cut
        })
    }).then(res => res.json());
}

export function updateCashRegister(data) {
    return fetch("../php/cash_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "update",
            ...data
        })
    }).then(res => res.json());
}

export function deleteCashRegister(id_cut) {
    return fetch("../php/cash_register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            action: "delete",
            id_cut: id_cut
        })
    }).then(res => res.json());
}