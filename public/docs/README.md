# PickPad - Documentación del Sistema

Esta es la documentación completa del sistema de gestión electoral PickPad v3.2.2.

## Estructura de Archivos

```
docs/
├── index.html              # Página principal con navegación
├── styles.css              # Estilos globales del sitio
├── script.js               # Navegación y funcionalidad interactiva
├── content.html            # Secciones introductorias (cargadas dinámicamente)
├── sections.js             # Contenido de secciones generales
├── modules.js              # Documentación de módulos
├── all-content.js          # Carga dinámica de todo el contenido
├── complete-docs.html      # Estructura completa de documentación
└── README.md               # Este archivo
```

## Características

### Navegación
- Menú lateral con todas las secciones organizadas por categorías
- Breadcrumbs para mostrar ubicación actual
- Búsqueda en tiempo real de secciones
- Enlaces internos entre secciones relacionadas
- Menú colapsable en dispositivos móviles

### Contenido
El sitio incluye documentación completa de:

#### Introducción
- ¿Qué es PickPad?
- Roles y Permisos
- Acceso al Sistema
- Instalación PWA
- Glosario de Términos

#### Módulos del Sistema
- **Búsqueda:** Consultas en el padrón electoral
- **Fiscalizar:** Control de asistencia en mesas
- **Mesa Testigo:** Muestreo y resultados
- **Picks:** Seguimiento de votantes clave
- **Estadísticas:** Análisis en tiempo real
- **Control:** Gestión de mesas y fiscales
- **Usuarios:** Administración de cuentas
- **Padrones:** Importación y exportación
- **Configuración:** Ajustes del sistema
- **Perfil:** Configuración personal

#### Guías de Uso
- Preparación Pre-Electoral
- Jornada Electoral (día a día)
- Cierre y Análisis Post-Electoral
- Coordinación de Roles

#### Ayuda
- Preguntas Frecuentes (FAQ)
- Solución de Problemas
- Contacto y Soporte

### Elementos Visuales
- Diagramas de flujo de trabajo
- Mockups de pantallas del sistema
- Tablas comparativas
- Badges de estado
- Cajas informativas (info, warning, success)
- Gráficos explicativos

## Tecnologías

- **HTML5:** Estructura semántica y accesible
- **CSS3:** Diseño responsivo con variables CSS
- **JavaScript (Vanilla):** Funcionalidad sin dependencias externas
- **Diseño:** Mobile-first, adaptable a todos los dispositivos

## Cómo Usar

### Para Visualización Local

1. Abra `index.html` directamente en su navegador
2. Navegue usando el menú lateral
3. Use la búsqueda para encontrar temas específicos
4. Los enlaces funcionan completamente offline

### Para Publicación Web

#### Opción 1: GitHub Pages
```bash
# En el repositorio, vaya a Settings > Pages
# Seleccione la carpeta /docs como source
# GitHub generará automáticamente la URL
```

#### Opción 2: Netlify
```bash
# Arrastre la carpeta docs/ al panel de Netlify
# O conecte su repositorio Git
# Netlify generará la URL automáticamente
```

#### Opción 3: Servidor Web Simple
```bash
# Copie la carpeta docs/ a su servidor web
# Asegúrese que index.html sea accesible
# Configure MIME types si es necesario
```

### Servidor Local de Desarrollo
```bash
# Con Python 3
cd docs
python -m http.server 8000

# Con Node.js (npx)
cd docs
npx serve

# Luego abra http://localhost:8000 en su navegador
```

## Personalización

### Cambiar Colores del Tema

Edite las variables CSS en `styles.css`:

```css
:root {
    --primary: #2563eb;      /* Color principal */
    --success: #10b981;      /* Color de éxito */
    --warning: #f59e0b;      /* Color de advertencia */
    --danger: #ef4444;       /* Color de peligro */
    /* ... más variables */
}
```

### Agregar Nueva Sección

1. Cree el HTML de la sección en `complete-docs.html`
2. Agregue el enlace en el menú de navegación en `index.html`
3. Actualice el objeto `sectionTitles` en `script.js` para breadcrumbs

### Modificar Contenido Existente

Busque la sección en los archivos de contenido:
- Secciones generales: `content.html` o `sections.js`
- Módulos: `modules.js` o `all-content.js`
- Edite el HTML directamente

## Mantenimiento

### Actualizar Versión

1. Actualice el número de versión en:
   - `index.html` (hero section y sidebar)
   - `complete-docs.html` (sección "¿Qué es PickPad?")

2. Actualice la fecha en el footer:
   - `index.html` (footer section)

### Agregar Capturas de Pantalla

Para agregar capturas reales (cuando estén disponibles):

1. Guarde las imágenes en `docs/images/`
2. Reemplace los mockups CSS con tags `<img>`:

```html
<!-- Antes (mockup) -->
<div class="screenshot">
    <div class="screenshot-body">
        <!-- mockup content -->
    </div>
</div>

<!-- Después (imagen real) -->
<div class="screenshot">
    <img src="images/screenshot-busqueda.png" alt="Módulo de Búsqueda">
</div>
```

## Impresión y PDF

El sitio está optimizado para impresión:

1. Use Ctrl+P (Cmd+P en Mac)
2. En opciones de impresión, seleccione:
   - "Guardar como PDF" como destino
   - Incluir gráficos de fondo
   - Márgenes normales

El CSS print oculta automáticamente:
- Menú de navegación
- Barra de búsqueda
- Botones interactivos

## Accesibilidad

El sitio cumple con pautas básicas de accesibilidad:

- Navegación por teclado completa
- Etiquetas ARIA donde corresponde
- Contraste de colores suficiente
- Texto responsive y legible
- Estructura semántica HTML5

## Compatibilidad

### Navegadores Soportados
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

### Dispositivos
- Escritorio (1920x1080 y superiores)
- Laptop (1366x768 y superiores)
- Tablet (768x1024)
- Móvil (375x667 y superiores)

## Licencia

Esta documentación es parte del proyecto PickPad v3.2.2 y está sujeta a los mismos términos de licencia del proyecto principal.

## Soporte

Para preguntas sobre la documentación o el sistema PickPad:
- Consulte la sección "Contacto y Soporte" en el sitio
- Contacte al administrador del sistema
- Revise la sección de Preguntas Frecuentes

---

**Última Actualización:** Marzo 2026
**Versión del Sistema:** 3.2.2
**Versión de Documentación:** 1.0
