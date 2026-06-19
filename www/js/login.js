const button = document.querySelector("#loginButton");
const username = document.querySelector("#username_field");
const password = document.querySelector("#password_field");

button.addEventListener("click", e => {
  e.preventDefault();
  
  fetch("../php/users.php", {
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

      localStorage.setItem("user", JSON.stringify(json.data));
      
      if(json.data.id_role === 1) {
          window.location.href = "../sales/"; // Vista de administrador/órdenes
      } else {
          window.location.href = "../repair_orders/"; // Vista de técnico
      }
    } else {
      alert("Credenciales incorrectas.");
    }
  })
  .catch(error => console.error("Error en la petición:", error));
});