const helpDocs = {
    'faq': `
        <div class="doc-section">
            <h2>Preguntas Frecuentes (FAQ)</h2>

            <p>Encuentre respuestas rápidas a las preguntas más comunes sobre PickPad.</p>

            <h3>Acceso y Seguridad</h3>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Olvidé mi contraseña, qué hago?</h4>
                    <p>Contacte inmediatamente a su coordinador o a un administrador del sistema. Ellos pueden restablecer su contraseña. NO intente adivinar repetidamente ya que su cuenta se bloqueará después de varios intentos fallidos.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Mi cuenta está bloqueada, cómo la desbloqueo?</h4>
                    <p>Las cuentas se bloquean automáticamente después de varios intentos fallidos de login. Puede esperar 15 minutos para que se desbloquee automáticamente, o contactar a un administrador para desbloqueo inmediato.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Por qué me cierra sesión automáticamente?</h4>
                    <p>Por seguridad, el sistema cierra sesiones después de 30 minutos de inactividad. Recibirá una advertencia 5 minutos antes. Durante la jornada electoral, este tiempo puede extenderse a 60 minutos.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Puedo acceder desde mi celular?</h4>
                    <p>Sí, PickPad es una aplicación web responsive que funciona en cualquier dispositivo con navegador moderno: computadora, tablet o smartphone. Se recomienda Chrome, Firefox, Safari o Edge actualizados.</p>
                </div>
            </div>

            <h3>Módulo Fiscalizar</h3>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">No puedo ver mi mesa asignada, ¿por qué?</h4>
                    <p>Si es fiscal (nivel 4), debe tener una mesa asignada por un administrador. Si no aparece, contacte a su coordinador para que le asignen la mesa correcta.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">Busco un votante por documento y no aparece, ¿qué hago?</h4>
                    <p>Verifique que está en la mesa correcta. El votante puede estar asignado a otra mesa. Si es coordinador o administrador, use el módulo Búsqueda para encontrar en qué mesa está empadronado.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">Marqué un votante por error, ¿puedo desmarcarlo?</h4>
                    <p>Si es nivel 4 (fiscal), NO puede desmarcar. Debe contactar a un coordinador o administrador para que lo haga. Si es nivel 1-3, puede hacer clic nuevamente en el botón para desmarcar.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Qué hago si pierdo conexión a Internet?</h4>
                    <p>Use el padrón físico impreso como respaldo. Registre en papel quiénes votaron y cuando recupere conexión, marque todos los votantes en el sistema. No espere hasta el final del día para hacerlo.</p>
                </div>
            </div>

            <h3>Módulo Búsqueda</h3>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">Busco por apellido y salen muchos resultados, ¿cómo filtro más?</h4>
                    <p>Use la búsqueda avanzada (botón "Usar Filtros"). Combine apellido + localidad, o apellido + número de mesa para refinar los resultados.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿La búsqueda distingue mayúsculas y minúsculas?</h4>
                    <p>No, puede buscar en mayúsculas o minúsculas indistintamente. El sistema encontrará coincidencias sin importar el formato.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Qué significan los emoticones (😊 😐 😢) en los resultados?</h4>
                    <p>Son EmoPicks, indicadores de clasificación estratégica de votantes. 😊 = compromiso positivo, 😐 = neutro, 😢 = negativo. Solo los ven usuarios de nivel 1-3 con acceso al módulo Picks.</p>
                </div>
            </div>

            <h3>Módulo Picks</h3>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Cómo asigno un pick a un votante?</h4>
                    <p>Busque el votante, haga clic en el ícono de estrella (★) en los resultados, seleccione el EmoPick correspondiente (😊 😐 😢) y confirme. También puede importar picks masivamente desde Excel.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Los fiscales pueden ver los picks?</h4>
                    <p>No, solo usuarios de nivel 1-3 (administradores y coordinadores) tienen acceso al módulo Picks. Es información estratégica confidencial.</p>
                </div>
            </div>

            <h3>Módulo Estadísticas</h3>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Cada cuánto se actualizan las estadísticas?</h4>
                    <p>Las estadísticas se actualizan cada 1-2 minutos durante la jornada electoral. Los gráficos se actualizan cada 2 minutos para optimizar rendimiento.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿La proyección de participación final es confiable?</h4>
                    <p>La proyección se basa en datos históricos y tendencias actuales. Es una estimación útil pero no definitiva. La confiabilidad aumenta a medida que avanza el día.</p>
                </div>
            </div>

            <h3>Gestión de Usuarios</h3>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Cuántos usuarios puedo crear?</h4>
                    <p>No hay límite técnico. Cree los usuarios necesarios según su estructura: 1 fiscal por mesa, coordinadores según zonas, y administradores según necesidad.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Puedo cambiar el nivel de un usuario después de crearlo?</h4>
                    <p>Sí, los administradores pueden cambiar el tipo de usuario en cualquier momento. Los cambios aplican inmediatamente. Tenga en cuenta que si cambia un fiscal (nivel 4) a otro tipo, perderá su asignación de mesa.</p>
                </div>
            </div>

            <h3>Gestión de Padrones</h3>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Qué formato debe tener el archivo Excel del padrón?</h4>
                    <p>Debe ser .xlsx con columnas específicas: documento, apellido, nombre, clase, localidad, mesa, orden. Descargue la plantilla oficial desde el módulo Padrones para asegurar el formato correcto.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Qué diferencia hay entre "Agregar", "Actualizar" y "Reemplazar"?</h4>
                    <p><strong>Agregar:</strong> Solo agrega nuevos, no toca existentes. <strong>Actualizar:</strong> Actualiza existentes y agrega nuevos. <strong>Reemplazar:</strong> ELIMINA TODO y carga desde cero (¡use con extrema precaución!).</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">La importación rechazó algunos registros, ¿qué hago?</h4>
                    <p>Revise el detalle de errores que muestra el sistema. Los problemas comunes son: campos vacíos, formatos incorrectos, documentos duplicados. Corrija el Excel y vuelva a importar solo los registros problemáticos.</p>
                </div>
            </div>

            <h3>Exportación y Reportes</h3>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Puedo exportar datos durante la jornada electoral?</h4>
                    <p>Sí, puede exportar estadísticas y datos en cualquier momento. Sin embargo, sea consciente de que datos exportados durante la jornada son parciales y cambiarán constantemente.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿En qué formato es mejor exportar: Excel, CSV o PDF?</h4>
                    <p><strong>Excel:</strong> Para análisis y procesamiento de datos. <strong>CSV:</strong> Para integración con otros sistemas. <strong>PDF:</strong> Para impresión y distribución visual.</p>
                </div>
            </div>

            <h3>Problemas Técnicos</h3>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">El sistema está lento, ¿qué hago?</h4>
                    <p>Primero verifique su conexión a Internet. Si es lenta, cierre otras pestañas/aplicaciones. Si el problema persiste y afecta a múltiples usuarios, contacte a soporte técnico. Mientras tanto, continúe operando con padrón físico.</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Qué navegadores son compatibles con PickPad?</h4>
                    <p>Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. Siempre use la versión más reciente de su navegador. No se recomienda Internet Explorer (obsoleto).</p>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">¿Puedo usar PickPad sin conexión a Internet?</h4>
                    <p>No, PickPad requiere conexión activa para funcionar ya que los datos se sincronizan en tiempo real. Por eso es crítico tener WiFi o datos móviles estables, y mantener padrón físico como respaldo.</p>
                </div>
            </div>
        </div>
    `,

    'troubleshooting': `
        <div class="doc-section">
            <h2>Solución de Problemas</h2>

            <p>Guía detallada para resolver los problemas más comunes que puede encontrar al usar PickPad.</p>

            <h3>Problemas de Acceso</h3>

            <h4>No puedo iniciar sesión</h4>

            <p><strong>Síntomas:</strong> Al ingresar email y contraseña, muestra error o no permite acceder.</p>

            <p><strong>Causas posibles y soluciones:</strong></p>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Causa</th>
                            <th>Cómo identificar</th>
                            <th>Solución</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Contraseña incorrecta</td>
                            <td>Mensaje: "Credenciales inválidas"</td>
                            <td>Verifique mayúsculas/minúsculas. Si olvidó la contraseña, contacte administrador</td>
                        </tr>
                        <tr>
                            <td>Email incorrecto</td>
                            <td>Mensaje: "Usuario no encontrado"</td>
                            <td>Verifique que escribió el email completo correctamente</td>
                        </tr>
                        <tr>
                            <td>Cuenta bloqueada</td>
                            <td>Mensaje: "Cuenta temporalmente bloqueada"</td>
                            <td>Espere 15 minutos o contacte administrador</td>
                        </tr>
                        <tr>
                            <td>Cuenta desactivada</td>
                            <td>Mensaje: "Cuenta inactiva"</td>
                            <td>Contacte administrador para reactivar su cuenta</td>
                        </tr>
                        <tr>
                            <td>Problema de conexión</td>
                            <td>La página no carga o da timeout</td>
                            <td>Verifique su conexión a Internet, intente recargar (F5)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>Me cierra sesión constantemente</h4>

            <p><strong>Síntomas:</strong> El sistema cierra sesión cada pocos minutos.</p>

            <p><strong>Soluciones:</strong></p>

            <ol>
                <li><strong>Verifique inactividad:</strong> El sistema cierra sesión tras 30 min sin actividad. Mueva el mouse o haga clic periódicamente</li>
                <li><strong>Problemas de cookies:</strong> Asegúrese que su navegador acepta cookies. Vaya a configuración del navegador → Privacidad → Permitir cookies</li>
                <li><strong>Múltiples pestañas:</strong> No abra PickPad en múltiples pestañas simultáneamente, puede causar conflictos de sesión</li>
                <li><strong>Navegador obsoleto:</strong> Actualice su navegador a la última versión</li>
            </ol>

            <h3>Problemas en el Módulo Fiscalizar</h3>

            <h4>No veo mi mesa asignada</h4>

            <p><strong>Síntomas:</strong> Al acceder a Fiscalizar, no aparece ninguna mesa o dice "No tiene mesa asignada".</p>

            <p><strong>Soluciones:</strong></p>

            <ol>
                <li><strong>Verifique su nivel:</strong> Solo usuarios nivel 1-4 pueden fiscalizar. Nivel 5 no tiene acceso</li>
                <li><strong>Asignación pendiente:</strong> Si es nivel 4, un administrador debe asignarle una mesa desde Control → Asignar Fiscal</li>
                <li><strong>Contacte coordinador:</strong> Informe que no ve su mesa, proporcione su email y número de mesa esperado</li>
            </ol>

            <h4>No puedo marcar a un votante</h4>

            <p><strong>Síntomas:</strong> Al hacer clic en "Marcar como Votó" no sucede nada o da error.</p>

            <p><strong>Soluciones paso a paso:</strong></p>

            <ol>
                <li><strong>Refresque la página:</strong> Presione F5 para recargar</li>
                <li><strong>Verifique conexión:</strong> Revise que tiene Internet activo</li>
                <li><strong>Intente con otro votante:</strong> Si funciona con otros, el problema es específico de ese registro</li>
                <li><strong>Limpie caché:</strong> Presione Ctrl+Shift+Delete → Limpiar caché → Reintentar</li>
                <li><strong>Reporte el problema:</strong> Si persiste, contacte soporte técnico con:
                    <ul>
                        <li>Número de mesa</li>
                        <li>Documento del votante problemático</li>
                        <li>Mensaje de error (si aparece)</li>
                        <li>Hora en que ocurrió</li>
                    </ul>
                </li>
            </ol>

            <h4>Votante no aparece en búsqueda</h4>

            <p><strong>Síntomas:</strong> Busco por documento y no encuentra el votante.</p>

            <p><strong>Pasos para resolver:</strong></p>

            <ol>
                <li><strong>Verifique el documento:</strong> Confirme que escribió el número correcto (sin puntos ni espacios)</li>
                <li><strong>Verifique la mesa:</strong> El votante puede estar en otra mesa. Si es coordinador/admin, use módulo Búsqueda para encontrarlo</li>
                <li><strong>Busque por orden:</strong> Si tiene el padrón físico, ubique al votante y busque por su número de orden en mesa</li>
                <li><strong>Refresque:</strong> Presione F5 y reintente</li>
                <li><strong>Caso especial:</strong> Si el votante insiste que está en esa mesa, verifique con el padrón físico y reporte la discrepancia</li>
            </ol>

            <h3>Problemas en el Módulo Búsqueda</h3>

            <h4>La búsqueda no devuelve resultados</h4>

            <p><strong>Causas y soluciones:</strong></p>

            <ol>
                <li><strong>Filtros muy restrictivos:</strong> Si usa búsqueda avanzada, intente quitar algunos filtros</li>
                <li><strong>Error de tipeo:</strong> Verifique que escribió correctamente (sobre todo nombres con tilde o caracteres especiales)</li>
                <li><strong>Votante no existe:</strong> Verifique con el padrón oficial que el votante esté empadronado en ese distrito</li>
                <li><strong>Problema de datos:</strong> Si está seguro que el votante debe estar, reporte a administrador</li>
            </ol>

            <h4>Búsqueda muy lenta</h4>

            <p><strong>Soluciones:</strong></p>

            <ol>
                <li><strong>Sea más específico:</strong> Use filtros para reducir resultados (ej: agregar localidad)</li>
                <li><strong>Verifique conexión:</strong> Conexión lenta afecta tiempo de búsqueda</li>
                <li><strong>Cierre otras aplicaciones:</strong> Libere recursos en su dispositivo</li>
                <li><strong>Evite horarios pico:</strong> Durante jornada electoral, el sistema tiene más carga</li>
            </ol>

            <h3>Problemas con Estadísticas</h3>

            <h4>Las estadísticas no se actualizan</h4>

            <p><strong>Soluciones:</strong></p>

            <ol>
                <li><strong>Espere 1-2 minutos:</strong> Las estadísticas se actualizan cada 1-2 minutos, no son instantáneas</li>
                <li><strong>Refresque manualmente:</strong> Presione F5 para forzar actualización</li>
                <li><strong>Verifique que hay actividad:</strong> Si nadie está marcando votantes, las estadísticas no cambiarán</li>
                <li><strong>Revise su conexión:</strong> Sin Internet, no recibirá actualizaciones</li>
            </ol>

            <h4>Los gráficos no se ven</h4>

            <p><strong>Soluciones:</strong></p>

            <ol>
                <li><strong>Actualice navegador:</strong> Navegadores muy antiguos no soportan gráficos modernos</li>
                <li><strong>Habilite JavaScript:</strong> Verifique que JavaScript está habilitado en su navegador</li>
                <li><strong>Pruebe otro navegador:</strong> Chrome o Firefox tienen mejor soporte</li>
                <li><strong>Tamaño de pantalla:</strong> En pantallas muy pequeñas, algunos gráficos pueden no mostrarse bien</li>
            </ol>

            <h3>Problemas con Importación de Padrones</h3>

            <h4>El archivo no se carga</h4>

            <p><strong>Verificaciones:</strong></p>

            <ol>
                <li><strong>Formato correcto:</strong> Debe ser .xlsx (NO .xls, .csv u otros)</li>
                <li><strong>Tamaño del archivo:</strong> Archivos muy grandes (&gt;10MB) pueden tardar. Espere o divida en partes</li>
                <li><strong>Archivo no corrupto:</strong> Intente abrir el Excel en su computadora para verificar que funciona</li>
                <li><strong>Columnas correctas:</strong> Use la plantilla oficial, no modifique nombres de columnas</li>
            </ol>

            <h4>Muchos registros con error</h4>

            <p><strong>Errores comunes:</strong></p>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Error</th>
                            <th>Causa</th>
                            <th>Solución</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>"Documento inválido"</td>
                            <td>Contiene letras o caracteres especiales</td>
                            <td>Documento debe ser solo números</td>
                        </tr>
                        <tr>
                            <td>"Campo requerido vacío"</td>
                            <td>Falta apellido, nombre u otro campo obligatorio</td>
                            <td>Complete todos los campos obligatorios</td>
                        </tr>
                        <tr>
                            <td>"Documento duplicado"</td>
                            <td>Mismo documento aparece 2+ veces</td>
                            <td>Elimine duplicados en Excel antes de importar</td>
                        </tr>
                        <tr>
                            <td>"Formato de columna incorrecto"</td>
                            <td>Nombres de columnas no coinciden exactamente</td>
                            <td>Use plantilla oficial sin modificar nombres</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Problemas de Rendimiento</h3>

            <h4>El sistema está muy lento en general</h4>

            <p><strong>Optimizaciones locales:</strong></p>

            <ol>
                <li><strong>Cierre pestañas innecesarias:</strong> Mantenga solo PickPad abierto</li>
                <li><strong>Cierre otras aplicaciones:</strong> Libere RAM en su dispositivo</li>
                <li><strong>Verifique su Internet:</strong> Haga un test de velocidad (ej: fast.com)</li>
                <li><strong>Use cable en vez de WiFi:</strong> Si es posible, conexión por cable es más estable</li>
                <li><strong>Reinicie su dispositivo:</strong> A veces simplemente reiniciar ayuda</li>
            </ol>

            <p><strong>Si el problema es generalizado:</strong></p>

            <ol>
                <li>Contacte inmediatamente a soporte técnico</li>
                <li>Mientras tanto, use padrón físico como respaldo</li>
                <li>No acumule registros pendientes, cárguelos apenas el sistema responda</li>
            </ol>

            <h3>Problemas con Dispositivos Móviles</h3>

            <h4>La interfaz se ve mal en el celular</h4>

            <p><strong>Soluciones:</strong></p>

            <ol>
                <li><strong>Modo horizontal:</strong> Gire el celular horizontalmente para más espacio</li>
                <li><strong>Zoom:</strong> Algunos elementos pueden verse mejor con un pequeño zoom</li>
                <li><strong>Navegador móvil:</strong> Use Chrome móvil o Safari, evite navegadores genéricos</li>
                <li><strong>Tablet recomendada:</strong> Para fiscales, tablet es más cómoda que smartphone</li>
            </ol>

            <h4>La batería se agota rápido</h4>

            <p><strong>Consejos de ahorro:</strong></p>

            <ol>
                <li><strong>Reduzca brillo:</strong> Baje brillo de pantalla a nivel cómodo mínimo</li>
                <li><strong>Cierre apps de fondo:</strong> Solo PickPad y WhatsApp/comunicación</li>
                <li><strong>Use powerbank:</strong> Esencial para jornada electoral de 10+ horas</li>
                <li><strong>Conexión estable:</strong> WiFi consume menos que estar buscando señal constantemente</li>
            </ol>

            <h3>¿Cuándo contactar Soporte Técnico?</h3>

            <p><strong>Contacte soporte inmediatamente si:</strong></p>

            <ul>
                <li>El sistema no permite acceder a nadie (caída general)</li>
                <li>Múltiples usuarios reportan el mismo problema</li>
                <li>No puede marcar votantes y es día de elección</li>
                <li>Hubo un error al importar/exportar datos críticos</li>
                <li>Sospecha de problemas de seguridad</li>
            </ul>

            <p><strong>Información útil para reportar problemas:</strong></p>

            <ol>
                <li>Su nombre y rol (nivel de usuario)</li>
                <li>Descripción clara del problema</li>
                <li>Cuándo comenzó a ocurrir</li>
                <li>Si afecta solo a usted o a más usuarios</li>
                <li>Qué estaba haciendo cuando ocurrió</li>
                <li>Mensaje de error (captura de pantalla si es posible)</li>
                <li>Navegador y dispositivo que usa</li>
            </ol>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Consejo General</strong>
                    <p>Ante cualquier problema, mantenga la calma. La mayoría de los problemas tienen solución rápida. Si no puede resolver en 5 minutos, contacte a su coordinador o soporte técnico. Durante jornada electoral, SIEMPRE tenga padrón físico como respaldo.</p>
                </div>
            </div>
        </div>
    `,

    'soporte': `
        <div class="doc-section">
            <h2>Contacto y Soporte</h2>

            <p>Información de contacto y canales de soporte para usuarios de PickPad.</p>

            <h3>Canales de Soporte</h3>

            <h4>Durante Jornada Electoral (Día de Elección)</h4>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">Soporte Técnico Prioritario</h4>
                    <p><strong>Horario:</strong> 7:00 AM - 21:00 PM</p>
                    <p><strong>Línea directa:</strong> Proporcionada a coordinadores antes del evento</p>
                    <p><strong>WhatsApp soporte:</strong> Solo para problemas técnicos críticos</p>
                    <p><strong>Tiempo de respuesta esperado:</strong> Máximo 15 minutos</p>
                </div>
            </div>

            <h4>Fuera de Jornada Electoral</h4>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <h4 style="margin-top: 0;">Soporte Estándar</h4>
                    <p><strong>Email:</strong> Contacte a su coordinador quien escalará a soporte técnico</p>
                    <p><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 - 18:00</p>
                    <p><strong>Tiempo de respuesta esperado:</strong> 24-48 horas</p>
                </div>
            </div>

            <h3>Estructura de Soporte por Niveles</h3>

            <div class="workflow-diagram">
                <div class="workflow-step">
                    <div class="workflow-icon">1º</div>
                    <div class="workflow-content">
                        <h4>Primer Nivel: Su Coordinador</h4>
                        <p><strong>Para:</strong> Consultas generales, dudas de uso, problemas menores</p>
                        <p><strong>Resuelve:</strong> Preguntas sobre funcionalidades, guía de uso, problemas de permisos, asignaciones</p>
                        <p><strong>Contacto:</strong> WhatsApp/Telegram grupal de su zona</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">2º</div>
                    <div class="workflow-content">
                        <h4>Segundo Nivel: Administrador del Sistema</h4>
                        <p><strong>Para:</strong> Problemas técnicos, gestión de cuentas, configuraciones</p>
                        <p><strong>Resuelve:</strong> Restablecimiento de contraseñas, problemas de importación, configuración de módulos</p>
                        <p><strong>Contacto:</strong> A través de coordinador o directo si es urgente</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">3º</div>
                    <div class="workflow-content">
                        <h4>Tercer Nivel: Soporte Técnico Especializado</h4>
                        <p><strong>Para:</strong> Fallas del sistema, bugs, problemas críticos</p>
                        <p><strong>Resuelve:</strong> Caídas del sistema, errores de código, problemas de base de datos</p>
                        <p><strong>Contacto:</strong> Línea directa (solo durante jornada) o escalado por administrador</p>
                    </div>
                </div>
            </div>

            <h3>Tipos de Solicitudes de Soporte</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Tipo de Problema</th>
                            <th>A Quién Contactar</th>
                            <th>Urgencia</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Olvidé mi contraseña</td>
                            <td>Administrador</td>
                            <td>Media (15-30 min)</td>
                        </tr>
                        <tr>
                            <td>No veo mi mesa asignada</td>
                            <td>Coordinador</td>
                            <td>Alta (inmediato)</td>
                        </tr>
                        <tr>
                            <td>¿Cómo uso un módulo?</td>
                            <td>Coordinador o esta documentación</td>
                            <td>Baja (cuando pueda)</td>
                        </tr>
                        <tr>
                            <td>No puedo marcar votantes (día elección)</td>
                            <td>Soporte Técnico vía coordinador</td>
                            <td>Crítica (inmediato)</td>
                        </tr>
                        <tr>
                            <td>Error al importar padrón</td>
                            <td>Administrador</td>
                            <td>Alta (1 hora)</td>
                        </tr>
                        <tr>
                            <td>Sistema muy lento (múltiples usuarios)</td>
                            <td>Soporte Técnico</td>
                            <td>Crítica (inmediato)</td>
                        </tr>
                        <tr>
                            <td>Sugerencia de mejora</td>
                            <td>Coordinador (post-electoral)</td>
                            <td>Baja (no urgente)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Cómo Hacer un Reporte Efectivo</h3>

            <h4>Información Esencial a Incluir</h4>

            <ol>
                <li><strong>Su identificación:</strong>
                    <ul>
                        <li>Nombre completo</li>
                        <li>Email de usuario</li>
                        <li>Rol/Nivel (Fiscal, Coordinador, Admin)</li>
                        <li>Mesa asignada (si aplica)</li>
                    </ul>
                </li>
                <li><strong>Descripción del problema:</strong>
                    <ul>
                        <li>¿Qué estaba tratando de hacer?</li>
                        <li>¿Qué sucedió exactamente?</li>
                        <li>¿Qué esperaba que sucediera?</li>
                    </ul>
                </li>
                <li><strong>Contexto:</strong>
                    <ul>
                        <li>¿Cuándo ocurrió? (fecha y hora)</li>
                        <li>¿Es la primera vez o es recurrente?</li>
                        <li>¿Afecta solo a usted o a más usuarios?</li>
                    </ul>
                </li>
                <li><strong>Información técnica:</strong>
                    <ul>
                        <li>Navegador y versión (Chrome 120, Firefox 115, etc.)</li>
                        <li>Dispositivo (PC, tablet, smartphone)</li>
                        <li>Sistema operativo (Windows, Mac, Android, iOS)</li>
                        <li>Captura de pantalla del error (si es posible)</li>
                    </ul>
                </li>
            </ol>

            <h4>Ejemplo de Reporte Bien Hecho</h4>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <p style="margin: 0; font-family: monospace; white-space: pre-line;">
<strong>De:</strong> Juan Pérez (juan.perez@ejemplo.com)
<strong>Rol:</strong> Fiscal - Mesa 101
<strong>Fecha:</strong> 27/10/2024, 10:30 AM

<strong>Problema:</strong>
No puedo marcar votantes en mi mesa. Cuando hago clic en "Marcar como Votó" aparece un error.

<strong>Mensaje de error:</strong>
"Error al actualizar registro. Intente nuevamente."

<strong>Contexto:</strong>
- Comenzó a ocurrir hace 10 minutos (10:20 AM)
- Antes de eso funcionaba normal, marqué 15 votantes sin problema
- Intenté con 3 votantes diferentes, mismo error
- Refreshé la página (F5), mismo problema
- Mi conexión WiFi está funcionando

<strong>Dispositivo:</strong>
Tablet Samsung, Chrome actualizado, Android 13

<strong>Urgencia:</strong>
Alta - Es día de elección y hay votantes esperando

[Captura de pantalla adjunta]
                    </p>
                </div>
            </div>

            <h4>Ejemplo de Reporte Mal Hecho</h4>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <p style="margin: 0; font-family: monospace;">
"Hola, no me funciona nada, ayuda urgente"
                    </p>
                    <p style="margin-top: 0.5rem;"><strong>Problema:</strong> No proporciona información útil para diagnosticar el problema.</p>
                </div>
            </div>

            <h3>Tiempos de Respuesta</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Prioridad</th>
                            <th>Descripción</th>
                            <th>Tiempo de Respuesta</th>
                            <th>Tiempo de Resolución</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Crítica</strong></td>
                            <td>Sistema caído, no se puede fiscalizar (día elección)</td>
                            <td>5-10 minutos</td>
                            <td>30 minutos - 1 hora</td>
                        </tr>
                        <tr>
                            <td><strong>Alta</strong></td>
                            <td>Problema que impide trabajar pero hay workaround</td>
                            <td>15-30 minutos</td>
                            <td>1-3 horas</td>
                        </tr>
                        <tr>
                            <td><strong>Media</strong></td>
                            <td>Problema que dificulta pero no impide trabajo</td>
                            <td>1-2 horas</td>
                            <td>24 horas</td>
                        </tr>
                        <tr>
                            <td><strong>Baja</strong></td>
                            <td>Consultas, mejoras, problemas no urgentes</td>
                            <td>24-48 horas</td>
                            <td>1-7 días</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Recursos de Autoayuda</h3>

            <h4>Antes de Contactar Soporte</h4>

            <p>Para problemas no críticos, intente primero:</p>

            <ol>
                <li><strong>Consulte esta documentación:</strong>
                    <ul>
                        <li>Sección de <a href="#faq">Preguntas Frecuentes</a></li>
                        <li>Guía de <a href="#troubleshooting">Solución de Problemas</a></li>
                        <li>Documentación del módulo específico</li>
                    </ul>
                </li>
                <li><strong>Soluciones rápidas comunes:</strong>
                    <ul>
                        <li>Refrescar la página (F5)</li>
                        <li>Cerrar sesión y volver a entrar</li>
                        <li>Limpiar caché del navegador</li>
                        <li>Probar en otro navegador</li>
                    </ul>
                </li>
                <li><strong>Consulte con compañeros:</strong>
                    <ul>
                        <li>Pregunte en el grupo de WhatsApp</li>
                        <li>Tal vez otro usuario tuvo el mismo problema</li>
                    </ul>
                </li>
            </ol>

            <h3>Feedback y Mejoras</h3>

            <p>Sus sugerencias son valiosas para mejorar PickPad:</p>

            <h4>Cómo Enviar Sugerencias</h4>

            <ol>
                <li><strong>Durante reuniones post-electorales:</strong> Participe de las reuniones de lecciones aprendidas</li>
                <li><strong>A través de su coordinador:</strong> Comunique ideas de mejora</li>
                <li><strong>En encuestas de satisfacción:</strong> Complete las encuestas cuando se envíen</li>
            </ol>

            <h4>Tipos de Feedback Útil</h4>

            <ul>
                <li>Funcionalidades que facilitarían su trabajo</li>
                <li>Problemas recurrentes que deberían prevenirse</li>
                <li>Aspectos confusos de la interfaz</li>
                <li>Ideas para mejorar reportes y estadísticas</li>
                <li>Necesidades de capacitación identificadas</li>
            </ul>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Compromiso de Soporte</strong>
                    <p>El equipo de soporte está comprometido a brindarle la mejor asistencia posible. Su éxito en el uso de PickPad es nuestra prioridad. No dude en contactarnos cuando lo necesite.</p>
                </div>
            </div>
        </div>
    `
};

export default helpDocs;
