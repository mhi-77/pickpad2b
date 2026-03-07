const moduleDocs = {
    'modulo-busqueda': `
        <div class="doc-section">
            <h2>Módulo: Búsqueda</h2>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Acceso Universal</strong>
                    <p>Este módulo está disponible para todos los usuarios, independientemente de su nivel de permisos (tipos 1-5).</p>
                </div>
            </div>

            <h3>Descripción General</h3>
            <p>El módulo de Búsqueda permite consultar el padrón electoral completo para localizar información de votantes específicos. Ofrece dos modos de operación: búsqueda simple por documento y búsqueda avanzada con múltiples filtros simultáneos.</p>

            <h3>Funcionalidades</h3>

            <h4>1. Búsqueda Simple</h4>
            <p>Localiza votantes ingresando únicamente su número de documento.</p>

            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div style="max-width: 500px;">
                        <h3 style="margin-bottom: 1rem;">Buscar en Padrón</h3>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <span style="font-weight: 600;">Búsqueda Simple</span>
                            <button style="color: #2563eb; font-size: 0.875rem;">Usar Filtros</button>
                        </div>
                        <div>
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Número de Documento</label>
                            <input class="mockup-input" style="width: 100%; margin-bottom: 1rem;" value="Ej: 12345678">
                            <button class="mockup-button" style="width: 100%;">Buscar</button>
                        </div>
                    </div>
                </div>
            </div>

            <p><strong>Pasos para búsqueda simple:</strong></p>
            <ol>
                <li>Ingrese el número de documento en el campo correspondiente</li>
                <li>Haga clic en "Buscar" o presione Enter</li>
                <li>Revise los resultados que aparecen debajo del formulario</li>
            </ol>

            <h4>2. Búsqueda Avanzada</h4>
            <p>Permite combinar múltiples criterios de búsqueda para refinar los resultados:</p>

            <ul>
                <li><strong>Apellido:</strong> Busca por apellido completo o parcial del votante</li>
                <li><strong>Nombre:</strong> Busca por nombre completo o parcial</li>
                <li><strong>Localidad:</strong> Filtra por localidad desde un menú desplegable</li>
                <li><strong>Número de Mesa:</strong> Filtra por mesa electoral específica</li>
                <li><strong>Clase:</strong> Filtra por clase electoral (A, B, C, etc.)</li>
            </ul>

            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div>
                        <h3 style="margin-bottom: 1rem;">Búsqueda Avanzada</h3>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem;">
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem;">Apellido</label>
                                <input class="mockup-input" style="width: 100%;" placeholder="Apellido">
                            </div>
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem;">Nombre</label>
                                <input class="mockup-input" style="width: 100%;" placeholder="Nombre">
                            </div>
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem;">Localidad</label>
                                <select class="mockup-input" style="width: 100%;">
                                    <option>Todas</option>
                                    <option>Capital</option>
                                    <option>Interior</option>
                                </select>
                            </div>
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem;">Número de Mesa</label>
                                <input class="mockup-input" style="width: 100%;" placeholder="Nº Mesa">
                            </div>
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem; font-size: 0.875rem;">Clase</label>
                                <input class="mockup-input" style="width: 100%;" placeholder="Clase">
                            </div>
                        </div>
                        <button class="mockup-button" style="width: 100%; margin-top: 1rem;">Buscar con Filtros</button>
                    </div>
                </div>
            </div>

            <p><strong>Pasos para búsqueda avanzada:</strong></p>
            <ol>
                <li>Haga clic en "Usar Filtros" en la parte superior derecha del formulario</li>
                <li>Complete uno o más campos de filtro según sus necesidades</li>
                <li>Los filtros se combinan (todos deben coincidir)</li>
                <li>Haga clic en "Buscar" para ejecutar la consulta</li>
                <li>Use "Limpiar" para resetear todos los filtros</li>
            </ol>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Búsquedas Parciales</strong>
                    <p>Los campos de texto (apellido, nombre) buscan coincidencias parciales. Por ejemplo, "GONZ" encontrará "GONZÁLEZ", "GONZALEZ", etc.</p>
                </div>
            </div>

            <h3>Resultados de Búsqueda</h3>

            <p>Los resultados se muestran en una tabla con la siguiente información:</p>

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
                            <td><strong>Clase</strong></td>
                            <td>Clase electoral asignada</td>
                        </tr>
                        <tr>
                            <td><strong>Localidad</strong></td>
                            <td>Localidad donde está empadronado</td>
                        </tr>
                        <tr>
                            <td><strong>Mesa</strong></td>
                            <td>Número de mesa electoral asignada</td>
                        </tr>
                        <tr>
                            <td><strong>Orden</strong></td>
                            <td>Posición en el padrón de mesa</td>
                        </tr>
                        <tr>
                            <td><strong>Votó</strong></td>
                            <td>Indica si el votante ya emitió su voto</td>
                        </tr>
                        <tr>
                            <td><strong>EmoPick</strong></td>
                            <td>Ícono indicando clasificación emocional si tiene pick</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>Indicadores Visuales en Resultados</h4>

            <ul>
                <li><span class="badge badge-green">✓ Votó</span> - El votante ya emitió su voto</li>
                <li><span class="badge badge-gray">Pendiente</span> - El votante aún no votó</li>
                <li><span class="badge badge-blue">★</span> - El votante tiene un pick asignado</li>
                <li><strong>😊 😐 😢</strong> - Emoticones indicando el emopick (si aplica)</li>
            </ul>

            <h3>Paginación</h3>

            <p>Cuando hay muchos resultados, el sistema los divide en páginas:</p>

            <ul>
                <li><strong>Tamaño de página:</strong> Seleccione 10, 25, 50 o 100 resultados por página</li>
                <li><strong>Navegación:</strong> Use los botones "Anterior" y "Siguiente"</li>
                <li><strong>Contador:</strong> Muestra "Mostrando X-Y de Z resultados"</li>
                <li><strong>Ir a página:</strong> Salte directamente a una página específica</li>
            </ul>

            <h3>Casos de Uso Comunes</h3>

            <h4>Verificar Dónde Vota una Persona</h4>
            <ol>
                <li>Use búsqueda simple con el documento</li>
                <li>Revise la columna "Mesa" y "Localidad" en los resultados</li>
                <li>Anote el número de orden si necesita ubicarlo en el padrón físico</li>
            </ol>

            <h4>Encontrar Todos los Votantes de una Mesa</h4>
            <ol>
                <li>Active "Usar Filtros"</li>
                <li>Ingrese el número de mesa</li>
                <li>Deje los demás campos vacíos</li>
                <li>Busque para ver el listado completo</li>
            </ol>

            <h4>Buscar Votantes por Apellido</h4>
            <ol>
                <li>Active "Usar Filtros"</li>
                <li>Ingrese el apellido (puede ser parcial)</li>
                <li>Opcionalmente agregue localidad para refinar</li>
                <li>Revise todos los resultados con ese apellido</li>
            </ol>

            <h3>Limitaciones y Consideraciones</h3>

            <ul>
                <li>La búsqueda distingue mayúsculas de minúsculas en algunos casos</li>
                <li>No se pueden usar comodines (* o %) en las búsquedas</li>
                <li>Los resultados se limitan a 1000 registros máximo</li>
                <li>La búsqueda no modifica datos, solo consulta</li>
                <li>Requiere conexión activa a Internet</li>
            </ul>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Consejo: Exportación de Resultados</strong>
                    <p>Si necesita guardar los resultados de una búsqueda, use el módulo de Padrones → Exportar con los mismos filtros para descargar los datos en Excel.</p>
                </div>
            </div>
        </div>
    `,

    'modulo-fiscalizar': `
        <div class="doc-section">
            <h2>Módulo: Fiscalizar</h2>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Acceso Restringido</strong>
                    <p>Niveles 1-3: Acceso total. Nivel 4: Solo mesa asignada. Nivel 5: Sin acceso.</p>
                </div>
            </div>

            <h3>Descripción General</h3>
            <p>El módulo de Fiscalizar es la herramienta central para el control de asistencia durante la jornada electoral. Permite a los fiscales registrar en tiempo real qué votantes ya emitieron su voto, generando estadísticas instantáneas de participación.</p>

            <h3>Acceso al Módulo</h3>

            <h4>Para Fiscales (Nivel 4)</h4>
            <p>Los fiscales solo pueden acceder al padrón de la mesa que les fue asignada previamente por un administrador. Si no tiene mesa asignada, verá un mensaje indicando que debe contactar a su coordinador.</p>

            <h4>Para Coordinadores y Administradores (Niveles 1-3)</h4>
            <p>Pueden fiscalizar cualquier mesa del sistema, seleccionándola mediante el buscador de mesa en la parte superior del formulario.</p>

            <h3>Búsqueda de Votantes en la Mesa</h3>

            <p>Existen dos métodos para localizar votantes dentro del padrón de mesa:</p>

            <h4>1. Búsqueda por Documento</h4>
            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div style="max-width: 500px;">
                        <h3 style="margin-bottom: 1rem;">Fiscalizar Mesa 101</h3>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Número de Documento</label>
                            <input class="mockup-input" style="width: 100%;" placeholder="Ingrese documento">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Orden en Mesa</label>
                            <input class="mockup-input" style="width: 100%;" placeholder="Ej: 1, 2, 3...">
                        </div>
                        <button class="mockup-button" style="width: 100%;">Buscar Votante</button>
                    </div>
                </div>
            </div>

            <p><strong>Procedimiento:</strong></p>
            <ol>
                <li>El votante se presenta en la mesa y muestra su documento</li>
                <li>Ingrese el número de documento en el campo de búsqueda</li>
                <li>Presione Enter o haga clic en "Buscar"</li>
                <li>El sistema muestra el votante si pertenece a esa mesa</li>
                <li>Haga clic en el botón "Marcar como Votó" junto al votante</li>
            </ol>

            <h4>2. Búsqueda por Orden en Mesa</h4>

            <p><strong>Procedimiento:</strong></p>
            <ol>
                <li>Ubique al votante en el padrón físico de mesa</li>
                <li>Identifique su número de orden (1, 2, 3, etc.)</li>
                <li>Ingrese ese número en el campo "Orden en Mesa"</li>
                <li>El sistema muestra directamente ese votante</li>
                <li>Marque como votó si corresponde</li>
            </ol>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Consejo: Búsqueda Rápida</strong>
                    <p>Para agilizar el proceso en momentos de alta afluencia, busque por orden en mesa. Es más rápido que ingresar documentos completos.</p>
                </div>
            </div>

            <h3>Marcado de Votantes</h3>

            <p>Una vez localizado el votante correcto:</p>

            <ol>
                <li>Verifique que el nombre coincida con el documento presentado</li>
                <li>Confirme que el votante está en la mesa correcta</li>
                <li>Haga clic en el botón <span class="badge badge-blue">Marcar como Votó</span></li>
                <li>El sistema registra instantáneamente la votación</li>
                <li>El votante aparecerá con estado <span class="badge badge-green">✓ Votó</span></li>
            </ol>

            <h4>Corrección de Errores</h4>

            <p>Si marcó un votante por error:</p>

            <ul>
                <li><strong>Niveles 1-3:</strong> Pueden desmarcar cualquier votante haciendo clic nuevamente</li>
                <li><strong>Nivel 4:</strong> No pueden desmarcar votantes. Debe contactar a un coordinador</li>
            </ul>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Importante: Verificación</strong>
                    <p>Siempre verifique que está marcando al votante correcto. Los registros incorrectos afectan las estadísticas y pueden causar problemas en el recuento.</p>
                </div>
            </div>

            <h3>Estadísticas de Participación</h3>

            <p>El módulo muestra estadísticas en tiempo real de la mesa:</p>

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
                            <td><strong>Total de Votantes</strong></td>
                            <td>Cantidad total de personas habilitadas en la mesa</td>
                        </tr>
                        <tr>
                            <td><strong>Ya Votaron</strong></td>
                            <td>Cantidad de votantes que ya emitieron su voto</td>
                        </tr>
                        <tr>
                            <td><strong>Faltan Votar</strong></td>
                            <td>Cantidad de votantes que aún no votaron</td>
                        </tr>
                        <tr>
                            <td><strong>% Participación</strong></td>
                            <td>Porcentaje de participación actual de la mesa</td>
                        </tr>
                        <tr>
                            <td><strong>Asistencia Histórica</strong></td>
                            <td>Promedio de participación en elecciones anteriores</td>
                        </tr>
                        <tr>
                            <td><strong>Tendencia Proyectada</strong></td>
                            <td>Proyección de participación final basada en datos actuales</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>Gráfico de Tendencia</h4>

            <p>Un gráfico visual muestra:</p>
            <ul>
                <li>Barra azul: Porcentaje actual de participación</li>
                <li>Línea naranja: Proyección basada en hora del día y datos históricos</li>
                <li>Línea gris: Asistencia histórica de referencia</li>
            </ul>

            <h3>Flujo de Trabajo Típico - Día de Elección</h3>

            <div class="workflow-diagram">
                <div class="workflow-step">
                    <div class="workflow-icon">1</div>
                    <div class="workflow-content">
                        <h4>Inicio de Jornada (8:00 AM)</h4>
                        <p>Ingrese al sistema y verifique que puede acceder al padrón de su mesa. Confirme que aparecen todos los votantes habilitados.</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">2</div>
                    <div class="workflow-content">
                        <h4>Durante la Votación</h4>
                        <p>Marque cada votante conforme emite su voto. Mantenga el sistema abierto y actualizado. Revise periódicamente las estadísticas.</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">3</div>
                    <div class="workflow-content">
                        <h4>Horarios Pico</h4>
                        <p>En momentos de alta afluencia (mediodía, última hora), priorice velocidad usando búsqueda por orden de mesa.</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">4</div>
                    <div class="workflow-content">
                        <h4>Cierre de Votación (18:00)</h4>
                        <p>Verifique las estadísticas finales. Reporte cualquier irregularidad a su coordinador. Los datos quedan registrados automáticamente.</p>
                    </div>
                </div>
            </div>

            <h3>Problemas Comunes y Soluciones</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Problema</th>
                            <th>Solución</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Votante no aparece en la búsqueda</td>
                            <td>Verifique que está buscando en la mesa correcta. El votante puede estar asignado a otra mesa.</td>
                        </tr>
                        <tr>
                            <td>No puedo marcar a un votante</td>
                            <td>Verifique su conexión a Internet. Si persiste, contacte soporte técnico.</td>
                        </tr>
                        <tr>
                            <td>Marqué al votante equivocado</td>
                            <td>Si es nivel 4, contacte a su coordinador. Si es nivel 1-3, haga clic nuevamente para desmarcar.</td>
                        </tr>
                        <tr>
                            <td>Las estadísticas no se actualizan</td>
                            <td>Refresque la página con F5. Si el problema persiste, cierre sesión y vuelva a ingresar.</td>
                        </tr>
                        <tr>
                            <td>No puedo acceder a mi mesa</td>
                            <td>Contacte a un administrador para que le asigne la mesa correcta.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Mejores Prácticas</h3>

            <ul>
                <li><strong>Conexión Estable:</strong> Asegúrese de tener WiFi o datos móviles durante toda la jornada</li>
                <li><strong>Batería:</strong> Mantenga su dispositivo cargado o conectado a corriente</li>
                <li><strong>Verificación:</strong> Siempre confirme el nombre antes de marcar como votó</li>
                <li><strong>Registro Continuo:</strong> No acumule votantes sin registrar, márquelos inmediatamente</li>
                <li><strong>Respaldo:</strong> Mantenga el padrón físico como respaldo en caso de problemas técnicos</li>
                <li><strong>Comunicación:</strong> Reporte inmediatamente cualquier anomalía a su coordinador</li>
            </ul>
        </div>
    `
};

export default moduleDocs;
