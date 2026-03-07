let navigationInitialized = false;

function initializeNavigation() {
    if (navigationInitialized) return;
    navigationInitialized = true;

    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const breadcrumb = document.getElementById('breadcrumb');
    const searchInput = document.getElementById('searchInput');

    // Mapa de sección padre → primer ítem de esa sección (para el link del breadcrumb)
    const sectionParents = {
        'que-es':            { label: 'Introducción', target: 'que-es' },
        'roles':             { label: 'Introducción', target: 'que-es' },
        'acceso':            { label: 'Introducción', target: 'que-es' },
        'instalacion-pwa':   { label: 'Introducción', target: 'que-es' },
        'glosario':          { label: 'Introducción', target: 'que-es' },
        'modulo-busqueda':   { label: 'Módulos', target: 'modulo-busqueda' },
        'modulo-fiscalizar': { label: 'Módulos', target: 'modulo-busqueda' },
        'modulo-testigo':    { label: 'Módulos', target: 'modulo-busqueda' },
        'modulo-picks':      { label: 'Módulos', target: 'modulo-busqueda' },
        'modulo-estadisticas':{ label: 'Módulos', target: 'modulo-busqueda' },
        'modulo-control':    { label: 'Módulos', target: 'modulo-busqueda' },
        'modulo-usuarios':   { label: 'Módulos', target: 'modulo-busqueda' },
        'modulo-padrones':   { label: 'Módulos', target: 'modulo-busqueda' },
        'modulo-configuracion':{ label: 'Módulos', target: 'modulo-busqueda' },
        'modulo-perfil':     { label: 'Módulos', target: 'modulo-busqueda' },
        'flujo-preelectoral':{ label: 'Guías de Uso', target: 'flujo-preelectoral' },
        'flujo-jornada':     { label: 'Guías de Uso', target: 'flujo-preelectoral' },
        'flujo-postelectoral':{ label: 'Guías de Uso', target: 'flujo-preelectoral' },
        'coordinacion':      { label: 'Guías de Uso', target: 'flujo-preelectoral' },
        'faq':               { label: 'Ayuda', target: 'faq' },
        'troubleshooting':   { label: 'Ayuda', target: 'faq' },
        'soporte':           { label: 'Ayuda', target: 'faq' },
    };

    const sectionTitles = {
        'inicio': 'Inicio',
        'que-es': '¿Qué es PickPad?',
        'roles': 'Roles y Permisos',
        'acceso': 'Acceso al Sistema',
        'instalacion-pwa': 'Instalación PWA',
        'glosario': 'Glosario',
        'modulo-busqueda': 'Búsqueda',
        'modulo-fiscalizar': 'Fiscalizar',
        'modulo-testigo': 'Mesa Testigo',
        'modulo-picks': 'Picks',
        'modulo-estadisticas': 'Estadísticas',
        'modulo-control': 'Control',
        'modulo-usuarios': 'Usuarios',
        'modulo-padrones': 'Padrones',
        'modulo-configuracion': 'Configuración',
        'modulo-perfil': 'Perfil',
        'flujo-preelectoral': 'Preparación Pre-Electoral',
        'flujo-jornada': 'Jornada Electoral',
        'flujo-postelectoral': 'Cierre y Análisis',
        'coordinacion': 'Coordinación de Roles',
        'faq': 'Preguntas Frecuentes',
        'troubleshooting': 'Solución de Problemas',
        'soporte': 'Contacto y Soporte'
    };

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
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));

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
        const pageTitle = sectionTitles[sectionId] || sectionId;
        const parent = sectionParents[sectionId];

        let html = '<a href="#inicio" class="bc-link">Inicio</a>';

        if (parent) {
            html += ' <span>›</span> <a href="#' + parent.target + '" class="bc-link">' + parent.label + '</a>';
            // Solo mostrar el título de la página si es distinto al label del padre
            if (parent.target !== sectionId) {
                html += ' <span>›</span> <span>' + pageTitle + '</span>';
            }
        } else if (sectionId !== 'inicio') {
            html += ' <span>›</span> <span>' + pageTitle + '</span>';
        }

        breadcrumb.innerHTML = html;

        // Agregar listeners a los links del breadcrumb
        breadcrumb.querySelectorAll('.bc-link').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href').substring(1);
                showSection(target);
                history.pushState(null, null, '#' + target);
            });
        });
    }

    document.querySelectorAll('.nav-item').forEach(item => {
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
            document.querySelectorAll('.nav-item').forEach(item => { item.style.display = 'block'; });
            document.querySelectorAll('.nav-section').forEach(section => { section.style.display = 'block'; });
            return;
        }

        document.querySelectorAll('.nav-item').forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });

        document.querySelectorAll('.nav-section').forEach(section => {
            const visibleItems = section.querySelectorAll('.nav-item[style="display: block"], .nav-item:not([style])');
            section.style.display = visibleItems.length === 0 ? 'none' : 'block';
        });
    });

    document.querySelectorAll('.feature-link, .btn-secondary, a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
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
        initializeNavigation();
    }, 500);
});