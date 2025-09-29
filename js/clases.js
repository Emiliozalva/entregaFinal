export class producto{
    id;
    nombre;
    descripcion;
    precio;
    imagen;
    constructor(id, nombre, descripcion, precio, imagen){
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.imagen = imagen;
    }
    getNombre(){return this.nombre;}   
    getPrecio(){return this.precio;}
    getImagen(){return this.imagen;}  
    getId(){return this.id;}
    getDescripcion(){return this.descripcion;}
    setNombre(nombre){this.nombre = nombre;}
    setPrecio(precio){this.precio = precio;}
    setImagen(imagen){this.imagen = imagen;}
    setDescripcion(descripcion){this.descripcion = descripcion;}
}

export class carrito {
    productos; 
    constructor(listaProductos) {
        // Lista de IDs guardados en localStorage
        const stored = JSON.parse(localStorage.getItem('carrito')) || [];
        this.productos = stored; 
        this.listaProductos = listaProductos; 
    }

    agregarProducto(id) {
        this.productos.push(id);
        this.guardarLocalStorage();
    }

    eliminarProducto(id) {
        const index = this.productos.indexOf(id);
        if (index !== -1) {
            this.productos.splice(index, 1);
            this.guardarLocalStorage();
        }
    }

    vaciarCarrito() {
        this.productos = [];
        this.guardarLocalStorage();
    }

    getProductos() {
        // Devuelve objetos producto reales a partir de los IDs
        return this.productos.map(id => 
            this.listaProductos.find(p => p.getId() === id)
        ).filter(p => p !== undefined);
    }

    getTotal() {
        return this.getProductos().reduce((acum, p) => acum + p.getPrecio(), 0);
    }

    guardarLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.productos));
    }
}
