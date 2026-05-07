/**
 * Carga y renderiza productos y categorías desde el JSON
 * Si el producto tiene imagen (url o path), la muestra
 * Si no tiene imagen, muestra el icono de Bootstrap Icons
 */

(function () {
    const isSubpage = window.location.pathname.includes('/pages/');
    const jsonPath = isSubpage ? '../data/productos.json' : 'data/productos.json';

    fetch(jsonPath)
        .then(res => res.json())
        .then(data => {
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

            return `
                <div class="col-6 col-md-6 col-lg-4">
                    <div class="card product-card h-100">
                        <div class="product-img">
                            ${mediaContent}
                            ${badgeHtml}
                        </div>
                        <div class="card-body">
                            <h6 class="card-title">${producto.nombre}</h6>
                            <p class="card-text">${producto.descripcion}</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="price">$${producto.precio.toFixed(2)}</span>
                                <button class="btn-add" onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio})" aria-label="Agregar al carrito">
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

        // Click en categorías
        list.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                list.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                e.target.classList.add('active');
            }
        });
    }
})();