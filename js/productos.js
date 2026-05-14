/**
 * Carga y renderiza productos y categorías desde el JSON
 * Si el producto tiene imagen (url o path), la muestra
 * Si no tiene imagen, muestra el icono de Bootstrap Icons
 * Click en la card abre modal de detalle del producto
 */

// Almacenar productos globalmente para acceder desde el modal
window._productosData = [];

(function () {
    const isSubpage = window.location.pathname.includes('/pages/');
    const jsonPath = isSubpage ? '../data/productos.json' : 'data/productos.json';

    fetch(jsonPath)
        .then(res => res.json())
        .then(data => {
            window._productosData = data.productos;
            renderProductos(data.productos);
            renderCategorias(data.categorias);
        })
        .catch(err => console.error('Error cargando productos:', err));

    function renderProductos(productos) {
        const grid = document.getElementById('grid-productos');
        if (!grid) return;

        grid.innerHTML = productos.map((producto, index) => {
            const mediaContent = producto.imagen
                ? `<img src="${producto.imagen}" alt="${producto.nombre}">`
                : `<i class="bi ${producto.icono}"></i>`;

            // Asignar badges rotativos
            const badges = ['badge-new', 'badge-best', 'badge-offer'];
            const badgeLabels = ['NEW', 'BEST SELLER', 'OFFER'];
            const badgeIndex = index % 3;
            const badgeHtml = index < 6
                ? `<span class="product-badge ${badges[badgeIndex]}">${badgeLabels[badgeIndex]}</span>`
                : '';

            // Escapar datos para el onclick
            const prodJson = encodeURIComponent(JSON.stringify(producto));

            return `
                <div class="col-6 col-md-6 col-lg-4">
                    <div class="card product-card h-100">
                        <div class="product-img product-clickable" onclick="verProducto(JSON.parse(decodeURIComponent('${prodJson}')))">
                            ${mediaContent}
                            ${badgeHtml}
                        </div>
                        <div class="card-body">
                            <h6 class="card-title product-clickable" onclick="verProducto(JSON.parse(decodeURIComponent('${prodJson}')))">${producto.nombre}</h6>
                            <p class="card-text">${producto.descripcion}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="price">$${producto.precio.toFixed(2)}</span>
                                <button class="btn-add" onclick="event.stopPropagation(); agregarAlCarrito('${producto.nombre}', ${producto.precio})" aria-label="Agregar al carrito">
                                    <i class="bi bi-cart-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderCategorias(categorias) {
        const list = document.getElementById('categories-list');
        if (!list || !categorias) return;

        const items = categorias.map(cat => `
            <li><a href="#" data-category="${cat.id}">${cat.nombre}</a></li>
        `).join('');

        list.innerHTML = `<li><a href="#" class="active" data-category="all">All</a></li>${items}`;

        // Click en categorías - filtrar productos
        list.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                list.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                e.target.classList.add('active');

                const category = e.target.dataset.category;
                const grid = document.getElementById('grid-productos');
                if (!grid) return;

                if (category === 'all') {
                    renderProductos(window._productosData);
                } else {
                    const filtrados = window._productosData.filter(p => p.categoria === category);
                    renderProductos(filtrados);
                }
            }
        });
    }
})();