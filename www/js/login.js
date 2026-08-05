const button = document.querySelector("#loginButton");
const username = document.querySelector("#username_field");
const password = document.querySelector("#password_field");

// Si ya hay sesión guardada en LocalStorage, no lo dejamos ver el login y lo mandamos directo
if (localStorage.getItem("user_data")) {
    window.location.href = "repair_orders/"; 
}

button.addEventListener("click", e => {
    e.preventDefault();
  
    fetch("php/users.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username.value,
            password: password.value,
            action: "login"
        })
    })
    .then(res => res.json())
    .then(json => {
        if (json.status === "success") {
            // MAGIA: Metemos los datos al LocalStorage
            localStorage.setItem("user_data", JSON.stringify(json.data));
            
            // Redirigimos a la tabla principal
            window.location.href = "dashboard/"; 
        } else {
            alert("Credenciales incorrectas.");
        }
    })
    .catch(error => console.error("Error en la petición:", error));
});