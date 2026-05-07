/**
 * Carga componentes HTML reutilizables (navbar, footer, modals)
 * Detecta si estamos en una subpágina para ajustar rutas
 */

(function () {
    const path = window.location.pathname;
    const isSubpage = path.includes('/pages/') || path.includes('\\pages\\');
    const basePath = isSubpage ? '../' : '';

    const componentes = [
        { id: 'navbar-container', archivo: 'navbar.html' },
        { id: 'footer-container', archivo: 'footer.html' },
        { id: 'modals-container', archivo: 'modals.html' }
    ];

    const containers = componentes.filter(c => document.getElementById(c.id));
    let loaded = 0;

    containers.forEach(comp => {
        const container = document.getElementById(comp.id);
        fetch(`${basePath}components/${comp.archivo}`)
            .then(res => res.text())
            .then(html => {
                if (isSubpage) {
                    html = html.replace(/href="index\.html/g, 'href="../index.html');
                    html = html.replace(/href="pages\//g, 'href="');
                }
                container.innerHTML = html;

                loaded++;
                if (loaded === containers.length) {
                    if (typeof inicializarCarritoUI === 'function') {
                        inicializarCarritoUI();
                    }
                    setActiveNav();
                }
            })
            .catch(err => console.error(`Error cargando ${comp.archivo}:`, err));
    });

    // Marcar link activo en navbar
    function setActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.navbar .nav-link');
        links.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (href.includes(currentPage) || (currentPage === 'index.html' && href.includes('index'))) {
                link.classList.add('active');
            }
        });
    }
})();