/**
 * Carga y renderiza el carrusel desde el JSON
 * Estilo split: texto a la izquierda, imagen/icono a la derecha
 */

(function () {
    const isSubpage = window.location.pathname.includes('/pages/');
    const jsonPath = isSubpage ? '../data/productos.json' : 'data/productos.json';

    fetch(jsonPath)
        .then(res => res.json())
        .then(data => {
            renderCarrusel(data.destacados);
        })
        .catch(err => console.error('Error cargando carrusel:', err));

    function renderCarrusel(destacados) {
        const indicators = document.getElementById('carrusel-indicators');
        const items = document.getElementById('carrusel-items');

        if (!indicators || !items) return;

        indicators.innerHTML = destacados.map((_, i) => `
            <button type="button" data-bs-target="#carruselProductos" data-bs-slide-to="${i}" ${i === 0 ? 'class="active"' : ''}></button>
        `).join('');

        items.innerHTML = destacados.map((prod, i) => {
            const imgContent = prod.imagen
                ? `<img src="${prod.imagen}" alt="${prod.nombre}" class="img-fluid rounded-4" style="max-height: 280px; object-fit: contain;">`
                : `<div class="d-flex align-items-center justify-content-center rounded-4" style="width: 100%; height: 280px; background: linear-gradient(135deg, #1a1f71, #0ea5e9);">
                    <i class="bi ${prod.icono}" style="font-size: 5rem; color: rgba(255,255,255,0.4);"></i>
                   </div>`;

            return `
                <div class="carousel-item ${i === 0 ? 'active' : ''}">
                    <div class="carousel-slide ${prod.colorSlide}">
                        <div class="container">
                            <div class="row align-items-center g-4">
                                <div class="col-md-5">
                                    <span class="section-badge mb-3">FEATURED</span>
                                    <h2>${prod.nombre}</h2>
                                    <p class="text-muted mb-3">${prod.descripcion || ''}</p>
                                    <div class="d-flex align-items-center gap-3">
                                        <span class="fs-3 fw-bold" style="color: var(--navy-dark);">$${prod.precio.toFixed(2)}</span>
                                        <button class="btn btn-primary-custom" onclick="agregarAlCarrito('${prod.nombre}', ${prod.precio})">
                                            <i class="bi bi-cart-plus me-1"></i>Add to Cart
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <div class="slide-img">
                                        ${imgContent}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
})();