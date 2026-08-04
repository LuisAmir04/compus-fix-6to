document.addEventListener("DOMContentLoaded", () => {
    
    // 1. OBTENER SESIÓN DE LOCALSTORAGE
    const userStr = localStorage.getItem("user_data");
    
    if (!userStr) {
        window.location.href = "../index.html"; 
        return; 
    }

    // 2. CONVERTIR DATOS Y OBTENER ROL
    const user = JSON.parse(userStr);
    const roleId = parseInt(user.id_role);

    // 3. MATRIZ DE PERMISOS POR ID (RBAC)

    const permisos = {
        "repair_orders": [1, 2],
        "sales": [1, 2],         
        "cash_register": [1, 2], 
        "customers": [1, 2],     
        "device_types": [1],       
        "service_types": [1],      
        "statuses": [1],           
        "roles": [1],               
        "users": [1],        
        "sessions": [1]       
    };

    // 4. VERIFICADOR DE RUTAS (PROTEGER VISTAS)
    const currentPath = window.location.pathname;
    let moduloActual = "";
    
    for (const modulo in permisos) {
        if (currentPath.includes(`/${modulo}/`)) {
            moduloActual = modulo;
            break;
        }
    }

    // Se compara el roleId numérico contra el arreglo de números permitidos
    if (moduloActual && !permisos[moduloActual].includes(roleId)) {
        alert("Acceso denegado: Tu rol no tiene permisos para este módulo.");
        window.location.href = "../repair_orders/"; 
        return;
    }

    // 5. DIBUJAR LOS BOTONES DEL NAVBAR SEGÚN SUS PERMISOS
    const contenedor = document.getElementById("navbar-container");
    if (!contenedor) return;

    let links = '';
    
    if (permisos["repair_orders"].includes(roleId)) links += `<li><a href="../repair_orders/">Órdenes de Reparación</a></li>`;
    if (permisos["sales"].includes(roleId)) links += `<li><a href="../sales/">Ventas</a></li>`;
    if (permisos["roles"].includes(roleId)) links += `<li><a href="../roles/">Roles</a></li>`;
    if (permisos["customers"].includes(roleId)) links += `<li><a href="../customers/">Clientes</a></li>`;
    if (permisos["service_types"].includes(roleId)) links += `<li><a href="../service_types/">Tipos de Servicio</a></li>`;
    if (permisos["device_types"].includes(roleId)) links += `<li><a href="../device_types/">Tipos de Dispositivo</a></li>`;
    if (permisos["statuses"].includes(roleId)) links += `<li><a href="../statuses/">Estados</a></li>`;
    if (permisos["cash_register"].includes(roleId)) links += `<li><a href="../cash_register/">Caja</a></li>`;
    if (permisos["users"].includes(roleId)) links += `<li><a href="../users/">Usuarios</a></li>`;
    if (permisos["sessions"].includes(roleId)) links += `<li><a href="../sessions/">Registro de Sesiones</a></li>`;

    // 6. RENDERIZAR NAVBAR
    contenedor.innerHTML = `
        <div class="navbar bg-base-200 shadow-md mb-8 rounded-b-lg">
            <div class="flex-1">
                <a href="../repair_orders/" class="btn btn-ghost text-xl">Compus Fix</a>
            </div>
            <div class="flex-none flex items-center gap-2">
                <ul class="menu menu-horizontal px-1 font-semibold hidden lg:flex">
                    ${links}
                </ul>
                
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost flex gap-2 text-right">
                        <div class="hidden sm:block">
                            <div class="font-bold leading-none">${user.username}</div>
                            <div class="text-xs text-gray-500">${user.role_name}</div>
                        </div>
                    </div>
                    <ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-gray-200">
                        <li class="lg:hidden"><h2 class="menu-title">Módulos</h2></li>
                        <div class="lg:hidden">${links}</div>
                        <div class="divider my-0 lg:hidden"></div>
                        <li><a id="btnLogout" class="text-red-500 font-bold hover:bg-red-50">Cerrar Sesión</a></li>
                    </ul>
                </div>
            </div>
        </div>
    `;

        // 7. LÓGICA DE CERRAR SESIÓN
        document.getElementById("btnLogout").addEventListener("click", () => {
        fetch("../php/users.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                action: "logout",
                token: user.token
            })
        }).finally(() => {
            localStorage.removeItem("user_data"); 
            window.location.href = "../index.html"; 
        });
    });
});