/**
 * Carga y renderiza ofertas desde el JSON
 * Click en la card abre modal de detalle
 */

(function () {
    const isSubpage = window.location.pathname.includes('/pages/');
    const jsonPath = isSubpage ? '../data/productos.json' : 'data/productos.json';

    fetch(jsonPath)
        .then(res => res.json())
        .then(data => {
            renderOfertas(data.ofertas);
        })
        .catch(err => console.error('Error cargando ofertas:', err));

    function renderOfertas(ofertas) {
        const grid = document.getElementById('grid-ofertas');
        if (!grid) return;

        grid.innerHTML = ofertas.map(oferta => {
            const mediaContent = oferta.imagen
                ? `<img src="${oferta.imagen}" alt="${oferta.nombre}" style="max-height: 100%; max-width: 100%; object-fit: contain;">`
                : `<i class="bi ${oferta.icono}" style="font-size: 3rem; color: var(--gray-300);"></i>`;

            const prodJson = encodeURIComponent(JSON.stringify(oferta));

            return `
                <div class="col-md-4">
                    <div class="card offer-card h-100 position-relative">
                        <span class="offer-badge">${oferta.descuento}</span>
                        <div class="product-img product-clickable" onclick="verProducto(JSON.parse(decodeURIComponent('${prodJson}')))">
                            ${mediaContent}
                        </div>
                        <div class="card-body">
                            <h5 class="fw-bold mb-1 product-clickable" onclick="verProducto(JSON.parse(decodeURIComponent('${prodJson}')))">${oferta.nombre}</h5>
                            <p class="text-muted small mb-2"><del>$${oferta.precioOriginal.toFixed(2)}</del></p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="price">$${oferta.precio.toFixed(2)}</span>
                                <button class="btn-add" onclick="event.stopPropagation(); agregarAlCarrito('${oferta.nombre}', ${oferta.precio})" aria-label="Agregar al carrito">
                                    <i class="bi bi-cart-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
})();