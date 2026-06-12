let ventas = [];

function mostrarInfo() {
    let info = document.getElementById("info");
    info.style.display = (info.style.display === "none") ? "block" : "none";
}

function actualizarHora() {
    let fecha = new Date();
    document.getElementById("hora").innerHTML = fecha.toLocaleString();
}

setInterval(actualizarHora, 1000);

function calcularVenta() {

    let cliente = document.getElementById("cliente").value.trim();

    let select = document.getElementById("combustible");
    let combustibleTexto = select.options[select.selectedIndex].text;
    let combustiblePrecio = parseFloat(select.value);

    let litros = parseFloat(document.getElementById("litros").value);

    let metodo = document.getElementById("metodoPago").value;

    if (
        cliente === "" ||
        isNaN(combustiblePrecio) ||
        isNaN(litros) ||
        metodo === ""
    ) {
        alert("Complete todos los campos");
        return;
    }

    if (litros <= 0) {
        alert("La cantidad de litros debe ser mayor a 0");
        return;
    }

    let total = combustiblePrecio * litros;

    let fecha = new Date().toLocaleString();

    let venta = {
        cliente,
        combustible: combustibleTexto,
        litros,
        metodo,
        total,
        fecha
    };

    ventas.push(venta);

    guardarLocalStorage();

    mostrarResultado(total);
    generarTicket(venta);
    cargarTabla();
    actualizarDashboard();

    document.getElementById("cliente").value = "";
    document.getElementById("combustible").selectedIndex = 0;
    document.getElementById("litros").value = "";
    document.getElementById("metodoPago").selectedIndex = 0;
}

function mostrarResultado(total) {
    document.getElementById("resultado").innerHTML =
        "Total a pagar: Gs. " + total.toLocaleString();
}

function generarTicket(venta) {

    document.getElementById("ticket").innerHTML = `
====================
SHELL FUEL STATION
====================

Fecha: ${venta.fecha}

Cliente: ${venta.cliente}
Combustible: ${venta.combustible}
Litros: ${venta.litros}
Pago: ${venta.metodo}

Total: Gs. ${venta.total.toLocaleString()}

Gracias por su compra
`;
}

function cargarTabla() {

    let tbody = document.querySelector("#tablaVentas tbody");

    tbody.innerHTML = "";

    ventas.forEach((venta, index) => {

        tbody.innerHTML += `
        <tr>
            <td>${venta.fecha}</td>
            <td>${venta.cliente}</td>
            <td>${venta.combustible}</td>
            <td>${venta.litros}</td>
            <td>${venta.metodo}</td>
            <td>${venta.total.toLocaleString()}</td>
            <td>
                <button onclick="eliminarVenta(${index})">
                    Eliminar
                </button>
            </td>
        </tr>
        `;
    });
}

function eliminarVenta(index) {

    if (confirm("¿Eliminar esta venta?")) {

        ventas.splice(index, 1);

        guardarLocalStorage();
        cargarTabla();
        actualizarDashboard();
    }
}

function actualizarDashboard() {

    let cantidadVentas = ventas.length;

    let litrosTotales = ventas.reduce(
        (acum, venta) => acum + venta.litros,
        0
    );

    let totalRecaudado = ventas.reduce(
        (acum, venta) => acum + venta.total,
        0
    );

    document.getElementById("ventasRealizadas").innerText =
        cantidadVentas;

    document.getElementById("litrosVendidos").innerText =
        litrosTotales;

    document.getElementById("recaudacion").innerText =
        totalRecaudado.toLocaleString();

    combustibleMasVendido();
}

function combustibleMasVendido() {

    let contador = {};

    ventas.forEach(v => {

        if (!contador[v.combustible]) {
            contador[v.combustible] = 0;
        }

        contador[v.combustible] += v.litros;
    });

    let ganador = "Sin datos";
    let max = 0;

    for (let combustible in contador) {

        if (contador[combustible] > max) {

            max = contador[combustible];
            ganador = combustible;
        }
    }

    document.getElementById("combustibleTop").innerText =
        ganador;
}

function guardarLocalStorage() {

    localStorage.setItem(
        "ventas",
        JSON.stringify(ventas)
    );
}

function cargarLocalStorage() {

    let datos = localStorage.getItem("ventas");

    if (datos) {

        ventas = JSON.parse(datos);

        cargarTabla();
        actualizarDashboard();
    }
}

function borrarHistorial() {

    if (confirm("¿Seguro que desea borrar todo el historial?")) {

        ventas = [];

        localStorage.removeItem("ventas");

        cargarTabla();
        actualizarDashboard();

        document.getElementById("ticket").innerHTML = "";
        document.getElementById("resultado").innerHTML = "";
    }
}

window.onload = function () {

    actualizarHora();

    cargarLocalStorage();
}