const URL = "../php/order_history.php";

export async function peticionHistorial(datos) {
    try {
        const user = JSON.parse(localStorage.getItem("user_data"));
        datos.token = user ? user.token : "";

        const respuesta = await fetch(URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datos)
        });
        return await respuesta.json();
    } catch (error) {
        console.error("Error API:", error);
        return { status: "error", message: "Error de conexión" };
    }
}