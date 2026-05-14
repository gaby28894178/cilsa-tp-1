/**
 * Módulo del carrito de compras
 * Maneja agregar, eliminar, vaciar y finalizar compra
 * Usa localStorage para persistir entre páginas
 */

// Cargar carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem('shopcolor_carrito')) || [];

// Guardar carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('shopcolor_carrito', JSON.stringify(carrito));
}

// Inicializar UI del carrito (se llama despues de cargar navbar)
function inicializarCarritoUI() {
    const btnCarrito = document.getElementById('btnCarrito');
    if (btnCarrito) {
        btnCarrito.addEventListener('click', function () {
            actualizarVistaCarrito();
            const compraModal = new bootstrap.Modal(document.getElementById('compraModal'));
            compraModal.show();
        });
    }
    actualizarContador();

    // Formulario de registro
    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', function (e) {
            e.preventDefault();
            const nombre = document.getElementById('regNombre').value;
            const password = document.getElementById('regPassword').value;
            const password2 = document.getElementById('regPassword2').value;

            if (password !== password2) {
                mostrarToast('Las contrasenas no coinciden', 'warning');
                return;
            }

            mostrarToast('Bienvenido ' + nombre + '! Registro exitoso', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('registroModal'));
            modal.hide();
            this.reset();
        });
    }
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
    const productoExistente = carrito.find(item => item.nombre === nombre);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }

    guardarCarrito();
    actualizarContador();
    mostrarToast(nombre + ' agregado al carrito');
}

// Actualizar contador del carrito
function actualizarContador() {
    const contadorCarrito = document.getElementById('contadorCarrito');
    if (contadorCarrito) {
        const total = carrito.reduce((sum, item) => sum + item.cantidad, 0);
        contadorCarrito.textContent = total;
    }
}

// Actualizar vista del carrito en el modal
function actualizarVistaCarrito() {
    const listaCarrito = document.getElementById('listaCarrito');
    const totalCarrito = document.getElementById('totalCarrito');

    if (!listaCarrito || !totalCarrito) return;

    if (carrito.length === 0) {
        listaCarrito.innerHTML = '<p class="text-center text-muted py-4"><i class="bi bi-cart-x fs-1 d-block mb-2"></i>Tu carrito esta vacio</p>';
        totalCarrito.textContent = '$0.00';
        return;
    }

    let html = '';
    let total = 0;

    carrito.forEach((item, index) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        html += '<div class="carrito-item">' +
            '<div>' +
            '<h6 class="mb-0 fw-bold">' + item.nombre + '</h6>' +
            '<small class="text-muted">$' + item.precio.toFixed(2) + ' x ' + item.cantidad + '</small>' +
            '</div>' +
            '<div class="d-flex align-items-center gap-2">' +
            '<span class="fw-bold text-purple">$' + subtotal.toFixed(2) + '</span>' +
            '<button class="btn btn-sm btn-outline-danger" onclick="eliminarDelCarrito(' + index + ')">' +
            '<i class="bi bi-x-lg"></i>' +
            '</button>' +
            '</div>' +
            '</div>';
    });

    listaCarrito.innerHTML = html;
    totalCarrito.textContent = '$' + total.toFixed(2);
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
    const item = carrito[index];
    if (item.cantidad > 1) {
        item.cantidad--;
    } else {
        carrito.splice(index, 1);
    }
    guardarCarrito();
    actualizarContador();
    actualizarVistaCarrito();
}

// Vaciar carrito
function vaciarCarrito() {
    carrito = [];
    guardarCarrito();
    actualizarContador();
    actualizarVistaCarrito();
    mostrarToast('Carrito vaciado');
}

// Finalizar compra
function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarToast('Tu carrito esta vacio', 'warning');
        return;
    }

    const total = carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);

    carrito = [];
    guardarCarrito();
    actualizarContador();
    actualizarVistaCarrito();

    const compraModal = bootstrap.Modal.getInstance(document.getElementById('compraModal'));
    if (compraModal) compraModal.hide();

    mostrarToast('Compra realizada! Total: $' + total.toFixed(2), 'success');
}

// Mostrar toast de notificacion
function mostrarToast(mensaje, tipo) {
    tipo = tipo || 'success';
    const toastEl = document.getElementById('toastNotificacion');
    const toastMensaje = document.getElementById('toastMensaje');

    if (!toastEl || !toastMensaje) return;

    toastMensaje.textContent = mensaje;
    toastEl.className = 'toast align-items-center text-bg-' + tipo + ' border-0';
    const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
    toast.show();
}