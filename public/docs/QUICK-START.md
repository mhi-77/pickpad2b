# Inicio Rápido - Documentación PickPad

Esta guía le ayudará a visualizar y usar la documentación de PickPad rápidamente.

## Visualización Local

### Método 1: Abrir Directamente (Más Simple)

1. Navegue a la carpeta `docs/`
2. Haga doble clic en `index.html`
3. Se abrirá en su navegador predeterminado

**Ventaja:** No requiere instalación
**Limitación:** Algunas funciones pueden no cargar correctamente dependiendo del navegador

### Método 2: Servidor HTTP Local (Recomendado)

#### Con Python 3
```bash
cd docs
python -m http.server 8000
```

Luego abra: `http://localhost:8000`

#### Con Python 2
```bash
cd docs
python -m SimpleHTTPServer 8000
```

#### Con Node.js (npx)
```bash
cd docs
npx serve
```

#### Con PHP
```bash
cd docs
php -S localhost:8000
```

**Ventaja:** Funciona exactamente como en producción

## Navegación Básica

### Menú Lateral

El menú está organizado en 4 secciones principales:

1. **Introducción**
   - Información general del sistema
   - Roles y permisos
   - Guías de instalación

2. **Módulos**
   - Documentación detallada de cada módulo
   - Búsqueda, Fiscalizar, Picks, etc.

3. **Guías de Uso**
   - Flujos de trabajo completos
   - Preparación pre-electoral
   - Jornada electoral
   - Análisis post-electoral

4. **Ayuda**
   - Preguntas frecuentes
   - Solución de problemas
   - Contacto

### Búsqueda

Use el campo de búsqueda en la parte superior del menú para encontrar secciones específicas:

- Escriba palabras clave como "fiscalizar", "picks", "usuario"
- El menú se filtra en tiempo real
- Haga clic en la sección encontrada para navegarla

### Breadcrumbs

La barra superior muestra su ubicación actual:
```
Inicio › Módulos › Búsqueda
```

Use esto para saber dónde está en la documentación.

## Características Principales

### Responsive Design

La documentación se adapta a cualquier dispositivo:

- **Escritorio:** Menú lateral fijo, contenido amplio
- **Tablet:** Menú colapsable, layout optimizado
- **Móvil:** Menú hamburguesa, diseño vertical

### Impresión y PDF

Para guardar una sección como PDF:

1. Navegue a la sección deseada
2. Presione `Ctrl+P` (Windows) o `Cmd+P` (Mac)
3. Seleccione "Guardar como PDF"
4. El menú y elementos innecesarios se ocultan automáticamente

### Enlaces Internos

Los enlaces azules llevan a otras secciones relacionadas:
- Haga clic para navegar
- Use el botón "Atrás" del navegador para volver

## Estructura del Contenido

### Por Nivel de Usuario

Si es nuevo, lea en este orden según su rol:

**Fiscal (Nivel 4):**
1. ¿Qué es PickPad?
2. Roles y Permisos
3. Acceso al Sistema
4. Instalación PWA
5. Módulo: Búsqueda
6. Módulo: Fiscalizar
7. Módulo: Picks (solo propios)
8. Guía: Jornada Electoral

**Coordinador (Nivel 3):**
- Todo lo anterior, más:
- Módulo: Estadísticas
- Módulo: Mesa Testigo
- Guía: Coordinación de Roles
- Guía: Análisis Post-Electoral

**Administrador (Niveles 1-2):**
- Todo lo anterior, más:
- Módulo: Control
- Módulo: Usuarios
- Módulo: Padrones
- Módulo: Configuración
- Guía: Preparación Pre-Electoral

### Por Tarea

**Primera vez usando el sistema:**
1. ¿Qué es PickPad?
2. Acceso al Sistema
3. Instalación PWA
4. Glosario (términos importantes)

**Día de elección:**
1. Módulo: Fiscalizar
2. Guía: Jornada Electoral
3. FAQ > Problemas durante votación

**Configuración inicial:**
1. Módulo: Configuración
2. Módulo: Padrones > Importar
3. Módulo: Usuarios > Altas
4. Módulo: Control > Asignación

**Análisis de resultados:**
1. Módulo: Estadísticas
2. Módulo: Padrones > Exportar
3. Guía: Análisis Post-Electoral

## Tips de Uso

### 1. Use Ctrl+F

La búsqueda del navegador (Ctrl+F / Cmd+F) funciona en toda la página visible:
- Busque términos específicos
- Navegue entre coincidencias

### 2. Marcadores

Agregue secciones importantes a favoritos:
- Haga clic derecho > "Agregar a marcadores"
- La URL incluye el ID de sección (ej: `#modulo-fiscalizar`)

### 3. Compartir Secciones

Copie la URL completa para compartir una sección específica:
```
https://docs.pickpad.com/#modulo-busqueda
```

### 4. Modo Oscuro

Actualmente no implementado, pero puede usar extensiones del navegador:
- Dark Reader (Chrome/Firefox)
- Night Eye
- Turn Off the Lights

## Problemas Comunes

### El menú no se muestra

**Solución:**
1. Verifique que JavaScript está habilitado
2. Refresque la página (F5)
3. Use un navegador moderno (Chrome, Firefox, Edge)

### Los estilos no cargan

**Solución:**
1. Verifique que `styles.css` existe en la carpeta `docs/`
2. Abra la consola del navegador (F12) para ver errores
3. Use un servidor HTTP local en lugar de abrir el archivo directamente

### Búsqueda no funciona

**Solución:**
1. Verifique que `script.js` se cargó correctamente
2. Refresque la página
3. Intente con otro navegador

### Página en blanco

**Solución:**
1. Verifique que todos los archivos están en `docs/`
2. Revise permisos de archivos
3. Abra consola del navegador para ver errores específicos

## Atajos de Teclado

El sitio no tiene atajos específicos, pero puede usar los estándar del navegador:

- `Ctrl+F` / `Cmd+F`: Buscar en página
- `Ctrl+P` / `Cmd+P`: Imprimir/guardar PDF
- `Backspace`: Página anterior
- `F5` / `Ctrl+R`: Recargar
- `F11`: Pantalla completa
- `Tab`: Navegar entre enlaces

## Próximos Pasos

Una vez familiarizado con la documentación:

1. **Explore todos los módulos** relevantes a su rol
2. **Lea las guías de flujo de trabajo** completas
3. **Revise la sección de ayuda** para problemas comunes
4. **Practique en el sistema real** aplicando lo aprendido
5. **Consulte esta documentación** cuando tenga dudas

## Feedback y Mejoras

Si encuentra:
- Errores o información desactualizada
- Secciones que necesitan más detalle
- Problemas técnicos del sitio
- Sugerencias de mejora

Contacte al administrador del sistema o envíe feedback según los canales establecidos en su organización.

## Recursos Adicionales

- **README.md**: Información técnica del sitio
- **DEPLOYMENT.md**: Guía para publicar la documentación
- **Código fuente**: Disponible en `docs/` para personalización

---

**Disfrute explorando la documentación de PickPad v3.2.2**

Para comenzar ahora, abra `index.html` o ejecute:
```bash
cd docs && python -m http.server 8000
```
