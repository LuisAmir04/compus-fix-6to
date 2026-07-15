export async function peticionSale(datos) {
    const respuesta = await fetch('../php/sales.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    return await respuesta.json();
}