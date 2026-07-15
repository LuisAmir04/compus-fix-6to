const URL = "../php/sales.php";

export async function peticionSal(datos) {
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