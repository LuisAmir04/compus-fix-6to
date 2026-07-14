const URL = "../php/statuses.php";

export async function peticionStat(datos) {
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