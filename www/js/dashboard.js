import { peticionDash } from './dash_api.js';

const coloresEstado = {
    "Recibido": "#9ca3af",
    "En Reparación": "#3b82f6",
    "Listo para Entrega": "#f59e0b",
    "Entregado": "#22c55e",
    "Cancelado": "#ef4444"
};

const paletaColores = ["#3b82f6", "#f59e0b", "#22c55e", "#ef4444", "#a855f7", "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1"];

document.addEventListener("DOMContentLoaded", async () => {
    document.querySelector("#fechaHoy").textContent = new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" });

    const json = await peticionDash({ action: "get_dashboard_data" });

    if (json.status !== "success") {
        alert(json.message || "No se pudo cargar el dashboard");
        return;
    }

    const data = json.data;
    pintarTarjetas(data);
    pintarChartServicio(data.ordenes_por_servicio);
    pintarChartEstado(data.ordenes_por_estado);
    pintarChartEntregasMes(data.ordenes_entregadas_por_mes);

    if (data.ventas_por_dia) {
        pintarChartVentasDia(data.ventas_por_dia);
    } else {
        document.querySelector("#panelVentasDia").remove();
    }

    if (data.ventas_por_metodo) {
        pintarChartMetodoPago(data.ventas_por_metodo);
    } else {
        document.querySelector("#panelMetodoPago").remove();
    }

    if (data.rendimiento_tecnicos) {
        pintarChartTecnicos(data.rendimiento_tecnicos);
    } else {
        document.querySelector("#panelTecnicos").remove();
    }
});

function tarjeta(titulo, valor, colorBorde = "#e5e7eb") {
    return `
        <div class="bg-white rounded-lg border-l-4 border border-gray-200 p-3" style="border-left-color: ${colorBorde}">
            <div class="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">${titulo}</div>
            <div class="text-xl font-bold text-gray-800 mt-1">${valor}</div>
        </div>`;
}

function pintarTarjetas(data) {
    const contenedor = document.querySelector("#tarjetas");
    let html = tarjeta("Órdenes totales", data.total_ordenes, "#475569");
    
    data.ordenes_por_estado.forEach(e => {
        html += tarjeta(e.estado, e.total, coloresEstado[e.estado] || "#9ca3af");
    });

    if (data.ventas_resumen) {
        html += tarjeta("Ventas este mes", "$" + Number(data.ventas_resumen.mes_actual).toLocaleString("es-MX", { minimumFractionDigits: 0 }), "#22c55e");
        html += tarjeta("Ventas mes pasado", "$" + Number(data.ventas_resumen.mes_pasado).toLocaleString("es-MX", { minimumFractionDigits: 0 }), "#94a3b8");
    }

    contenedor.innerHTML = html;
}

function pintarChartServicio(datos) {
    new Chart(document.querySelector("#chartServicio"), {
        type: "bar",
        data: {
            labels: datos.map(d => d.servicio),
            datasets: [{ label: "Órdenes", data: datos.map(d => d.total), backgroundColor: paletaColores }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function pintarChartEstado(datos) {
    new Chart(document.querySelector("#chartEstado"), {
        type: "doughnut",
        data: {
            labels: datos.map(d => d.estado),
            datasets: [{ data: datos.map(d => d.total), backgroundColor: datos.map(d => coloresEstado[d.estado] || "#d1d5db") }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function pintarChartEntregasMes(datos) {
    new Chart(document.querySelector("#chartEntregasMes"), {
        type: "line",
        data: {
            labels: datos.map(d => d.mes),
            datasets: [{
                label: "Órdenes entregadas",
                data: datos.map(d => d.total),
                borderColor: "#3b82f6",
                backgroundColor: "#3b82f633",
                tension: 0.3,
                fill: true
            }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function pintarChartVentasDia(datos) {
    new Chart(document.querySelector("#chartVentasDia"), {
        type: "bar",
        data: {
            labels: datos.map(d => d.dia),
            datasets: [{ label: "Ventas ($)", data: datos.map(d => d.total), backgroundColor: "#6366f1" }]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

function pintarChartMetodoPago(datos) {
    new Chart(document.querySelector("#chartMetodoPago"), {
        type: "pie",
        data: {
            labels: datos.map(d => d.payment_method),
            datasets: [{ data: datos.map(d => d.total), backgroundColor: paletaColores }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function pintarChartTecnicos(datos) {
    const top10 = datos.slice(0, 10);
    new Chart(document.querySelector("#chartTecnicos"), {
        type: "bar",
        data: {
            labels: top10.map(d => d.tecnico),
            datasets: [{ label: "Órdenes completadas", data: top10.map(d => d.ordenes_completadas), backgroundColor: paletaColores }]
        },
        options: { indexAxis: "y", responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}