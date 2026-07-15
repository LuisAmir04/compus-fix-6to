const URL = "../php/users.php";

export async function peticionUsr(datos) {
    try {
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