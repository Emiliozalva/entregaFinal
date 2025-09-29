import { producto } from './clases.js';



export function imprimirProductos(productos) {
    const contenedor = document.getElementById('listaProductos');
    for (const producto of productos) {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
            <img src="${producto.getImagen()}" alt="${producto.getNombre()}">
            <h3>${producto.getNombre()}</h3>
            <p>Precio: $${producto.getPrecio()}</p>
        `;
        div.addEventListener('click', () => {
            window.location.href = `../producto.html`;
            localStorage.setItem('idProducto', producto.getId());
        });
        contenedor.appendChild(div);
    }
        
}
export function imprimirProductoSeleccionado(producto, c) {
    const contenedor = document.getElementById('detalleProducto');
    contenedor.innerHTML = `
        <img class="imagenProducto" src="${producto.getImagen()}" alt="${producto.getNombre()}">
        <div class="infoProducto">
            <h2 class="nombreProducto">${producto.getNombre()}</h2>
            <p class="descripcionProducto">${producto.getDescripcion()}</p>
            <p class="precioProducto">Precio: $${producto.getPrecio()}</p>
            <button id="agregarAlCarrito" class="agregarAlCarrito">Agregar al Carrito</button>
            <button id="btnCompra" class="btnCompra">Comprar</button>
        </div>
    `;

const btnCarrito = document.getElementById("agregarAlCarrito");
btnCarrito.addEventListener("click", () => {
    Swal.fire({
        title: `¿Quieres agregar "${producto.getNombre()}" al carrito?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            c.agregarProducto(producto.getId());
            Swal.fire({
                title: "Producto agregado",
                text: `"${producto.getNombre()}" fue añadido al carrito`,
                icon: "success",
                confirmButtonText: "Aceptar"
            });
        }
    });
});

const btnCompra = document.getElementById("btnCompra");
btnCompra.addEventListener("click", () => {
    const compra = {
        tipo: "directa",
        producto: {
            nombre: producto.getNombre(),
            precio: producto.getPrecio()
        },
        total: producto.getPrecio()
    };

    localStorage.setItem("resumenCompra", JSON.stringify(compra));
    window.location.href = "compraDirecta.html";
});
}
    

export async function cargarProductos() { ///DEVUELVE UN ARRAY DE PRODUCTOS SACADOS DEL JSON
    try {
        const response = await fetch('productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar productos.json');
        }

        const data = await response.json();
        const listaProductos = data.map(p => 
            new producto(p.id, p.nombre, p.descripcion, p.precio, p.imagen)
        );

        return listaProductos;

    } catch (error) {
        console.error('Error cargando productos:', error);
        return [];
    }
}

export function mostrarCarrito(carrito, listaProductos) {
    const contenedor = document.getElementById("listaCarrito");
    contenedor.innerHTML = "";

    const productosIds = carrito.productos; // IDs del carrito
    if (!productosIds || productosIds.length === 0) {
        contenedor.innerHTML = "<p>El carrito está vacío</p>";
        return;
    }

    let total = 0;

    productosIds.forEach(id => {
        // Buscar el producto en la lista general comparando como string
        const producto = listaProductos.find(p => p.getId().toString() === id.toString());
        if (!producto) return;

        total += producto.getPrecio();

        const item = document.createElement("div");
        item.classList.add("carrito-item"); // usamos clase CSS
        item.innerHTML = `
            <span class="item-nombre">${producto.getNombre()}</span>
            <span class="item-precio">$${producto.getPrecio()}</span>
            <button class="btnEliminar btn">Eliminar</button>
        `;

        const btnEliminar = item.querySelector(".btnEliminar");
        btnEliminar.addEventListener("click", () => {
            carrito.eliminarProducto(producto.getId());
            mostrarCarrito(carrito, listaProductos);
        });

        contenedor.appendChild(item);
    });

    // Total y botón de pagar
    const totalDiv = document.createElement("div");
    totalDiv.classList.add("carrito-total");
    totalDiv.innerHTML = `
        <h3>Total: $${total}</h3>
        <button id="btnPagar" class="btn">Pagar</button>
    `;

const btnPagar = totalDiv.querySelector("#btnPagar");
btnPagar.addEventListener("click", () => {
    // Guardar en localStorage un resumen de la compra
    const compra = {
        tipo: "carrito",
        productos: carrito.getProductos().map(p => ({
            nombre: p.getNombre(),
            precio: p.getPrecio()
        })),
        total: carrito.getTotal()
    };

    localStorage.setItem("resumenCompra", JSON.stringify(compra));
    window.location.href = "compraDirecta.html"; 
});

    contenedor.appendChild(totalDiv);
}


export function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1); // elimina el producto
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito(); // refresca vista
}
export function pagar() {
    alert("Redirigiendo a la pasarela de pago...");
    localStorage.removeItem("carrito");
    mostrarCarrito();
}
export function mostrarResumenCompra() {
    const data = JSON.parse(localStorage.getItem("resumenCompra"));
    const contenedor = document.getElementById("compraContainer");
    contenedor.innerHTML = "";

    if (!data) {
        contenedor.innerHTML = "<p>No hay compra para mostrar</p>";
        return;
    }

    // Crear layout (izquierda: resumen, derecha: formulario)
    const layout = document.createElement("div");
    layout.classList.add("compra-layout");

    // Resumen a la izquierda
    const resumen = document.createElement("div");
    resumen.classList.add("compra-resumen");

    if (data.tipo === "carrito") {
        resumen.innerHTML = `
            <h2>Resumen de tu carrito</h2>
            <ul>
                ${data.productos.map(p => `<li>${p.nombre} - $${p.precio}</li>`).join("")}
            </ul>
            <h3>Total: $${data.total}</h3>
        `;
    } else {
        resumen.innerHTML = `
            <h2>Compra directa</h2>
            <p>${data.producto.nombre} - $${data.producto.precio}</p>
            <h3>Total: $${data.total}</h3>
        `;
    }

    // Formulario a la derecha
    const form = document.createElement("div");
    form.classList.add("compra-form");
    form.innerHTML = `
        <h2>Datos de pago</h2>
        <form id="formPago">
            <input type="text" placeholder="Nombre completo" required><br>
            <input type="text" placeholder="Dirección" required><br>
            <input type="text" placeholder="Número de tarjeta" required><br>
            <input type="text" placeholder="Fecha de vencimiento (MM/AA)" required><br>
            <input type="text" placeholder="CVV" required><br>
            <button type="submit">Pagar</button>
        </form>
    `;

    layout.appendChild(resumen);
    layout.appendChild(form);
    contenedor.appendChild(layout);

    // SweetAlert de confirmación
document.getElementById("formPago").addEventListener("submit", (e) => {
    e.preventDefault();

    Swal.fire({
        title: `Vas a pagar $${data.total}`,
        text: "¿Deseas confirmar el pago?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, pagar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: "success",
                title: "Compra realizada con éxito",
                text: "Gracias por tu compra.",
                confirmButtonText: "Aceptar"
            }).then(() => {
                localStorage.removeItem("resumenCompra");
                window.location.href = "index.html";
            });
        }
    });
});
}