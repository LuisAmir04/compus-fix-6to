document.addEventListener("DOMContentLoaded", () => {
    
    const contenedor = document.getElementById("navbar-container");
    if (!contenedor) return;

    contenedor.innerHTML = `
        <div class="navbar bg-base-200 shadow-md mb-8 rounded-b-lg">
            <div class="flex-1">
                <a href="../index.html" class="btn btn-ghost text-xl">Compus Fix</a>
            </div>
            <div class="flex-none">
                <ul class="menu menu-horizontal px-1 font-semibold">
                    <li><a href="../repair_orders/">Órdenes de Reparación</a></li>
                    <li><a href="../sales/">Ventas</a></li>
                    <li><a href="../roles/">Roles</a></li>
                    <li><a href="../customers/">Clientes</a></li>
                    <li><a href="../service_types/">Tipos de Servicio</a></li>
                    <li><a href="../device_types/">Tipos de Dispositivo</a></li>
                    <li><a href="../statuses/">Estados</a></li>
                    <li><a href="../cash_register/">Caja</a></li>
                    <li><a href="../users/">Usuarios</a></li>
                </ul>
            </div>
        </div>
`;
});