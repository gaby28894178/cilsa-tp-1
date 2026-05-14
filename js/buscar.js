/**
 * Módulo de búsqueda de productos
 * Abre un overlay con input y busca en el JSON de productos
 */

(function () {
    const isSubpage = window.location.pathname.includes('/pages/');
    const jsonPath = isSubpage ? '../data/productos.json' : 'data/productos.json';

    let productosData = [];

    // Cargar datos para búsqueda
    fetch(jsonPath)
        .then(res => res.json())
        .then(data => {
            productosData = [
                ...data.productos,
                ...data.destacados,
                ...data.ofertas
            ];
        })
        .catch(err => console.error('Error cargando datos para búsqueda:', err));

    // Esperar a que se carguen los componentes
    function initBusqueda() {
        const btnBuscar = document.getElementById('btnBuscar');
        const overlay = document.getElementById('searchOverlay');
        const input = document.getElementById('searchInput');
        const btnCerrar = document.getElementById('btnCerrarBusqueda');
        const results = document.getElementById('searchResults');

        if (!btnBuscar || !overlay) {
            // Reintentar si los componentes aún no se cargaron
            setTimeout(initBusqueda, 200);
            return;
        }

        // Abrir búsqueda
        btnBuscar.addEventListener('click', function () {
            overlay.classList.add('active');
            setTimeout(() => input.focus(), 100);
        });

        // Cerrar búsqueda
        btnCerrar.addEventListener('click', cerrarBusqueda);

        // Cerrar con Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                cerrarBusqueda();
            }
        });

        // Cerrar al hacer click fuera
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay || e.target === overlay.querySelector('.search-overlay-content')) {
                cerrarBusqueda();
            }
        });

        // Buscar mientras escribe
        input.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();

            if (query.length < 2) {
                results.innerHTML = '';
                return;
            }

            const filtrados = productosData.filter(p =>
                p.nombre.toLowerCase().includes(query) ||
                (p.descripcion && p.descripcion.toLowerCase().includes(query))
            );

            if (filtrados.length === 0) {
                results.innerHTML = `
                    <div class="search-no-results">
                        <i class="bi bi-search"></i>
                        <p>No se encontraron productos para "<strong>${query}</strong>"</p>
                    </div>
                `;
                return;
            }

            results.innerHTML = filtrados.slice(0, 6).map(p => `
                <div class="search-result-item" onclick="agregarAlCarrito('${p.nombre}', ${p.precio}); cerrarBusqueda();">
                    <div class="result-icon">
                        <i class="bi ${p.icono || 'bi-box'}"></i>
                    </div>
                    <div class="result-info">
                        <h6>${p.nombre}</h6>
                        <p>${p.descripcion || ''}</p>
                    </div>
                    <span class="result-price">$${p.precio.toFixed(2)}</span>
                </div>
            `).join('');
        });

        function cerrarBusqueda() {
            overlay.classList.remove('active');
            input.value = '';
            results.innerHTML = '';
        }

        // Hacer cerrarBusqueda global para usarla desde onclick
        window.cerrarBusqueda = cerrarBusqueda;
    }

    // Iniciar después de un delay para que los componentes se carguen
    setTimeout(initBusqueda, 500);
})();