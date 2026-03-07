const workflowDocs = {
    'flujo-preelectoral': `
        <div class="doc-section">
            <h2>Guía: Preparación Pre-Electoral</h2>

            <p>Esta guía detalla todas las tareas necesarias para preparar el sistema PickPad antes de la jornada electoral.</p>

            <h3>Línea de Tiempo Recomendada</h3>

            <div class="workflow-diagram">
                <div class="workflow-step">
                    <div class="workflow-icon">30</div>
                    <div class="workflow-content">
                        <h4>30 Días Antes - Configuración Inicial</h4>
                        <ul>
                            <li>Obtener padrón electoral oficial actualizado</li>
                            <li>Configurar información electoral en el sistema</li>
                            <li>Definir estructura de permisos y roles</li>
                            <li>Planificar distribución de fiscales</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">21</div>
                    <div class="workflow-content">
                        <h4>21 Días Antes - Carga de Datos</h4>
                        <ul>
                            <li>Importar padrón electoral al sistema</li>
                            <li>Verificar integridad de los datos</li>
                            <li>Corregir errores detectados</li>
                            <li>Exportar backup completo</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">14</div>
                    <div class="workflow-content">
                        <h4>14 Días Antes - Gestión de Usuarios</h4>
                        <ul>
                            <li>Crear cuentas de coordinadores</li>
                            <li>Crear cuentas de fiscales</li>
                            <li>Distribuir credenciales de acceso</li>
                            <li>Capacitar usuarios en el uso del sistema</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">7</div>
                    <div class="workflow-content">
                        <h4>7 Días Antes - Asignaciones y Picks</h4>
                        <ul>
                            <li>Asignar fiscales a mesas específicas</li>
                            <li>Cargar picks estratégicos (si aplica)</li>
                            <li>Configurar mesas testigo</li>
                            <li>Verificar que todos los fiscales tienen acceso</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">2</div>
                    <div class="workflow-content">
                        <h4>2 Días Antes - Verificación Final</h4>
                        <ul>
                            <li>Realizar pruebas completas del sistema</li>
                            <li>Verificar conectividad de todos los usuarios</li>
                            <li>Exportar backups de seguridad</li>
                            <li>Preparar plan de contingencia</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">1</div>
                    <div class="workflow-content">
                        <h4>1 Día Antes - Preparativos Finales</h4>
                        <ul>
                            <li>Confirmar asistencia de todos los fiscales</li>
                            <li>Distribuir materiales de apoyo</li>
                            <li>Enviar recordatorios y horarios</li>
                            <li>Activar modo fiscalización</li>
                        </ul>
                    </div>
                </div>
            </div>

            <h3>Tareas Detalladas por Módulo</h3>

            <h4>Módulo: Configuración</h4>
            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <p><strong>Checklist:</strong></p>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li>☐ Nombre de la elección configurado</li>
                        <li>☐ Fecha de elección establecida</li>
                        <li>☐ Horarios de apertura/cierre definidos</li>
                        <li>☐ Parámetros de seguridad ajustados</li>
                        <li>☐ Módulos necesarios activados</li>
                        <li>☐ Participación histórica cargada (si aplica)</li>
                    </ul>
                </div>
            </div>

            <h4>Módulo: Padrones</h4>
            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <p><strong>Checklist:</strong></p>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li>☐ Padrón oficial descargado</li>
                        <li>☐ Formato Excel preparado correctamente</li>
                        <li>☐ Importación realizada sin errores</li>
                        <li>☐ Total de votantes verificado</li>
                        <li>☐ Distribución por mesa validada</li>
                        <li>☐ Backup del padrón exportado</li>
                    </ul>
                </div>
            </div>

            <h4>Módulo: Usuarios</h4>
            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <p><strong>Checklist:</strong></p>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li>☐ Administradores creados</li>
                        <li>☐ Coordinadores creados</li>
                        <li>☐ Fiscales creados (uno por mesa)</li>
                        <li>☐ Credenciales distribuidas</li>
                        <li>☐ Todos los usuarios testearon acceso</li>
                        <li>☐ Capacitación completada</li>
                    </ul>
                </div>
            </div>

            <h4>Módulo: Control de Mesas</h4>
            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <p><strong>Checklist:</strong></p>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li>☐ Todas las mesas tienen fiscal asignado</li>
                        <li>☐ Información de ubicación completa</li>
                        <li>☐ Observaciones especiales registradas</li>
                        <li>☐ Fiscales suplentes identificados</li>
                        <li>☐ Listado de asignaciones exportado</li>
                    </ul>
                </div>
            </div>

            <h4>Módulo: Picks (Opcional)</h4>
            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <p><strong>Checklist:</strong></p>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li>☐ Listado de picks preparado</li>
                        <li>☐ EmoPicks asignados</li>
                        <li>☐ Importación masiva completada</li>
                        <li>☐ Verificación de datos correctos</li>
                        <li>☐ Estrategia de movilización definida</li>
                    </ul>
                </div>
            </div>

            <h4>Módulo: Mesa Testigo (Opcional)</h4>
            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <p><strong>Checklist:</strong></p>
                    <ul style="margin: 0; padding-left: 1.5rem;">
                        <li>☐ Muestra estadística definida</li>
                        <li>☐ Mesas testigo seleccionadas</li>
                        <li>☐ Operadores capacitados en carga</li>
                        <li>☐ Formularios de escrutinio preparados</li>
                    </ul>
                </div>
            </div>

            <h3>Capacitación de Usuarios</h3>

            <h4>Temas para Fiscales (Nivel 4)</h4>
            <ol>
                <li>Cómo iniciar sesión en el sistema</li>
                <li>Navegación básica de la interfaz</li>
                <li>Uso del módulo Fiscalizar</li>
                <li>Búsqueda por documento y por orden</li>
                <li>Cómo marcar votantes</li>
                <li>Qué hacer en caso de errores</li>
                <li>Importancia de mantener conexión estable</li>
                <li>Contactos de soporte técnico</li>
            </ol>

            <h4>Temas para Coordinadores (Nivel 3)</h4>
            <ol>
                <li>Todo lo anterior para fiscales</li>
                <li>Módulo de Estadísticas en tiempo real</li>
                <li>Gestión de Picks y movilización</li>
                <li>Monitoreo de mesas</li>
                <li>Interpretación de tendencias</li>
                <li>Exportación de reportes</li>
            </ol>

            <h4>Temas para Administradores (Nivel 1-2)</h4>
            <ol>
                <li>Todo lo anterior</li>
                <li>Gestión de usuarios</li>
                <li>Control de mesas y asignaciones</li>
                <li>Importación/exportación de padrones</li>
                <li>Configuración del sistema</li>
                <li>Resolución de problemas técnicos</li>
                <li>Backup y recuperación</li>
            </ol>

            <h3>Pruebas y Validación</h3>

            <h4>Pruebas Funcionales</h4>
            <ul>
                <li>Login exitoso de todos los usuarios</li>
                <li>Búsqueda en padrón funciona correctamente</li>
                <li>Marcación de votantes registra correctamente</li>
                <li>Estadísticas se actualizan en tiempo real</li>
                <li>Exportaciones generan archivos válidos</li>
                <li>Permisos por nivel funcionan correctamente</li>
            </ul>

            <h4>Pruebas de Carga</h4>
            <ul>
                <li>Múltiples usuarios simultáneos</li>
                <li>Marcación masiva de votantes</li>
                <li>Generación de estadísticas con alta carga</li>
                <li>Respuesta del sistema bajo estrés</li>
            </ul>

            <h3>Plan de Contingencia</h3>

            <h4>Escenarios y Soluciones</h4>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Escenario</th>
                            <th>Plan de Contingencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Caída del sistema</td>
                            <td>Usar padrón físico impreso + carga manual posterior</td>
                        </tr>
                        <tr>
                            <td>Fiscal sin conectividad</td>
                            <td>Registro en papel + sincronización posterior</td>
                        </tr>
                        <tr>
                            <td>Fiscal ausente</td>
                            <td>Activar fiscal suplente pre-identificado</td>
                        </tr>
                        <tr>
                            <td>Error en padrón</td>
                            <td>Restaurar desde backup más reciente</td>
                        </tr>
                        <tr>
                            <td>Problemas de acceso</td>
                            <td>Línea de soporte técnico disponible</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Recomendación Final</strong>
                    <p>La clave del éxito es la preparación anticipada. No deje tareas críticas para último momento. Un sistema bien configurado y un equipo bien capacitado garantizan una jornada electoral sin contratiempos.</p>
                </div>
            </div>
        </div>
    `,

    'flujo-jornada': `
        <div class="doc-section">
            <h2>Guía: Jornada Electoral</h2>

            <p>Esta guía detalla el uso del sistema PickPad durante el día de la elección, desde la apertura hasta el cierre de mesas.</p>

            <h3>Cronograma del Día</h3>

            <div class="workflow-diagram">
                <div class="workflow-step">
                    <div class="workflow-icon">7:00</div>
                    <div class="workflow-content">
                        <h4>Preparación Pre-Apertura</h4>
                        <p><strong>Coordinadores y Administradores:</strong></p>
                        <ul>
                            <li>Verificar que el sistema está operativo</li>
                            <li>Confirmar asistencia de fiscales</li>
                            <li>Revisar dashboard de Control de Mesas</li>
                            <li>Activar canales de comunicación</li>
                        </ul>
                        <p><strong>Fiscales:</strong></p>
                        <ul>
                            <li>Llegar al establecimiento asignado</li>
                            <li>Iniciar sesión en PickPad</li>
                            <li>Verificar acceso a su mesa</li>
                            <li>Confirmar disponibilidad de padrón físico</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">8:00</div>
                    <div class="workflow-content">
                        <h4>Apertura de Mesas</h4>
                        <p><strong>Fiscales:</strong></p>
                        <ul>
                            <li>Presenciar apertura formal de la mesa</li>
                            <li>Mantener sistema PickPad abierto y activo</li>
                            <li>Prepararse para registrar votantes</li>
                            <li>Reportar cualquier novedad a coordinadores</li>
                        </ul>
                        <p><strong>Coordinadores:</strong></p>
                        <ul>
                            <li>Monitorear que todas las mesas estén activas</li>
                            <li>Verificar primeros registros de votación</li>
                            <li>Contactar mesas sin actividad</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">8:00-12:00</div>
                    <div class="workflow-content">
                        <h4>Mañana Electoral</h4>
                        <p><strong>Fiscales:</strong></p>
                        <ul>
                            <li>Registrar cada votante inmediatamente después de votar</li>
                            <li>Usar búsqueda por documento o por orden según flujo</li>
                            <li>Mantener dispositivo cargado</li>
                            <li>Reportar problemas técnicos de inmediato</li>
                        </ul>
                        <p><strong>Coordinadores:</strong></p>
                        <ul>
                            <li>Revisar estadísticas cada 30 minutos</li>
                            <li>Identificar mesas con baja participación</li>
                            <li>Monitorear asistencia de picks</li>
                            <li>Coordinar movilización si es necesario</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">12:00-14:00</div>
                    <div class="workflow-content">
                        <h4>Horario Pico Mediodía</h4>
                        <p><strong>Fiscales:</strong></p>
                        <ul>
                            <li>Prepararse para alta afluencia</li>
                            <li>Priorizar velocidad usando búsqueda por orden</li>
                            <li>No acumular registros pendientes</li>
                            <li>Solicitar apoyo si el flujo es inmanejable</li>
                        </ul>
                        <p><strong>Coordinadores:</strong></p>
                        <ul>
                            <li>Monitoreo intensivo de estadísticas</li>
                            <li>Evaluación de tendencias de participación</li>
                            <li>Ajuste de estrategia de movilización</li>
                            <li>Identificación de picks pendientes prioritarios</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">14:00-17:00</div>
                    <div class="workflow-content">
                        <h4>Tarde Electoral</h4>
                        <p><strong>Fiscales:</strong></p>
                        <ul>
                            <li>Continuar registro consistente</li>
                            <li>Revisar participación acumulada</li>
                            <li>Verificar que no haya registros pendientes</li>
                            <li>Prepararse para posible pico de última hora</li>
                        </ul>
                        <p><strong>Coordinadores:</strong></p>
                        <ul>
                            <li>Análisis de proyección final</li>
                            <li>Última ronda de movilización de picks</li>
                            <li>Evaluación comparativa con histórico</li>
                            <li>Preparación para cierre</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">17:00-18:00</div>
                    <div class="workflow-content">
                        <h4>Última Hora</h4>
                        <p><strong>Fiscales:</strong></p>
                        <ul>
                            <li>Prepararse para alta afluencia de última hora</li>
                            <li>Máxima velocidad de registro</li>
                            <li>Registrar hasta el último votante</li>
                            <li>No salir de la mesa prematuramente</li>
                        </ul>
                        <p><strong>Coordinadores:</strong></p>
                        <ul>
                            <li>Monitoreo intensivo final</li>
                            <li>Contacto con mesas de baja participación</li>
                            <li>Verificación de carga de mesas testigo (si aplica)</li>
                            <li>Preparación para análisis post-cierre</li>
                        </ul>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">18:00</div>
                    <div class="workflow-content">
                        <h4>Cierre de Mesas</h4>
                        <p><strong>Fiscales:</strong></p>
                        <ul>
                            <li>Registrar votantes en fila hasta las 18:00</li>
                            <li>Verificar estadísticas finales de la mesa</li>
                            <li>Revisar que no haya registros pendientes</li>
                            <li>Reportar participación final a coordinadores</li>
                            <li>Permanecer para escrutinio si es testigo</li>
                        </ul>
                        <p><strong>Coordinadores:</strong></p>
                        <ul>
                            <li>Consolidar estadísticas finales</li>
                            <li>Generar reportes de participación</li>
                            <li>Coordinar carga de resultados testigo</li>
                            <li>Exportar datos para análisis</li>
                        </ul>
                    </div>
                </div>
            </div>

            <h3>Buenas Prácticas Durante la Jornada</h3>

            <h4>Para Fiscales</h4>
            <ul>
                <li><strong>Registre inmediatamente:</strong> No acumule votantes, márquelos apenas voten</li>
                <li><strong>Verifique siempre:</strong> Confirme nombre antes de marcar</li>
                <li><strong>Mantenga conexión:</strong> WiFi o datos móviles activos todo el día</li>
                <li><strong>Batería:</strong> Dispositivo conectado a corriente o con powerbank</li>
                <li><strong>Backup:</strong> Padrón físico disponible por cualquier eventualidad</li>
                <li><strong>Comunicación:</strong> Canal abierto con coordinadores</li>
                <li><strong>No abandone:</strong> Permanezca hasta el cierre oficial</li>
            </ul>

            <h4>Para Coordinadores</h4>
            <ul>
                <li><strong>Monitoreo constante:</strong> Dashboard activo durante toda la jornada</li>
                <li><strong>Contacto proactivo:</strong> Llame a mesas inactivas antes que reporten problemas</li>
                <li><strong>Decisiones ágiles:</strong> Responda rápido a contingencias</li>
                <li><strong>Documentación:</strong> Registre todas las incidencias</li>
                <li><strong>Motivación:</strong> Mantenga al equipo motivado y enfocado</li>
                <li><strong>Análisis continuo:</strong> Use estadísticas para decisiones tácticas</li>
            </ul>

            <h3>Gestión de Incidencias Comunes</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Incidencia</th>
                            <th>Acción Inmediata</th>
                            <th>Responsable</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Fiscal sin conexión</td>
                            <td>Usar padrón físico, cargar luego</td>
                            <td>Fiscal</td>
                        </tr>
                        <tr>
                            <td>Fiscal ausente</td>
                            <td>Activar suplente inmediatamente</td>
                            <td>Coordinador</td>
                        </tr>
                        <tr>
                            <td>Mesa inactiva &gt;1 hora</td>
                            <td>Contactar fiscal, verificar situación</td>
                            <td>Coordinador</td>
                        </tr>
                        <tr>
                            <td>Votante no aparece</td>
                            <td>Verificar mesa correcta, buscar en padrón general</td>
                            <td>Fiscal</td>
                        </tr>
                        <tr>
                            <td>Error al marcar</td>
                            <td>Refrescar, reintentar, reportar si persiste</td>
                            <td>Fiscal</td>
                        </tr>
                        <tr>
                            <td>Baja participación</td>
                            <td>Activar movilización en esa zona</td>
                            <td>Coordinador</td>
                        </tr>
                        <tr>
                            <td>Sistema lento</td>
                            <td>Continuar operando, reportar a soporte</td>
                            <td>Todos</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Uso de Estadísticas Durante la Jornada</h3>

            <h4>Métricas Clave a Monitorear</h4>
            <ol>
                <li><strong>Participación General:</strong> Comparar con histórico y meta</li>
                <li><strong>Tendencia Horaria:</strong> Evaluar si sigue patrón normal</li>
                <li><strong>Participación por Zona:</strong> Identificar áreas rezagadas</li>
                <li><strong>Asistencia de Picks:</strong> Medir efectividad de movilización</li>
                <li><strong>Mesas Activas vs Inactivas:</strong> Detectar problemas operativos</li>
                <li><strong>Proyección Final:</strong> Anticipar resultado de participación</li>
            </ol>

            <h4>Momentos Críticos de Revisión</h4>
            <ul>
                <li><strong>10:00:</strong> Primera evaluación (esperado ~15-20%)</li>
                <li><strong>12:00:</strong> Evaluación pre-mediodía (esperado ~30-35%)</li>
                <li><strong>14:00:</strong> Post primer pico (esperado ~45-50%)</li>
                <li><strong>16:00:</strong> Tarde avanzada (esperado ~55-60%)</li>
                <li><strong>17:30:</strong> Última evaluación pre-cierre (esperado ~65-70%)</li>
            </ul>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Consejo de Coordinación</strong>
                    <p>Establezca horarios fijos para reportes de coordinadores (cada 2 horas). Esto mantiene flujo de información sin sobrecargar el sistema.</p>
                </div>
            </div>

            <h3>Comunicación y Coordinación</h3>

            <h4>Canales Recomendados</h4>
            <ul>
                <li><strong>PickPad:</strong> Registro y estadísticas (herramienta principal)</li>
                <li><strong>WhatsApp/Telegram:</strong> Comunicación rápida entre equipo</li>
                <li><strong>Llamadas:</strong> Para urgencias o mesas sin respuesta</li>
                <li><strong>Email:</strong> Solo para documentación post-jornada</li>
            </ul>

            <h4>Estructura de Comunicación</h4>
            <ul>
                <li><strong>Fiscales → Coordinadores de Zona:</strong> Reportes cada 2 horas</li>
                <li><strong>Coordinadores Zona → Coordinador General:</strong> Síntesis cada hora</li>
                <li><strong>Coordinador General → Administradores:</strong> Alertas críticas solo</li>
                <li><strong>Soporte Técnico:</strong> Canal separado para problemas del sistema</li>
            </ul>
        </div>
    `,

    'flujo-postelectoral': `
        <div class="doc-section">
            <h2>Guía: Cierre y Análisis Post-Electoral</h2>

            <p>Esta guía detalla las tareas posteriores al cierre de mesas, incluyendo consolidación de datos, análisis de resultados y preparación para futuras elecciones.</p>

            <h3>Tareas Inmediatas Post-Cierre (18:00 - 22:00)</h3>

            <h4>1. Consolidación de Participación</h4>
            <p><strong>Responsable: Coordinadores y Administradores</strong></p>

            <ol>
                <li>Verificar que todas las mesas reportaron datos finales</li>
                <li>Contactar mesas sin cierre registrado</li>
                <li>Consolidar estadísticas finales de participación</li>
                <li>Generar reporte ejecutivo de participación</li>
                <li>Exportar datos completos para archivo</li>
            </ol>

            <h4>2. Carga de Resultados Testigo (Si aplica)</h4>
            <p><strong>Responsable: Coordinadores Designados</strong></p>

            <ol>
                <li>Recibir actas de escrutinio de mesas testigo</li>
                <li>Cargar resultados en el módulo Mesa Testigo</li>
                <li>Validar que los totales cierren correctamente</li>
                <li>Monitorear proyecciones a medida que se cargan más mesas</li>
                <li>Generar informes preliminares de resultados</li>
            </ol>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Precaución: Proyecciones</strong>
                    <p>No difunda proyecciones con menos del 50% de mesas testigo procesadas. Las proyecciones preliminares pueden ser engañosas y generar confusión.</p>
                </div>
            </div>

            <h4>3. Backup Completo del Sistema</h4>
            <p><strong>Responsable: Administradores</strong></p>

            <ol>
                <li>Exportar padrón completo con datos de votación</li>
                <li>Exportar listado completo de picks con asistencia</li>
                <li>Exportar estadísticas consolidadas</li>
                <li>Exportar resultados testigo (si aplica)</li>
                <li>Guardar múltiples copias en ubicaciones seguras</li>
                <li>Etiquetar backups con fecha y elección</li>
            </ol>

            <h3>Análisis Detallado (Días Siguientes)</h3>

            <h4>1. Análisis de Participación</h4>

            <p><strong>Métricas a Evaluar:</strong></p>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Métrica</th>
                            <th>Objetivo del Análisis</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Participación Global</strong></td>
                            <td>Comparar con elecciones anteriores y con expectativas</td>
                        </tr>
                        <tr>
                            <td><strong>Participación por Localidad</strong></td>
                            <td>Identificar zonas de alto y bajo desempeño</td>
                        </tr>
                        <tr>
                            <td><strong>Participación por Mesa</strong></td>
                            <td>Detectar anomalías o mesas con problemas</td>
                        </tr>
                        <tr>
                            <td><strong>Evolución Horaria</strong></td>
                            <td>Analizar curva de afluencia vs histórico</td>
                        </tr>
                        <tr>
                            <td><strong>Asistencia de Picks</strong></td>
                            <td>Evaluar efectividad de identificación y movilización</td>
                        </tr>
                        <tr>
                            <td><strong>Comparación Inter-Electoral</strong></td>
                            <td>Tendencias a lo largo del tiempo</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>2. Análisis de Picks</h4>

            <p><strong>Preguntas Clave:</strong></p>

            <ul>
                <li>¿Qué porcentaje de picks positivos (😊) asistieron?</li>
                <li>¿Fue significativamente mayor que la participación general?</li>
                <li>¿Hubo diferencias entre localidades?</li>
                <li>¿Los picks neutros (😐) se comportaron como esperado?</li>
                <li>¿Los picks negativos (😢) tuvieron baja asistencia como anticipado?</li>
                <li>¿La movilización fue efectiva?</li>
            </ul>

            <h4>3. Análisis Operativo</h4>

            <p><strong>Evaluación del Proceso:</strong></p>

            <ul>
                <li>¿Todas las mesas tuvieron fiscal asignado y activo?</li>
                <li>¿Hubo mesas sin conectividad? ¿Cuántas?</li>
                <li>¿Los fiscales registraron en tiempo real o hubo retrasos?</li>
                <li>¿Se reportaron incidencias técnicas? ¿Cuáles?</li>
                <li>¿La capacitación fue suficiente?</li>
                <li>¿Qué mejoras se pueden implementar?</li>
            </ul>

            <h4>4. Análisis de Mesa Testigo (Si aplica)</h4>

            <p><strong>Evaluación de Proyecciones:</strong></p>

            <ul>
                <li>¿Las proyecciones fueron precisas?</li>
                <li>¿Con qué porcentaje de mesas se logró confiabilidad?</li>
                <li>¿La muestra fue representativa?</li>
                <li>¿Qué ajustes se necesitan para futuras elecciones?</li>
            </ul>

            <h3>Generación de Reportes</h3>

            <h4>Reporte Ejecutivo de Participación</h4>
            <p><strong>Contenido Sugerido:</strong></p>

            <ol>
                <li><strong>Resumen Ejecutivo</strong>
                    <ul>
                        <li>Participación final global</li>
                        <li>Comparación con histórico</li>
                        <li>Conclusiones principales</li>
                    </ul>
                </li>
                <li><strong>Datos Generales</strong>
                    <ul>
                        <li>Total de votantes habilitados</li>
                        <li>Total que votaron</li>
                        <li>Porcentaje de participación</li>
                        <li>Comparación con últimas 3 elecciones</li>
                    </ul>
                </li>
                <li><strong>Análisis por Localidad</strong>
                    <ul>
                        <li>Tabla con participación por zona</li>
                        <li>Gráfico comparativo</li>
                        <li>Zonas destacadas (altas y bajas)</li>
                    </ul>
                </li>
                <li><strong>Evolución Horaria</strong>
                    <ul>
                        <li>Gráfico de tendencia</li>
                        <li>Identificación de picos</li>
                        <li>Comparación con patrón histórico</li>
                    </ul>
                </li>
                <li><strong>Análisis de Picks</strong>
                    <ul>
                        <li>Tasa de asistencia por emopick</li>
                        <li>Comparación con población general</li>
                        <li>Efectividad de movilización</li>
                    </ul>
                </li>
                <li><strong>Conclusiones y Recomendaciones</strong>
                    <ul>
                        <li>Logros principales</li>
                        <li>Áreas de mejora</li>
                        <li>Recomendaciones para próxima elección</li>
                    </ul>
                </li>
            </ol>

            <h4>Reporte Técnico del Sistema</h4>
            <p><strong>Contenido Sugerido:</strong></p>

            <ol>
                <li>Disponibilidad del sistema durante la jornada</li>
                <li>Mesas activas vs inactivas</li>
                <li>Incidencias técnicas reportadas</li>
                <li>Tiempo de respuesta promedio</li>
                <li>Efectividad de la capacitación</li>
                <li>Mejoras propuestas</li>
            </ol>

            <h3>Cierre Administrativo del Sistema</h3>

            <h4>Tareas de Cierre (1-2 Semanas Después)</h4>

            <ol>
                <li><strong>Desactivar Modo Fiscalización</strong>
                    <ul>
                        <li>Desde Configuración, desactive modo jornada electoral</li>
                        <li>Ajuste tiempos de sesión a valores normales</li>
                    </ul>
                </li>
                <li><strong>Gestión de Usuarios</strong>
                    <ul>
                        <li>Desactive cuentas de fiscales temporales</li>
                        <li>Mantenga activos solo usuarios permanentes</li>
                        <li>Documente quiénes mantienen acceso</li>
                    </ul>
                </li>
                <li><strong>Archivo de Documentación</strong>
                    <ul>
                        <li>Guarde todos los reportes generados</li>
                        <li>Archive backups con identificación clara</li>
                        <li>Documente lecciones aprendidas</li>
                    </ul>
                </li>
                <li><strong>Preparación para Próxima Elección</strong>
                    <ul>
                        <li>Registre mejoras a implementar</li>
                        <li>Actualice procedimientos basados en experiencia</li>
                        <li>Prepare checklist mejorado</li>
                    </ul>
                </li>
            </ol>

            <h3>Lecciones Aprendidas</h3>

            <h4>Reunión de Evaluación</h4>
            <p>Convoque reunión con todo el equipo para evaluar:</p>

            <ul>
                <li><strong>¿Qué funcionó bien?</strong> - Mantener para próxima vez</li>
                <li><strong>¿Qué no funcionó?</strong> - Identificar causas y soluciones</li>
                <li><strong>¿Qué sorprendió?</strong> - Situaciones no anticipadas</li>
                <li><strong>¿Qué cambiaríamos?</strong> - Mejoras concretas</li>
                <li><strong>¿Qué capacitación faltó?</strong> - Necesidades de formación</li>
            </ul>

            <h4>Documentación de Mejoras</h4>
            <p>Documente formalmente:</p>

            <ol>
                <li>Problemas identificados y sus causas</li>
                <li>Soluciones propuestas</li>
                <li>Responsables de implementar mejoras</li>
                <li>Fecha objetivo de implementación</li>
                <li>Métricas para evaluar mejoras</li>
            </ol>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Mejora Continua</strong>
                    <p>Cada elección es una oportunidad de aprendizaje. La documentación detallada de lecciones aprendidas es clave para perfeccionar el proceso electoral y lograr operaciones cada vez más eficientes.</p>
                </div>
            </div>
        </div>
    `,

    'coordinacion': `
        <div class="doc-section">
            <h2>Guía: Coordinación de Roles y Equipos</h2>

            <p>Esta guía detalla cómo coordinar efectivamente a los diferentes roles dentro del sistema PickPad para lograr una operación electoral exitosa.</p>

            <h3>Estructura Organizacional</h3>

            <div class="workflow-diagram">
                <div class="workflow-step">
                    <div class="workflow-icon">👑</div>
                    <div class="workflow-content">
                        <h4>Super Administrador (Nivel 1)</h4>
                        <p><strong>Responsabilidades:</strong></p>
                        <ul>
                            <li>Configuración inicial del sistema</li>
                            <li>Creación de administradores</li>
                            <li>Supervisión general</li>
                            <li>Resolución de conflictos críticos</li>
                            <li>Respaldo y recuperación de datos</li>
                        </ul>
                        <p><strong>Cantidad Recomendada:</strong> 1-2 personas</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">⚙️</div>
                    <div class="workflow-content">
                        <h4>Administradores (Nivel 2)</h4>
                        <p><strong>Responsabilidades:</strong></p>
                        <ul>
                            <li>Gestión de usuarios (niveles 3-5)</li>
                            <li>Importación y gestión de padrones</li>
                            <li>Asignación de fiscales a mesas</li>
                            <li>Configuración de módulos</li>
                            <li>Soporte técnico durante jornada</li>
                        </ul>
                        <p><strong>Cantidad Recomendada:</strong> 2-4 personas</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">📊</div>
                    <div class="workflow-content">
                        <h4>Coordinadores (Nivel 3)</h4>
                        <p><strong>Responsabilidades:</strong></p>
                        <ul>
                            <li>Monitoreo de estadísticas en tiempo real</li>
                            <li>Gestión de picks y movilización</li>
                            <li>Supervisión de fiscales en su zona</li>
                            <li>Generación de reportes</li>
                            <li>Toma de decisiones tácticas</li>
                        </ul>
                        <p><strong>Cantidad Recomendada:</strong> 1 por cada 20-30 mesas</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">✅</div>
                    <div class="workflow-content">
                        <h4>Fiscales (Nivel 4)</h4>
                        <p><strong>Responsabilidades:</strong></p>
                        <ul>
                            <li>Fiscalización de mesa asignada</li>
                            <li>Registro de votantes en tiempo real</li>
                            <li>Reporte de novedades a coordinador</li>
                            <li>Cumplimiento de horarios</li>
                        </ul>
                        <p><strong>Cantidad Recomendada:</strong> 1 por mesa (+ suplentes)</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">🔍</div>
                    <div class="workflow-content">
                        <h4>Consultores (Nivel 5)</h4>
                        <p><strong>Responsabilidades:</strong></p>
                        <ul>
                            <li>Consulta del padrón electoral</li>
                            <li>Atención a consultas de votantes</li>
                            <li>Orientación sobre lugares de votación</li>
                        </ul>
                        <p><strong>Cantidad Recomendada:</strong> Según necesidad</p>
                    </div>
                </div>
            </div>

            <h3>Matriz de Permisos y Accesos</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Módulo / Acción</th>
                            <th>Nivel 1</th>
                            <th>Nivel 2</th>
                            <th>Nivel 3</th>
                            <th>Nivel 4</th>
                            <th>Nivel 5</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Búsqueda</strong></td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                        </tr>
                        <tr>
                            <td><strong>Fiscalizar</strong></td>
                            <td>✅ Todas</td>
                            <td>✅ Todas</td>
                            <td>✅ Todas</td>
                            <td>✅ Su mesa</td>
                            <td>❌ No</td>
                        </tr>
                        <tr>
                            <td><strong>Mesa Testigo</strong></td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>✅ Solo ver</td>
                            <td>❌ No</td>
                            <td>❌ No</td>
                        </tr>
                        <tr>
                            <td><strong>Picks</strong></td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>❌ No</td>
                            <td>❌ No</td>
                        </tr>
                        <tr>
                            <td><strong>Estadísticas</strong></td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>✅ Su mesa</td>
                            <td>✅ General</td>
                        </tr>
                        <tr>
                            <td><strong>Control Mesas</strong></td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>✅ Solo ver</td>
                            <td>❌ No</td>
                            <td>❌ No</td>
                        </tr>
                        <tr>
                            <td><strong>Usuarios</strong></td>
                            <td>✅ Todos</td>
                            <td>✅ 3-5</td>
                            <td>❌ No</td>
                            <td>❌ No</td>
                            <td>❌ No</td>
                        </tr>
                        <tr>
                            <td><strong>Padrones</strong></td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>❌ No</td>
                            <td>❌ No</td>
                            <td>❌ No</td>
                        </tr>
                        <tr>
                            <td><strong>Configuración</strong></td>
                            <td>✅ Total</td>
                            <td>✅ Total</td>
                            <td>❌ No</td>
                            <td>❌ No</td>
                            <td>❌ No</td>
                        </tr>
                        <tr>
                            <td><strong>Perfil</strong></td>
                            <td>✅ Propio</td>
                            <td>✅ Propio</td>
                            <td>✅ Propio</td>
                            <td>✅ Propio</td>
                            <td>✅ Propio</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Flujos de Comunicación</h3>

            <h4>Cadena de Reporte Estándar</h4>

            <ol>
                <li><strong>Fiscales → Coordinador de Zona</strong>
                    <ul>
                        <li>Reportes cada 2 horas durante jornada</li>
                        <li>Inmediato si hay incidencias</li>
                        <li>Canal: WhatsApp/Telegram grupal por zona</li>
                    </ul>
                </li>
                <li><strong>Coordinador Zona → Coordinador General</strong>
                    <ul>
                        <li>Síntesis cada hora</li>
                        <li>Inmediato si hay problemas críticos</li>
                        <li>Canal: WhatsApp/Telegram coordinadores</li>
                    </ul>
                </li>
                <li><strong>Coordinador General → Administradores</strong>
                    <ul>
                        <li>Alertas solo si requieren intervención administrativa</li>
                        <li>Canal: Directo por llamada o mensaje</li>
                    </ul>
                </li>
                <li><strong>Cualquiera → Soporte Técnico</strong>
                    <ul>
                        <li>Canal separado para problemas del sistema</li>
                        <li>Línea directa disponible durante jornada</li>
                    </ul>
                </li>
            </ol>

            <h4>Tipos de Comunicaciones</h4>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Medio</th>
                            <th>Urgencia</th>
                            <th>Ejemplo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Rutina</strong></td>
                            <td>WhatsApp grupal</td>
                            <td>Baja</td>
                            <td>"Mesa 101: 45% participación a las 12:00"</td>
                        </tr>
                        <tr>
                            <td><strong>Consulta</strong></td>
                            <td>WhatsApp directo</td>
                            <td>Media</td>
                            <td>"¿Cómo marco a un votante que no aparece?"</td>
                        </tr>
                        <tr>
                            <td><strong>Incidencia</strong></td>
                            <td>Llamada + mensaje</td>
                            <td>Alta</td>
                            <td>"Mesa 205 sin fiscal, necesito suplente"</td>
                        </tr>
                        <tr>
                            <td><strong>Emergencia</strong></td>
                            <td>Llamada inmediata</td>
                            <td>Crítica</td>
                            <td>"Sistema caído, no puedo marcar votantes"</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Reuniones y Coordinación</h3>

            <h4>Pre-Electoral</h4>
            <ul>
                <li><strong>1 mes antes:</strong> Kick-off con todo el equipo directivo</li>
                <li><strong>2 semanas antes:</strong> Capacitación de coordinadores</li>
                <li><strong>1 semana antes:</strong> Capacitación de fiscales (por zonas)</li>
                <li><strong>2 días antes:</strong> Reunión final de verificación</li>
                <li><strong>1 día antes:</strong> Confirmaciones finales por WhatsApp</li>
            </ul>

            <h4>Durante Jornada</h4>
            <ul>
                <li><strong>7:30 AM:</strong> Llamada de coordinación pre-apertura</li>
                <li><strong>10:00 AM:</strong> Primera evaluación (coordinadores)</li>
                <li><strong>14:00 PM:</strong> Evaluación post primer pico</li>
                <li><strong>17:00 PM:</strong> Evaluación pre-cierre</li>
                <li><strong>19:00 PM:</strong> Consolidación post-cierre</li>
            </ul>

            <h4>Post-Electoral</h4>
            <ul>
                <li><strong>Noche electoral:</strong> Reunión de cierre y agradecimientos</li>
                <li><strong>2-3 días después:</strong> Reunión de análisis de resultados</li>
                <li><strong>1 semana después:</strong> Reunión de lecciones aprendidas</li>
            </ul>

            <h3>Resolución de Conflictos</h3>

            <h4>Escalamiento de Problemas</h4>

            <ol>
                <li><strong>Nivel 1 - Fiscal intenta resolver</strong>
                    <ul>
                        <li>Problemas técnicos simples</li>
                        <li>Consultas básicas del sistema</li>
                        <li>Tiempo: 5 minutos</li>
                    </ul>
                </li>
                <li><strong>Nivel 2 - Contacta a Coordinador</strong>
                    <ul>
                        <li>Problemas que persisten</li>
                        <li>Requieren decisión operativa</li>
                        <li>Tiempo: 10 minutos</li>
                    </ul>
                </li>
                <li><strong>Nivel 3 - Coordinador contacta Administrador</strong>
                    <ul>
                        <li>Requieren acción administrativa</li>
                        <li>Problemas sistémicos</li>
                        <li>Tiempo: 15 minutos</li>
                    </ul>
                </li>
                <li><strong>Nivel 4 - Administrador contacta Soporte Técnico</strong>
                    <ul>
                        <li>Fallas del sistema</li>
                        <li>Errores críticos</li>
                        <li>Inmediato</li>
                    </ul>
                </li>
            </ol>

            <h4>Problemas Comunes y Responsables</h4>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Problema</th>
                            <th>Resuelve</th>
                            <th>Tiempo Máximo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Fiscal olvidó contraseña</td>
                            <td>Administrador</td>
                            <td>10 minutos</td>
                        </tr>
                        <tr>
                            <td>Fiscal ausente</td>
                            <td>Coordinador</td>
                            <td>30 minutos</td>
                        </tr>
                        <tr>
                            <td>Mesa sin conectividad</td>
                            <td>Fiscal (usa papel)</td>
                            <td>Inmediato</td>
                        </tr>
                        <tr>
                            <td>Error al marcar votante</td>
                            <td>Coordinador</td>
                            <td>15 minutos</td>
                        </tr>
                        <tr>
                            <td>Sistema caído</td>
                            <td>Soporte Técnico</td>
                            <td>30 minutos</td>
                        </tr>
                        <tr>
                            <td>Baja participación</td>
                            <td>Coordinador</td>
                            <td>Continuo</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Mejores Prácticas de Coordinación</h3>

            <ul>
                <li><strong>Claridad de roles:</strong> Cada persona sabe exactamente qué debe hacer</li>
                <li><strong>Canales definidos:</strong> Comunicación por vías establecidas</li>
                <li><strong>Respaldo siempre:</strong> Plan B para cada rol crítico</li>
                <li><strong>Documentación:</strong> Registrar decisiones y acciones importantes</li>
                <li><strong>Reconocimiento:</strong> Valorar el trabajo del equipo</li>
                <li><strong>Aprendizaje:</strong> Capturar lecciones para mejorar</li>
            </ul>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Clave del Éxito</strong>
                    <p>Una coordinación efectiva es la diferencia entre una jornada electoral exitosa y una problemática. Invierta tiempo en definir roles, capacitar al equipo y establecer canales claros de comunicación. El esfuerzo pre-electoral se traduce en una operación fluida el día de la elección.</p>
                </div>
            </div>
        </div>
    `
};

export default workflowDocs;
