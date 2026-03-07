const moduleAdvancedDocs = {
    'modulo-testigo': `
        <div class="doc-section">
            <h2>Módulo: Mesa Testigo</h2>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Acceso Restringido</strong>
                    <p>Disponible solo para niveles 1-3 (Administradores y Coordinadores).</p>
                </div>
            </div>

            <h3>Descripción General</h3>
            <p>El módulo de Mesa Testigo permite realizar proyecciones de resultados electorales basadas en una muestra estadística de mesas seleccionadas. Es una herramienta fundamental para anticipar tendencias durante el escrutinio.</p>

            <h3>Conceptos Clave</h3>

            <h4>¿Qué es una Mesa Testigo?</h4>
            <p>Una mesa testigo es una mesa electoral seleccionada para representar estadísticamente al universo electoral. Los resultados de estas mesas se utilizan para proyectar los resultados finales antes de completar el escrutinio total.</p>

            <h4>Muestreo Estadístico</h4>
            <p>El sistema utiliza técnicas de muestreo para garantizar que las mesas testigo:</p>
            <ul>
                <li>Representen todas las regiones geográficas</li>
                <li>Reflejen la distribución poblacional</li>
                <li>Mantengan diversidad socioeconómica</li>
                <li>Sean estadísticamente significativas</li>
            </ul>

            <h3>Configuración de Mesas Testigo</h3>

            <h4>Selección Manual de Mesas</h4>
            <ol>
                <li>Acceda al módulo "Mesa Testigo"</li>
                <li>Haga clic en "Configurar Mesas Testigo"</li>
                <li>Seleccione las mesas manualmente desde el listado</li>
                <li>Confirme la selección</li>
            </ol>

            <h4>Selección Automática (Recomendado)</h4>
            <ol>
                <li>Haga clic en "Generar Muestra Automática"</li>
                <li>Configure los parámetros:
                    <ul>
                        <li><strong>Tamaño de muestra:</strong> Cantidad de mesas (ej: 50, 100, 200)</li>
                        <li><strong>Nivel de confianza:</strong> 90%, 95% o 99%</li>
                        <li><strong>Distribución geográfica:</strong> Proporcional o equitativa</li>
                    </ul>
                </li>
                <li>El sistema selecciona automáticamente las mesas más representativas</li>
                <li>Revise y confirme la selección</li>
            </ol>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Consejo: Tamaño de Muestra</strong>
                    <p>Para proyecciones confiables, se recomienda un mínimo de 100 mesas testigo en distritos grandes y 50 en distritos pequeños.</p>
                </div>
            </div>

            <h3>Carga de Resultados</h3>

            <h4>Durante el Escrutinio</h4>
            <p>A medida que se conocen los resultados de las mesas testigo:</p>

            <ol>
                <li>Seleccione la mesa testigo del listado</li>
                <li>Ingrese los votos para cada opción electoral:
                    <ul>
                        <li>Votos por partido/candidato</li>
                        <li>Votos en blanco</li>
                        <li>Votos nulos</li>
                        <li>Votos impugnados</li>
                        <li>Total de sobres (para validación)</li>
                    </ul>
                </li>
                <li>El sistema valida que los totales coincidan</li>
                <li>Confirme los datos ingresados</li>
            </ol>

            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div style="max-width: 600px;">
                        <h3 style="margin-bottom: 1rem;">Cargar Resultados - Mesa 101</h3>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Partido A</label>
                                <input class="mockup-input" style="width: 100%;" placeholder="Votos">
                            </div>
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Partido B</label>
                                <input class="mockup-input" style="width: 100%;" placeholder="Votos">
                            </div>
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Partido C</label>
                                <input class="mockup-input" style="width: 100%;" placeholder="Votos">
                            </div>
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Votos en Blanco</label>
                                <input class="mockup-input" style="width: 100%;" placeholder="Votos">
                            </div>
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Votos Nulos</label>
                                <input class="mockup-input" style="width: 100%;" placeholder="Votos">
                            </div>
                            <div>
                                <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Total Sobres</label>
                                <input class="mockup-input" style="width: 100%;" placeholder="Total">
                            </div>
                        </div>
                        <button class="mockup-button" style="width: 100%; margin-top: 1rem;">Confirmar Resultados</button>
                    </div>
                </div>
            </div>

            <h4>Validación Automática</h4>
            <p>El sistema valida automáticamente:</p>
            <ul>
                <li>Suma de votos = Total de sobres</li>
                <li>No hay valores negativos</li>
                <li>No excede el total de votantes habilitados</li>
                <li>Campos obligatorios completos</li>
            </ul>

            <h3>Proyecciones y Análisis</h3>

            <h4>Actualización en Tiempo Real</h4>
            <p>A medida que carga resultados de mesas testigo, el sistema actualiza automáticamente:</p>

            <ul>
                <li><strong>Porcentaje proyectado:</strong> Distribución porcentual de votos</li>
                <li><strong>Diferencia entre opciones:</strong> Margen entre candidatos/partidos</li>
                <li><strong>Progreso de carga:</strong> Cantidad de mesas testigo procesadas</li>
                <li><strong>Margen de error:</strong> Intervalo de confianza estadístico</li>
                <li><strong>Tendencias:</strong> Evolución de los porcentajes</li>
            </ul>

            <h4>Visualización de Resultados</h4>
            <p>El dashboard de testigo muestra:</p>

            <ul>
                <li><strong>Gráfico de Barras:</strong> Comparación visual de votos por opción</li>
                <li><strong>Gráfico de Torta:</strong> Distribución porcentual</li>
                <li><strong>Tabla de Resultados:</strong> Datos numéricos detallados</li>
                <li><strong>Mapa de Cobertura:</strong> Mesas testigo procesadas vs pendientes</li>
                <li><strong>Línea de Tiempo:</strong> Evolución de la proyección</li>
            </ul>

            <h3>Interpretación de Resultados</h3>

            <h4>Nivel de Confiabilidad</h4>
            <p>El sistema indica el nivel de confiabilidad según:</p>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Mesas Procesadas</th>
                            <th>Confiabilidad</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>0-20%</td>
                            <td>Muy Baja</td>
                            <td><span class="badge badge-red">No confiable</span></td>
                        </tr>
                        <tr>
                            <td>20-40%</td>
                            <td>Baja</td>
                            <td><span class="badge badge-orange">Preliminar</span></td>
                        </tr>
                        <tr>
                            <td>40-60%</td>
                            <td>Media</td>
                            <td><span class="badge badge-yellow">Moderada</span></td>
                        </tr>
                        <tr>
                            <td>60-80%</td>
                            <td>Alta</td>
                            <td><span class="badge badge-blue">Confiable</span></td>
                        </tr>
                        <tr>
                            <td>80-100%</td>
                            <td>Muy Alta</td>
                            <td><span class="badge badge-green">Muy confiable</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>Margen de Error</h4>
            <p>El margen de error depende de:</p>
            <ul>
                <li>Tamaño de la muestra</li>
                <li>Nivel de confianza configurado</li>
                <li>Variabilidad entre mesas</li>
                <li>Cantidad de mesas procesadas</li>
            </ul>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Advertencia: Proyecciones Preliminares</strong>
                    <p>Las proyecciones basadas en mesas testigo son estimaciones estadísticas. Los resultados oficiales pueden diferir. No difunda proyecciones con menos del 50% de mesas procesadas.</p>
                </div>
            </div>

            <h3>Exportación de Datos</h3>

            <p>Puede exportar los resultados testigo en formato:</p>
            <ul>
                <li><strong>Excel:</strong> Datos tabulados para análisis</li>
                <li><strong>PDF:</strong> Informe visual con gráficos</li>
                <li><strong>CSV:</strong> Datos crudos para procesamiento externo</li>
            </ul>

            <h3>Mejores Prácticas</h3>

            <ul>
                <li><strong>Definir muestra antes:</strong> Configure las mesas testigo días antes de la elección</li>
                <li><strong>Capacitar operadores:</strong> Asegure que quienes cargan datos conozcan el procedimiento</li>
                <li><strong>Verificar datos:</strong> Doble chequeo de los números antes de confirmar</li>
                <li><strong>Cargar ordenadamente:</strong> Procese las mesas en orden de llegada</li>
                <li><strong>Comunicación responsable:</strong> Difunda proyecciones solo con confiabilidad alta</li>
                <li><strong>Respaldo documental:</strong> Guarde copias de las actas de escrutinio</li>
            </ul>
        </div>
    `,

    'modulo-picks': `
        <div class="doc-section">
            <h2>Módulo: Picks (Marcación Estratégica)</h2>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Acceso Restringido</strong>
                    <p>Disponible solo para niveles 1-3 (Administradores y Coordinadores).</p>
                </div>
            </div>

            <h3>Descripción General</h3>
            <p>El módulo de Picks permite marcar y clasificar votantes según su importancia estratégica para el trabajo electoral. Es una herramienta de gestión política para identificar votantes clave y organizar el trabajo territorial.</p>

            <h3>¿Qué es un Pick?</h3>

            <p>Un "pick" es una marca especial asignada a un votante que indica:</p>
            <ul>
                <li>Es un contacto importante para la campaña</li>
                <li>Requiere seguimiento especial</li>
                <li>Tiene un nivel de compromiso identificado</li>
                <li>Necesita atención prioritaria el día de la elección</li>
            </ul>

            <h3>Sistema EmoPick</h3>

            <p>Cada pick puede tener una clasificación emocional que representa el nivel de compromiso del votante:</p>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Emoticón</th>
                            <th>Significado</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style="font-size: 1.5rem;">😊</td>
                            <td><strong>Positivo</strong></td>
                            <td>Votante comprometido, alta probabilidad de voto favorable</td>
                        </tr>
                        <tr>
                            <td style="font-size: 1.5rem;">😐</td>
                            <td><strong>Neutro</strong></td>
                            <td>Votante indeciso o sin compromiso claro</td>
                        </tr>
                        <tr>
                            <td style="font-size: 1.5rem;">😢</td>
                            <td><strong>Negativo</strong></td>
                            <td>Votante con posición adversa o difícil de convencer</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Asignación de Picks</h3>

            <h4>Método 1: Marcación Individual</h4>
            <ol>
                <li>Busque el votante usando el módulo de Búsqueda</li>
                <li>En los resultados, haga clic en el ícono de estrella (★) junto al votante</li>
                <li>Seleccione el EmoPick correspondiente (😊 😐 😢)</li>
                <li>Opcionalmente agregue notas o comentarios</li>
                <li>Confirme la asignación</li>
            </ol>

            <h4>Método 2: Carga Masiva desde Excel</h4>
            <ol>
                <li>Acceda a "Picks" → "Importar Picks"</li>
                <li>Descargue la plantilla Excel</li>
                <li>Complete la plantilla con:
                    <ul>
                        <li>Documento del votante</li>
                        <li>EmoPick (1=positivo, 2=neutro, 3=negativo)</li>
                        <li>Notas (opcional)</li>
                    </ul>
                </li>
                <li>Cargue el archivo completado</li>
                <li>Revise el resumen de importación</li>
                <li>Confirme la carga</li>
            </ol>

            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div>
                        <h3 style="margin-bottom: 1rem;">Gestión de Picks</h3>
                        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                            <div style="font-weight: 600; padding: 0.5rem; background: #f3f4f6;">Votante</div>
                            <div style="font-weight: 600; padding: 0.5rem; background: #f3f4f6;">EmoPick</div>
                            <div style="font-weight: 600; padding: 0.5rem; background: #f3f4f6;">Acciones</div>
                            <div style="padding: 0.5rem; border-bottom: 1px solid #e5e7eb;">GARCÍA, Juan (DNI: 12345678)</div>
                            <div style="padding: 0.5rem; border-bottom: 1px solid #e5e7eb; font-size: 1.2rem;">😊</div>
                            <div style="padding: 0.5rem; border-bottom: 1px solid #e5e7eb;"><button style="color: #ef4444; font-size: 0.75rem;">Quitar</button></div>
                            <div style="padding: 0.5rem; border-bottom: 1px solid #e5e7eb;">LÓPEZ, María (DNI: 87654321)</div>
                            <div style="padding: 0.5rem; border-bottom: 1px solid #e5e7eb; font-size: 1.2rem;">😐</div>
                            <div style="padding: 0.5rem; border-bottom: 1px solid #e5e7eb;"><button style="color: #ef4444; font-size: 0.75rem;">Quitar</button></div>
                        </div>
                    </div>
                </div>
            </div>

            <h3>Gestión de Picks</h3>

            <h4>Visualización</h4>
            <p>Acceda a "Picks" → "Ver Todos" para visualizar:</p>
            <ul>
                <li>Listado completo de votantes con pick</li>
                <li>Filtrado por EmoPick</li>
                <li>Filtrado por localidad o mesa</li>
                <li>Estado de votación (votó/no votó)</li>
                <li>Ordenamiento por diferentes criterios</li>
            </ul>

            <h4>Modificación</h4>
            <p>Para modificar un pick existente:</p>
            <ol>
                <li>Localice el votante en el listado de picks</li>
                <li>Haga clic en "Editar"</li>
                <li>Cambie el EmoPick o las notas</li>
                <li>Guarde los cambios</li>
            </ol>

            <h4>Eliminación</h4>
            <p>Para quitar un pick:</p>
            <ol>
                <li>Localice el votante</li>
                <li>Haga clic en "Quitar Pick"</li>
                <li>Confirme la acción</li>
            </ol>

            <h3>Estadísticas de Picks</h3>

            <p>El módulo proporciona estadísticas útiles:</p>

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
                            <td><strong>Total de Picks</strong></td>
                            <td>Cantidad total de votantes marcados</td>
                        </tr>
                        <tr>
                            <td><strong>Por EmoPick</strong></td>
                            <td>Distribución entre positivos, neutros y negativos</td>
                        </tr>
                        <tr>
                            <td><strong>Picks que Votaron</strong></td>
                            <td>Cantidad y porcentaje de picks que ya votaron</td>
                        </tr>
                        <tr>
                            <td><strong>Picks Pendientes</strong></td>
                            <td>Picks que aún no votaron (requieren seguimiento)</td>
                        </tr>
                        <tr>
                            <td><strong>Por Localidad</strong></td>
                            <td>Distribución geográfica de picks</td>
                        </tr>
                        <tr>
                            <td><strong>Conversión</strong></td>
                            <td>Tasa de asistencia de picks vs total de votantes</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Uso Durante la Jornada Electoral</h3>

            <h4>Monitoreo de Asistencia</h4>
            <p>El día de la elección, el módulo permite:</p>
            <ul>
                <li>Ver en tiempo real qué picks ya votaron</li>
                <li>Identificar picks que no han concurrido</li>
                <li>Priorizar llamados o visitas a picks pendientes</li>
                <li>Medir efectividad del trabajo territorial</li>
            </ul>

            <h4>Alertas y Notificaciones</h4>
            <p>Configure alertas para:</p>
            <ul>
                <li>Picks positivos (😊) que no votaron al mediodía</li>
                <li>Baja asistencia en determinadas mesas</li>
                <li>Comparación con metas de movilización</li>
            </ul>

            <h3>Exportación de Datos</h3>

            <p>Puede exportar listados de picks para:</p>
            <ul>
                <li><strong>Planillas de movilización:</strong> Lista para fiscales de calle</li>
                <li><strong>Base de datos:</strong> Integración con sistemas externos</li>
                <li><strong>Análisis post-electoral:</strong> Evaluación de efectividad</li>
            </ul>

            <h3>Casos de Uso</h3>

            <h4>1. Movilización del Voto</h4>
            <p>Identifique votantes comprometidos que aún no votaron para realizar llamados o enviar movilizadores.</p>

            <h4>2. Trabajo Territorial</h4>
            <p>Organice recorridas y visitas priorizando zonas con alta concentración de picks positivos.</p>

            <h4>3. Medición de Gestión</h4>
            <p>Compare la tasa de asistencia de picks versus la participación general para evaluar efectividad del trabajo político.</p>

            <h4>4. Análisis Post-Electoral</h4>
            <p>Evalúe qué estrategias funcionaron analizando la correlación entre emopicks y asistencia real.</p>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Privacidad y Confidencialidad</strong>
                    <p>Los picks contienen información sensible sobre preferencias políticas. Maneje estos datos con estricta confidencialidad y respetando la privacidad de los votantes.</p>
                </div>
            </div>

            <h3>Mejores Prácticas</h3>

            <ul>
                <li><strong>Criterios claros:</strong> Defina criterios objetivos para asignar emopicks</li>
                <li><strong>Actualización continua:</strong> Mantenga los picks actualizados según nuevas interacciones</li>
                <li><strong>Notas descriptivas:</strong> Use el campo de notas para contexto útil</li>
                <li><strong>Segmentación inteligente:</strong> Agrupe picks por zona para optimizar movilización</li>
                <li><strong>Medición de impacto:</strong> Compare asistencia de picks vs general para validar estrategia</li>
                <li><strong>Confidencialidad absoluta:</strong> No comparta datos de picks fuera del equipo autorizado</li>
            </ul>
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
                    <strong>Acceso por Niveles</strong>
                    <p>Niveles 1-3: Estadísticas completas. Nivel 4: Solo su mesa. Nivel 5: Estadísticas generales.</p>
                </div>
            </div>

            <h3>Descripción General</h3>
            <p>El módulo de Estadísticas proporciona visualización en tiempo real y análisis histórico de la participación electoral. Es una herramienta clave para la toma de decisiones durante la jornada electoral y el análisis post-electoral.</p>

            <h3>Tipos de Estadísticas</h3>

            <h4>1. Estadísticas en Tiempo Real</h4>
            <p>Durante la jornada electoral, muestra datos actualizados cada minuto:</p>

            <ul>
                <li><strong>Participación General:</strong> Porcentaje global de votantes que concurrieron</li>
                <li><strong>Participación por Localidad:</strong> Desglose geográfico de asistencia</li>
                <li><strong>Participación por Rango Horario:</strong> Curva de afluencia durante el día</li>
                <li><strong>Comparación con Histórico:</strong> Contraste con elecciones anteriores</li>
                <li><strong>Proyección Final:</strong> Estimación de participación al cierre</li>
                <li><strong>Mesas con Mayor/Menor Participación:</strong> Ranking de mesas</li>
            </ul>

            <h4>2. Estadísticas de Picks</h4>
            <p>Análisis del comportamiento de votantes marcados estratégicamente:</p>

            <ul>
                <li>Tasa de asistencia de picks positivos (😊)</li>
                <li>Tasa de asistencia de picks neutros (😐)</li>
                <li>Tasa de asistencia de picks negativos (😢)</li>
                <li>Comparación picks vs población general</li>
                <li>Efectividad del trabajo de movilización</li>
            </ul>

            <h4>3. Reportes Post-Electorales</h4>
            <p>Análisis detallado una vez finalizada la elección:</p>

            <ul>
                <li>Participación final por mesa, localidad y circuito</li>
                <li>Evolución horaria de la participación</li>
                <li>Comparación inter-electoral</li>
                <li>Análisis de correlaciones</li>
                <li>Exportación de datos para análisis externos</li>
            </ul>

            <h3>Dashboard Principal</h3>

            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div>
                        <h3 style="margin-bottom: 1rem;">Estadísticas en Tiempo Real</h3>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem;">
                            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1rem; border-radius: 0.5rem;">
                                <div style="font-size: 0.875rem; opacity: 0.9;">Participación General</div>
                                <div style="font-size: 2rem; font-weight: bold; margin: 0.5rem 0;">67.5%</div>
                                <div style="font-size: 0.75rem;">12,450 de 18,432 votantes</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 1rem; border-radius: 0.5rem;">
                                <div style="font-size: 0.875rem; opacity: 0.9;">Picks Movilizados</div>
                                <div style="font-size: 2rem; font-weight: bold; margin: 0.5rem 0;">84.2%</div>
                                <div style="font-size: 0.75rem;">1,684 de 2,000 picks</div>
                            </div>
                            <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; padding: 1rem; border-radius: 0.5rem;">
                                <div style="font-size: 0.875rem; opacity: 0.9;">Proyección Final</div>
                                <div style="font-size: 2rem; font-weight: bold; margin: 0.5rem 0;">72.3%</div>
                                <div style="font-size: 0.75rem;">Basado en tendencia actual</div>
                            </div>
                        </div>
                        <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; text-align: center;">
                            <div style="height: 150px; display: flex; align-items: center; justify-content: center; color: #6b7280;">
                                [Gráfico de Tendencia de Participación]
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <h3>Gráficos Disponibles</h3>

            <h4>1. Gráfico de Tendencia Horaria</h4>
            <p>Muestra la evolución de la participación a lo largo del día:</p>
            <ul>
                <li>Eje X: Horario (8:00 - 18:00)</li>
                <li>Eje Y: Porcentaje de participación acumulada</li>
                <li>Línea azul: Participación actual</li>
                <li>Línea gris: Histórico de referencia</li>
                <li>Línea punteada: Proyección estimada</li>
            </ul>

            <h4>2. Gráfico de Barras por Localidad</h4>
            <p>Compara la participación entre diferentes zonas geográficas:</p>
            <ul>
                <li>Barras ordenadas por porcentaje</li>
                <li>Código de colores según nivel de participación</li>
                <li>Comparación con promedio general</li>
            </ul>

            <h4>3. Gráfico de Torta - Picks por EmoPick</h4>
            <p>Distribución visual de picks según clasificación:</p>
            <ul>
                <li>Verde: Picks positivos (😊)</li>
                <li>Amarillo: Picks neutros (😐)</li>
                <li>Rojo: Picks negativos (😢)</li>
                <li>Porcentajes y cantidades absolutas</li>
            </ul>

            <h4>4. Mapa de Calor de Participación</h4>
            <p>Visualización geográfica de la participación:</p>
            <ul>
                <li>Verde oscuro: Alta participación (&gt;75%)</li>
                <li>Verde claro: Participación media (60-75%)</li>
                <li>Amarillo: Participación moderada (50-60%)</li>
                <li>Naranja: Baja participación (40-50%)</li>
                <li>Rojo: Muy baja participación (&lt;40%)</li>
            </ul>

            <h3>Filtros y Segmentación</h3>

            <p>Las estadísticas pueden filtrarse por:</p>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Filtro</th>
                            <th>Opciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Localidad</strong></td>
                            <td>Todas, Capital, Interior, específicas</td>
                        </tr>
                        <tr>
                            <td><strong>Rango Horario</strong></td>
                            <td>Desde-hasta, horarios predefinidos</td>
                        </tr>
                        <tr>
                            <td><strong>Tipo de Mesa</strong></td>
                            <td>Todas, Urbanas, Rurales, Especiales</td>
                        </tr>
                        <tr>
                            <td><strong>Clase Electoral</strong></td>
                            <td>Todas las clases o clases específicas</td>
                        </tr>
                        <tr>
                            <td><strong>Estado de Picks</strong></td>
                            <td>Solo picks, solo no-picks, todos</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Análisis Comparativo</h3>

            <h4>Comparación con Elecciones Anteriores</h4>
            <p>El sistema permite comparar:</p>
            <ul>
                <li>Participación actual vs última elección</li>
                <li>Participación actual vs promedio histórico</li>
                <li>Diferencia porcentual por localidad</li>
                <li>Identificación de tendencias</li>
            </ul>

            <h4>Benchmarking de Mesas</h4>
            <p>Compare el desempeño de diferentes mesas:</p>
            <ul>
                <li>Ranking de participación</li>
                <li>Desviación respecto al promedio</li>
                <li>Mesas con mejor/peor desempeño</li>
                <li>Identificación de outliers</li>
            </ul>

            <h3>Exportación de Reportes</h3>

            <h4>Formatos Disponibles</h4>
            <ul>
                <li><strong>Excel (.xlsx):</strong> Datos tabulados para análisis detallado</li>
                <li><strong>PDF:</strong> Informe visual con gráficos y tablas</li>
                <li><strong>CSV:</strong> Datos crudos para procesamiento externo</li>
                <li><strong>Imágenes (.png):</strong> Gráficos individuales para presentaciones</li>
            </ul>

            <h4>Contenido del Reporte</h4>
            <p>Los reportes incluyen:</p>
            <ul>
                <li>Resumen ejecutivo</li>
                <li>Datos generales de participación</li>
                <li>Gráficos y visualizaciones</li>
                <li>Tablas de datos detallados</li>
                <li>Comparaciones históricas</li>
                <li>Análisis de picks (si aplica)</li>
                <li>Conclusiones y observaciones</li>
            </ul>

            <h3>Actualización de Datos</h3>

            <p>Las estadísticas se actualizan:</p>
            <ul>
                <li><strong>Tiempo Real:</strong> Cada 1 minuto durante la jornada electoral</li>
                <li><strong>Gráficos:</strong> Cada 2 minutos para optimizar rendimiento</li>
                <li><strong>Picks:</strong> Inmediatamente al marcar votación</li>
                <li><strong>Proyecciones:</strong> Cada 5 minutos con nuevos algoritmos</li>
            </ul>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Rendimiento y Carga</strong>
                    <p>En dispositivos con conexión lenta, puede ajustar la frecuencia de actualización en Configuración para reducir el consumo de datos.</p>
                </div>
            </div>

            <h3>Casos de Uso</h3>

            <h4>Durante la Jornada Electoral</h4>
            <ol>
                <li>Monitorear participación general en tiempo real</li>
                <li>Identificar mesas con baja participación</li>
                <li>Evaluar efectividad de movilización de picks</li>
                <li>Ajustar estrategia según tendencias observadas</li>
            </ol>

            <h4>Post-Electoral</h4>
            <ol>
                <li>Análisis de resultados finales de participación</li>
                <li>Evaluación de estrategias implementadas</li>
                <li>Identificación de zonas para fortalecer</li>
                <li>Planificación para futuras elecciones</li>
            </ol>

            <h3>Mejores Prácticas</h3>

            <ul>
                <li><strong>Monitoreo constante:</strong> Revise las estadísticas cada 30-60 minutos</li>
                <li><strong>Acción basada en datos:</strong> Use las estadísticas para decisiones tácticas</li>
                <li><strong>Documentación:</strong> Exporte reportes periódicos durante el día</li>
                <li><strong>Análisis contextual:</strong> Considere factores externos (clima, eventos, etc.)</li>
                <li><strong>Comunicación:</strong> Comparta estadísticas clave con el equipo de coordinación</li>
            </ul>
        </div>
    `
};

export default moduleAdvancedDocs;
