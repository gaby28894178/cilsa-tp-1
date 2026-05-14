/**
 * Modal de vista de producto
 * Muestra detalle del producto con imagen, descripción, precio y selector de cantidad
 */

let productoModalActual = null;
let cantidadModal = 1;

// Abrir modal de producto
function verProducto(producto) {
    productoModalActual = producto;
    cantidadModal = 1;

    const modalImg = document.getElementById('productoModalImg');
    const modalNombre = document.getElementById('productoModalNombre');
    const modalDesc = document.getElementById('productoModalDesc');
    const modalPrecio = document.getElementById('productoModalPrecio');
    const modalPrecioOld = document.getElementById('productoModalPrecioOld');
    const modalBadge = document.getElementById('productoModalBadge');
    const modalCantidad = document.getElementById('modalCantidad');

    if (!modalImg) return;

    // Imagen o icono
    if (producto.imagen) {
        modalImg.innerHTML = `<img src="${producto.imagen}" alt="${producto.nombre}">`;
    } else {
        modalImg.innerHTML = `<i class="bi ${producto.icono || 'bi-box'}"></i>`;
    }

    // Info
    modalNombre.textContent = producto.nombre;
    modalDesc.textContent = producto.descripcion || 'Producto de alta calidad con garantía extendida.';
    modalPrecio.textContent = `$${producto.precio.toFixed(2)}`;
    modalCantidad.textContent = '1';

    // Badge
    if (producto.categoria) {
        modalBadge.textContent = producto.categoria.toUpperCase();
    } else {
        modalBadge.textContent = 'PRODUCT';
    }

    // Precio original (para ofertas)
    if (producto.precioOriginal) {
        modalPrecioOld.textContent = `$${producto.precioOriginal.toFixed(2)}`;
        modalPrecioOld.classList.remove('d-none');
    } else {
        modalPrecioOld.classList.add('d-none');
    }

    // Abrir modal
    const modal = new bootstrap.Modal(document.getElementById('productoModal'));
    modal.show();
}

// Cambiar cantidad en el modal
function cambiarCantidadModal(delta) {
    cantidadModal = Math.max(1, cantidadModal + delta);
    const el = document.getElementById('modalCantidad');
    if (el) el.textContent = cantidadModal;
}

// Agregar al carrito desde el modal
function agregarDesdeModal() {
    if (!productoModalActual) return;

    for (let i = 0; i < cantidadModal; i++) {
        agregarAlCarrito(productoModalActual.nombre, productoModalActual.precio);
    }

    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('productoModal'));
    if (modal) modal.hide();
}

// Comprar ahora (agregar y abrir carrito)
function comprarAhoraModal() {
    if (!productoModalActual) return;

    for (let i = 0; i < cantidadModal; i++) {
        agregarAlCarrito(productoModalActual.nombre, productoModalActual.precio);
    }

    // Cerrar modal de producto
    const prodModal = bootstrap.Modal.getInstance(document.getElementById('productoModal'));
    if (prodModal) prodModal.hide();

    // Abrir carrito después de un breve delay
    setTimeout(() => {
        actualizarVistaCarrito();
        const compraModal = new bootstrap.Modal(document.getElementById('compraModal'));
        compraModal.show();
    }, 300);
}