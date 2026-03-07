// This file will be dynamically loaded to inject all documentation content
// It keeps the main index.html clean and maintainable

function loadAllSections() {
    const content = document.getElementById('content');

    // Load the content.html sections that were already created
    fetch('content.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const sections = doc.querySelectorAll('section');

            sections.forEach(section => {
                content.appendChild(section.cloneNode(true));
            });

            // Now add remaining module sections
            addModuleSections();
            addWorkflowSections();
            addHelpSections();
        })
        .catch(err => console.error('Error loading content:', err));
}

function addModuleSections() {
    const content = document.getElementById('content');

    // Module sections will be added here
    // Each module follows the same structure

    const moduleIds = [
        'modulo-testigo',
        'modulo-picks',
        'modulo-estadisticas',
        'modulo-control',
        'modulo-usuarios',
        'modulo-padrones',
        'modulo-configuracion',
        'modulo-perfil'
    ];

    moduleIds.forEach(id => {
        const section = document.createElement('section');
        section.id = id;
        section.className = 'section';
        section.innerHTML = getModuleContent(id);
        content.appendChild(section);
    });
}

function addWorkflowSections() {
    const content = document.getElementById('content');

    const workflowIds = [
        'flujo-preelectoral',
        'flujo-jornada',
        'flujo-postelectoral',
        'coordinacion'
    ];

    workflowIds.forEach(id => {
        const section = document.createElement('section');
        section.id = id;
        section.className = 'section';
        section.innerHTML = getWorkflowContent(id);
        content.appendChild(section);
    });
}

function addHelpSections() {
    const content = document.getElementById('content');

    const helpIds = ['faq', 'troubleshooting', 'soporte'];

    helpIds.forEach(id => {
        const section = document.createElement('section');
        section.id = id;
        section.className = 'section';
        section.innerHTML = getHelpContent(id);
        content.appendChild(section);
    });
}

function getModuleContent(id) {
    const modules = {
        'modulo-testigo': `
            <div class="doc-section">
                <h2>Módulo: Mesa Testigo</h2>

                <div class="info-box warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                        <strong>Funcionalidad Configurable</strong>
                        <p>Este módulo puede estar deshabilitado según la configuración del sistema. Consulte con su administrador.</p>
                    </div>
                </div>

                <h3>Descripción General</h3>
                <p>El módulo de Mesa Testigo permite realizar muestreos estadísticos sobre mesas seleccionadas estratégicamente para obtener proyecciones tempranas de resultados electorales.</p>

                <h3>Permisos de Acceso</h3>
                <ul>
                    <li><strong>Niveles 1-2:</strong> Acceso a "Resultados" para ver datos consolidados</li>
                    <li><strong>Niveles 3-4:</strong> Acceso a "Muestreo" para cargar datos de mesas testigo</li>
                    <li><strong>Nivel 5:</strong> Sin acceso</li>
                </ul>

                <h3>Subsección: Muestreo</h3>

                <p>La subsección de Muestreo permite a fiscales designados registrar datos específicos de mesas testigo durante el recuento de votos:</p>

                <h4>¿Qué es una Mesa Testigo?</h4>
                <p>Una mesa testigo es una mesa electoral seleccionada por su representatividad estadística. Los resultados de estas mesas permiten proyectar tendencias generales con mayor precisión.</p>

                <h4>Proceso de Muestreo</h4>
                <ol>
                    <li>El fiscal accede al módulo Mesa Testigo</li>
                    <li>Selecciona la opción "Muestreo"</li>
                    <li>Identifica su mesa testigo asignada</li>
                    <li>Ingresa los datos del recuento cuando esté disponible</li>
                    <li>Registra votos por agrupación política</li>
                    <li>Confirma y envía los datos al sistema</li>
                </ol>

                <div class="info-box info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <div>
                        <strong>Momento de Uso</strong>
                        <p>El muestreo se realiza DESPUÉS del cierre de votación, durante el recuento oficial de votos en la mesa.</p>
                    </div>
                </div>

                <h3>Subsección: Resultados</h3>

                <p>La subsección de Resultados muestra los datos consolidados de todas las mesas testigo:</p>

                <h4>Información Disponible</h4>
                <ul>
                    <li>Totales por agrupación política</li>
                    <li>Porcentajes sobre votos válidos</li>
                    <li>Cantidad de mesas testigo reportadas</li>
                    <li>Gráficos comparativos</li>
                    <li>Tendencias por zona o circuito</li>
                </ul>

                <h4>Interpretación de Datos</h4>
                <p>Los resultados son proyecciones basadas en la muestra, no resultados oficiales. Deben usarse con precaución y siempre indicando que son estimaciones preliminares.</p>

                <h3>Mejores Prácticas</h3>
                <ul>
                    <li>Verifique los datos antes de confirmar el envío</li>
                    <li>Registre los números exactos del acta oficial</li>
                    <li>No invente o estime datos; espere el recuento real</li>
                    <li>Reporte inmediatamente cualquier irregularidad</li>
                    <li>Mantenga confidencialidad hasta el cierre oficial</li>
                </ul>
            </div>
        `,

        'modulo-picks': `
            <div class="doc-section">
                <h2>Módulo: Picks</h2>

                <div class="info-box info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <div>
                        <strong>Acceso por Niveles</strong>
                        <p>Nivel 1-2: Todos los picks. Nivel 3: Todos los picks (solo lectura avanzada). Nivel 4: Solo propios. Nivel 5: Sin acceso.</p>
                    </div>
                </div>

                <h3>¿Qué son los Picks?</h3>
                <p>Un "pick" es una marca especial sobre un votante específico que lo identifica como persona de interés. Los picks permiten hacer seguimiento personalizado de votantes clave para la organización electoral.</p>

                <h3>Conceptos Clave</h3>

                <h4>EmoPick (Clasificación Emocional)</h4>
                <p>Cada pick puede tener una clasificación emocional que indica la predisposición del votante:</p>

                <ul>
                    <li><strong>😊 Muy Feliz:</strong> Votante muy comprometido y entusiasta</li>
                    <li><strong>🙂 Feliz:</strong> Votante comprometido</li>
                    <li><strong>😐 Neutral:</strong> Votante indeciso o sin clasificar</li>
                    <li><strong>😕 Triste:</strong> Votante poco comprometido</li>
                    <li><strong>😢 Muy Triste:</strong> Votante muy poco comprometido</li>
                </ul>

                <h4>Verificación de Picks</h4>
                <p>Un pick puede ser "verificado" por usuarios de nivel 1-3, indicando que la información fue revisada y confirmada. Los picks verificados tienen una marca especial y registran:</p>
                <ul>
                    <li>Usuario que verificó</li>
                    <li>Fecha y hora de verificación</li>
                    <li>Estado bloqueado contra ediciones accidentales</li>
                </ul>

                <h3>Funcionalidades del Módulo</h3>

                <h4>1. Visualización de Picks</h4>
                <p>La tabla muestra todos los picks con la siguiente información:</p>

                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Columna</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Documento</strong></td>
                                <td>Número de documento del votante</td>
                            </tr>
                            <tr>
                                <td><strong>Apellido y Nombre</strong></td>
                                <td>Nombre completo del votante</td>
                            </tr>
                            <tr>
                                <td><strong>Mesa</strong></td>
                                <td>Mesa electoral asignada</td>
                            </tr>
                            <tr>
                                <td><strong>Localidad</strong></td>
                                <td>Localidad de votación</td>
                            </tr>
                            <tr>
                                <td><strong>EmoPick</strong></td>
                                <td>Emoticono indicando clasificación</td>
                            </tr>
                            <tr>
                                <td><strong>Votó</strong></td>
                                <td>Estado de votación actual</td>
                            </tr>
                            <tr>
                                <td><strong>Usuario Pick</strong></td>
                                <td>Quién creó el pick</td>
                            </tr>
                            <tr>
                                <td><strong>Verificado</strong></td>
                                <td>Si fue verificado y por quién</td>
                            </tr>
                            <tr>
                                <td><strong>Acciones</strong></td>
                                <td>Botones para editar o eliminar</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h4>2. Filtros Disponibles</h4>

                <p>Refine la lista de picks usando los siguientes filtros:</p>

                <ul>
                    <li><strong>Usuario:</strong> Ver picks de un usuario específico</li>
                    <li><strong>EmoPick:</strong> Filtrar por clasificación emocional</li>
                    <li><strong>Estado de Votación:</strong> Solo los que votaron o no votaron</li>
                    <li><strong>Verificación:</strong> Solo verificados o no verificados</li>
                    <li><strong>Mesa:</strong> Picks de una mesa específica</li>
                    <li><strong>Localidad:</strong> Picks de una localidad</li>
                </ul>

                <div class="screenshot">
                    <div class="screenshot-header">
                        <div class="screenshot-dot"></div>
                        <div class="screenshot-dot"></div>
                        <div class="screenshot-dot"></div>
                    </div>
                    <div class="screenshot-body">
                        <div>
                            <h3 style="margin-bottom: 1rem;">Filtros de Picks</h3>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;">
                                <select class="mockup-input">
                                    <option>Todos los usuarios</option>
                                    <option>Juan Pérez</option>
                                    <option>María González</option>
                                </select>
                                <select class="mockup-input">
                                    <option>Todos los EmoPicks</option>
                                    <option>😊 Muy Feliz</option>
                                    <option>🙂 Feliz</option>
                                    <option>😐 Neutral</option>
                                </select>
                                <select class="mockup-input">
                                    <option>Todos</option>
                                    <option>Solo Votaron</option>
                                    <option>Solo No Votaron</option>
                                </select>
                            </div>
                            <button class="mockup-button" style="width: 100%;">Aplicar Filtros</button>
                        </div>
                    </div>
                </div>

                <h4>3. Crear/Editar Picks</h4>

                <p><strong>Desde el módulo Búsqueda:</strong></p>
                <ol>
                    <li>Busque al votante que desea marcar</li>
                    <li>Haga clic en el botón "★ Pick" en la fila del votante</li>
                    <li>Seleccione la clasificación emocional</li>
                    <li>Confirme la creación</li>
                </ol>

                <p><strong>Desde el módulo Picks:</strong></p>
                <ol>
                    <li>Localice el pick existente en la lista</li>
                    <li>Haga clic en "Editar"</li>
                    <li>Modifique la clasificación emocional</li>
                    <li>Guarde los cambios</li>
                </ol>

                <div class="info-box warning">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                        <strong>Restricciones de Edición</strong>
                        <p>Nivel 4 solo puede editar sus propios picks no verificados. Nivel 3 puede editar picks no verificados de cualquier usuario. Niveles 1-2 pueden editar cualquier pick.</p>
                    </div>
                </div>

                <h4>4. Verificar Picks</h4>

                <p>Solo para usuarios niveles 1-3:</p>

                <ol>
                    <li>Revise el pick para confirmar su precisión</li>
                    <li>Haga clic en el botón "Verificar"</li>
                    <li>El sistema registra su usuario y fecha/hora</li>
                    <li>El pick queda marcado como verificado con ícono ✓</li>
                    <li>Los picks verificados tienen protección adicional contra ediciones</li>
                </ol>

                <h4>5. Eliminar Picks</h4>

                <p>Los picks pueden eliminarse cuando ya no son necesarios:</p>

                <ul>
                    <li><strong>Niveles 1-2:</strong> Pueden eliminar cualquier pick</li>
                    <li><strong>Nivel 3:</strong> Pueden eliminar picks no verificados</li>
                    <li><strong>Nivel 4:</strong> Solo pueden eliminar sus propios picks no verificados</li>
                </ul>

                <h3>Casos de Uso Comunes</h3>

                <h4>Seguimiento de Votantes Clave</h4>
                <ol>
                    <li>Identifique votantes importantes para la organización</li>
                    <li>Cree picks con clasificación emocional apropiada</li>
                    <li>Durante la jornada, filtre por "No votaron"</li>
                    <li>Coordine acciones para motivar la asistencia</li>
                    <li>Monitoree en tiempo real cuántos ya votaron</li>
                </ol>

                <h4>Análisis de Participación por Segmento</h4>
                <ol>
                    <li>Filtre picks por EmoPick específico (ej: Muy Feliz)</li>
                    <li>Revise qué porcentaje de ese grupo ya votó</li>
                    <li>Compare con otros grupos emocionales</li>
                    <li>Identifique patrones de participación</li>
                    <li>Ajuste estrategias según los resultados</li>
                </ol>

                <h4>Coordinación entre Fiscales</h4>
                <ol>
                    <li>El coordinador revisa picks de todos los fiscales</li>
                    <li>Identifica duplicados o errores</li>
                    <li>Verifica picks para darles validez oficial</li>
                    <li>Genera reportes consolidados</li>
                </ol>

                <h3>Estadísticas de Picks</h3>

                <p>El módulo muestra métricas en tiempo real:</p>

                <ul>
                    <li>Total de picks en el sistema</li>
                    <li>Picks por clasificación emocional</li>
                    <li>Porcentaje de picks que ya votaron</li>
                    <li>Picks por usuario/fiscal</li>
                    <li>Tasa de verificación de picks</li>
                </ul>

                <h3>Mejores Prácticas</h3>

                <ul>
                    <li><strong>Calidad sobre Cantidad:</strong> Priorice picks realmente importantes</li>
                    <li><strong>Mantenga Actualizado:</strong> Revise y actualice clasificaciones según nueva información</li>
                    <li><strong>Verifique:</strong> Coordinadores deben verificar picks críticos</li>
                    <li><strong>No Abuse:</strong> Demasiados picks dificultan el seguimiento efectivo</li>
                    <li><strong>Privacidad:</strong> La información de picks es sensible, use con responsabilidad</li>
                    <li><strong>Elimine Obsoletos:</strong> Limpie picks que ya no son relevantes</li>
                </ul>

                <div class="info-box success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <div>
                        <strong>Consejo: Exportación</strong>
                        <p>Use el módulo de Padrones → Exportar con filtro "Solo con picks" para descargar listas de seguimiento en Excel.</p>
                    </div>
                </div>
            </div>
        `,

        'modulo-estadisticas': `
            <div class="doc-section">
                <h2>Módulo: Estadísticas</h2>

                <div class="info-box info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <div>
                        <strong>Solo Coordinadores y Administradores</strong>
                        <p>Este módulo está disponible únicamente para usuarios niveles 1-3.</p>
                    </div>
                </div>

                <h3>Descripción General</h3>
                <p>El módulo de Estadísticas proporciona análisis en tiempo real de la participación electoral, permitiendo a coordinadores y administradores monitorear el desarrollo de la jornada y tomar decisiones informadas.</p>

                <h3>Subsecciones del Módulo</h3>

                <h4>1. General</h4>
                <p>Muestra métricas consolidadas de todo el comicio:</p>

                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Métrica</th>
                                <th>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Total de Votantes Habilitados</strong></td>
                                <td>Cantidad total de personas en el padrón electoral</td>
                            </tr>
                            <tr>
                                <td><strong>Total que ya Votaron</strong></td>
                                <td>Cantidad acumulada de votos registrados hasta el momento</td>
                            </tr>
                            <tr>
                                <td><strong>% Participación Global</strong></td>
                                <td>Porcentaje de participación sobre el total de habilitados</td>
                            </tr>
                            <tr>
                                <td><strong>Votantes Pendientes</strong></td>
                                <td>Cantidad de personas que aún no votaron</td>
                            </tr>
                            <tr>
                                <td><strong>Mesas Activas</strong></td>
                                <td>Cantidad de mesas con al menos un voto registrado</td>
                            </tr>
                            <tr>
                                <td><strong>Picks Totales</strong></td>
                                <td>Cantidad total de votantes marcados como picks</td>
                            </tr>
                            <tr>
                                <td><strong>Picks que Votaron</strong></td>
                                <td>Porcentaje de picks que ya emitieron su voto</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h5>Participación por Localidad</h5>
                <p>Tabla y gráfico mostrando participación desagregada por localidad:</p>
                <ul>
                    <li>Votantes habilitados por localidad</li>
                    <li>Votos registrados hasta el momento</li>
                    <li>Porcentaje de participación</li>
                    <li>Comparación visual entre localidades</li>
                </ul>

                <h5>Participación por Hora</h5>
                <p>Gráfico de línea temporal mostrando:</p>
                <ul>
                    <li>Evolución de votos hora por hora</li>
                    <li>Momentos de mayor afluencia</li>
                    <li>Tendencias de participación</li>
                    <li>Proyecciones para el cierre</li>
                </ul>

                <h4>2. Pendientes (En Desarrollo)</h4>
                <p>Vista especializada para identificar y gestionar votantes que aún no han votado:</p>

                <ul>
                    <li>Lista de picks que faltan votar</li>
                    <li>Votantes clave por mesa</li>
                    <li>Filtros por localidad y circuito</li>
                    <li>Exportación de listas pendientes</li>
                </ul>

                <h4>3. Reportes</h4>
                <p>Generación de reportes detallados y descargables:</p>

                <h5>Tipos de Reportes Disponibles:</h5>

                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th>Reporte</th>
                                <th>Contenido</th>
                                <th>Formato</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Participación General</strong></td>
                                <td>Resumen consolidado de participación total</td>
                                <td>PDF/Excel</td>
                            </tr>
                            <tr>
                                <td><strong>Detalle por Mesa</strong></td>
                                <td>Participación de cada mesa individual</td>
                                <td>Excel</td>
                            </tr>
                            <tr>
                                <td><strong>Detalle por Localidad</strong></td>
                                <td>Análisis comparativo entre localidades</td>
                                <td>PDF/Excel</td>
                            </tr>
                            <tr>
                                <td><strong>Análisis de Picks</strong></td>
                                <td>Estadísticas de picks y su participación</td>
                                <td>Excel</td>
                            </tr>
                            <tr>
                                <td><strong>Evolución Temporal</strong></td>
                                <td>Participación hora por hora durante la jornada</td>
                                <td>PDF</td>
                            </tr>
                            <tr>
                                <td><strong>Fiscales Activos</strong></td>
                                <td>Actividad de fiscales y mesas cubiertas</td>
                                <td>Excel</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h3>Interpretación de Estadísticas</h3>

                <h4>Participación Saludable</h4>
                <p>Indicadores de un proceso electoral con participación normal:</p>
                <ul>
                    <li>50-75% de participación general al cierre</li>
                    <li>Distribución uniforme entre localidades</li>
                    <li>Picos de afluencia en horarios esperados (11am, 4pm)</li>
                    <li>Mesas activas de manera homogénea</li>
                </ul>

                <h4>Señales de Alerta</h4>
                <p>Situaciones que requieren atención:</p>
                <ul>
                    <li>Participación muy baja en ciertas localidades</li>
                    <li>Mesas sin actividad después de varias horas</li>
                    <li>Discrepancias grandes entre localidades similares</li>
                    <li>Caída abrupta en ritmo de votación</li>
                </ul>

                <h3>Gráficos Disponibles</h3>

                <h4>Gráfico de Barras - Participación por Localidad</h4>
                <p>Visualiza comparativamente la participación de cada localidad, facilitando identificar zonas con baja participación.</p>

                <h4>Gráfico de Línea - Evolución Temporal</h4>
                <p>Muestra cómo evoluciona la participación a lo largo del día, permitiendo identificar momentos críticos y proyectar participación final.</p>

                <h4>Gráfico Circular - Distribución de Picks</h4>
                <p>Muestra la distribución de picks por clasificación emocional y su estado de votación.</p>

                <h4>Gráfico de Dona - Estado General</h4>
                <p>Representa visualmente la proporción de votantes que ya votaron vs pendientes.</p>

                <h3>Actualización de Datos</h3>

                <p>Las estadísticas se actualizan automáticamente:</p>
                <ul>
                    <li><strong>Frecuencia:</strong> Cada 30 segundos cuando la página está activa</li>
                    <li><strong>Indicador visual:</strong> Muestra "Última actualización" con timestamp</li>
                    <li><strong>Actualización manual:</strong> Botón "Actualizar" disponible para forzar refresh</li>
                    <li><strong>Sin conexión:</strong> Muestra advertencia si no puede actualizar</li>
                </ul>

                <h3>Uso Durante la Jornada Electoral</h3>

                <div class="workflow-diagram">
                    <div class="workflow-step">
                        <div class="workflow-icon">1</div>
                        <div class="workflow-content">
                            <h4>Apertura (8:00 - 10:00)</h4>
                            <p>Verifique que todas las mesas comienzan a registrar actividad. Identifique mesas sin movimiento y contacte fiscales.</p>
                        </div>
                    </div>

                    <div class="workflow-step">
                        <div class="workflow-icon">2</div>
                        <div class="workflow-content">
                            <h4>Mañana (10:00 - 13:00)</h4>
                            <p>Monitoree el ritmo de votación. Compare con jornadas anteriores. Proyecte participación final.</p>
                        </div>
                    </div>

                    <div class="workflow-step">
                        <div class="workflow-icon">3</div>
                        <div class="workflow-content">
                            <h4>Mediodía (13:00 - 15:00)</h4>
                            <p>Período típicamente de baja afluencia. Analice si hay localidades muy rezagadas y active coordinación.</p>
                        </div>
                    </div>

                    <div class="workflow-step">
                        <div class="workflow-icon">4</div>
                        <div class="workflow-content">
                            <h4>Tarde (15:00 - 18:00)</h4>
                            <p>Pico de afluencia esperado. Monitoree picks pendientes y coordine acciones de último momento.</p>
                        </div>
                    </div>

                    <div class="workflow-step">
                        <div class="workflow-icon">5</div>
                        <div class="workflow-content">
                            <h4>Cierre (18:00)</h4>
                            <p>Genere reportes finales. Analice resultados vs proyecciones. Documente aprendizajes.</p>
                        </div>
                    </div>
                </div>

                <h3>Exportación de Estadísticas</h3>

                <p>Todas las estadísticas pueden exportarse para análisis externo:</p>

                <ol>
                    <li>Navegue a la subsección "Reportes"</li>
                    <li>Seleccione el tipo de reporte deseado</li>
                    <li>Configure filtros si aplica (fechas, localidades, etc.)</li>
                    <li>Elija formato (PDF para presentaciones, Excel para análisis)</li>
                    <li>Haga clic en "Generar y Descargar"</li>
                    <li>El archivo se descargará automáticamente</li>
                </ol>

                <h3>Mejores Prácticas</h3>

                <ul>
                    <li><strong>Monitoreo Constante:</strong> Revise estadísticas cada 30-60 minutos durante la jornada</li>
                    <li><strong>Acción Proactiva:</strong> No espere al final para detectar problemas</li>
                    <li><strong>Comunicación:</strong> Comparta estadísticas relevantes con el equipo</li>
                    <li><strong>Documentación:</strong> Capture pantallas de momentos clave</li>
                    <li><strong>Comparación:</strong> Mantenga datos históricos para comparar</li>
                    <li><strong>Privacidad:</strong> Limite acceso a estadísticas sensibles</li>
                </ul>

                <div class="info-box success">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <div>
                        <strong>Proyecciones Tempranas</strong>
                        <p>Con 30-40% de participación ya puede obtener proyecciones bastante precisas de la participación final, especialmente si cuenta con datos históricos confiables.</p>
                    </div>
                </div>
            </div>
        `
    };

    return modules[id] || '<div class="doc-section"><h2>Contenido en desarrollo</h2><p>Esta sección está siendo documentada.</p></div>';
}

function getWorkflowContent(id) {
    // Workflow content would go here
    return '<div class="doc-section"><h2>Guía de Flujo</h2><p>Contenido en desarrollo.</p></div>';
}

function getHelpContent(id) {
    // Help content would go here
    return '<div class="doc-section"><h2>Ayuda</h2><p>Contenido en desarrollo.</p></div>';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllSections);
} else {
    loadAllSections();
}

// Export functions for module usage
export { getModuleContent, getWorkflowContent, getHelpContent };
