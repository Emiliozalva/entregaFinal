import { producto, carrito } from './clases.js';
import { 
    imprimirProductos, 
    cargarProductos, 
    imprimirProductoSeleccionado, 
    mostrarCarrito,
    mostrarResumenCompra 
} from './funciones.js';

let listaProductos = cargarProductos();
let carritoCompras;

// Página principal: mostrar todos los productos
if (window.location.pathname.endsWith('index.html')) {
    listaProductos.then(productos => {
        carritoCompras = new carrito(productos);
        imprimirProductos(productos);
    });
}

// Página de producto seleccionado
if (window.location.pathname.endsWith('producto.html')) {
    const idProducto = localStorage.getItem('idProducto');
    listaProductos.then(productos => {
        carritoCompras = new carrito(productos);
        const productoSeleccionado = productos.find(
            p => p.getId().toString() === idProducto.toString()
        );
        if (productoSeleccionado) {
            imprimirProductoSeleccionado(productoSeleccionado, carritoCompras);
        }
    });
}

// Página de carrito
if (window.location.pathname.endsWith('carrito.html')) {
    listaProductos.then(productos => {
        carritoCompras = new carrito(productos);
        mostrarCarrito(carritoCompras, productos);
    });
}

// Página de compra directa o resumen de compra
if (window.location.pathname.endsWith('compraDirecta.html')) {
    mostrarResumenCompra();
}