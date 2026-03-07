function initializeNavigation() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const breadcrumb = document.getElementById('breadcrumb');
    const searchInput = document.getElementById('searchInput');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 &&
            !sidebar.contains(e.target) &&
            !menuToggle.contains(e.target) &&
            sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    });

    function showSection(sectionId) {
        sections.forEach(section => section.classList.remove('active'));
        navItems.forEach(item => item.classList.remove('active'));

        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');

            const activeNavItem = document.querySelector(`.nav-item[href="#${sectionId}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }

            updateBreadcrumb(sectionId);

            window.scrollTo({ top: 0, behavior: 'smooth' });

            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        }
    }

    function updateBreadcrumb(sectionId) {
        const sectionTitles = {
            'inicio': 'Inicio',
            'que-es': 'Introducción / ¿Qué es PickPad?',
            'roles': 'Introducción / Roles y Permisos',
            'acceso': 'Introducción / Acceso al Sistema',
            'instalacion-pwa': 'Introducción / Instalación PWA',
            'glosario': 'Introducción / Glosario',
            'modulo-busqueda': 'Módulos / Búsqueda',
            'modulo-fiscalizar': 'Módulos / Fiscalizar',
            'modulo-testigo': 'Módulos / Mesa Testigo',
            'modulo-picks': 'Módulos / Picks',
            'modulo-estadisticas': 'Módulos / Estadísticas',
            'modulo-control': 'Módulos / Control',
            'modulo-usuarios': 'Módulos / Usuarios',
            'modulo-padrones': 'Módulos / Padrones',
            'modulo-configuracion': 'Módulos / Configuración',
            'modulo-perfil': 'Módulos / Perfil',
            'flujo-preelectoral': 'Guías de Uso / Preparación Pre-Electoral',
            'flujo-jornada': 'Guías de Uso / Jornada Electoral',
            'flujo-postelectoral': 'Guías de Uso / Cierre y Análisis',
            'coordinacion': 'Guías de Uso / Coordinación de Roles',
            'faq': 'Ayuda / Preguntas Frecuentes',
            'troubleshooting': 'Ayuda / Solución de Problemas',
            'soporte': 'Ayuda / Contacto y Soporte'
        };

        const title = sectionTitles[sectionId] || 'Inicio';
        const parts = title.split(' / ');

        let html = '<a href="#inicio">Inicio</a>';
        if (parts.length > 1) {
            html += ' <span>›</span> <span>' + parts.join(' <span>›</span> ') + '</span>';
        } else if (sectionId !== 'inicio') {
            html += ' <span>›</span> <span>' + title + '</span>';
        }

        breadcrumb.innerHTML = html;
    }

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const sectionId = href.substring(1);
            showSection(sectionId);
            history.pushState(null, null, href);
        });
    });

    window.addEventListener('popstate', function() {
        const hash = window.location.hash.substring(1) || 'inicio';
        showSection(hash);
    });

    const initialHash = window.location.hash.substring(1) || 'inicio';
    showSection(initialHash);

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();

        if (searchTerm.length === 0) {
            navItems.forEach(item => {
                item.style.display = 'block';
            });
            document.querySelectorAll('.nav-section').forEach(section => {
                section.style.display = 'block';
            });
            return;
        }

        navItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });

        document.querySelectorAll('.nav-section').forEach(section => {
            const visibleItems = section.querySelectorAll('.nav-item[style="display: block"], .nav-item:not([style])');
            if (visibleItems.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });
    });

    document.querySelectorAll('.feature-link, .btn-secondary, a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const sectionId = href.substring(1);
                showSection(sectionId);
                history.pushState(null, null, href);
            }
        });
    });
}

document.addEventListener('contentLoaded', function() {
    initializeNavigation();
});

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (document.querySelectorAll('.section').length > 1) {
            initializeNavigation();
        }
    }, 500);
});
