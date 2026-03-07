const moduleAdminDocs = {
    'modulo-control': `
        <div class="doc-section">
            <h2>Módulo: Control de Mesas</h2>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Acceso Administrativo</strong>
                    <p>Disponible solo para niveles 1-3 (Administradores y Coordinadores).</p>
                </div>
            </div>

            <h3>Descripción General</h3>
            <p>El módulo de Control permite administrar la información de todas las mesas electorales del sistema, asignar fiscales, y monitorear el estado operativo de cada mesa durante la jornada electoral.</p>

            <h3>Funcionalidades Principales</h3>

            <h4>1. Gestión de Mesas</h4>
            <p>Administre la información completa de cada mesa electoral:</p>

            <ul>
                <li><strong>Número de Mesa:</strong> Identificador único de la mesa</li>
                <li><strong>Localidad:</strong> Ubicación geográfica</li>
                <li><strong>Establecimiento:</strong> Lugar físico donde funciona</li>
                <li><strong>Dirección:</strong> Ubicación exacta</li>
                <li><strong>Cantidad de Votantes:</strong> Total de electores habilitados</li>
                <li><strong>Clase:</strong> Clasificación electoral</li>
                <li><strong>Observaciones:</strong> Notas especiales</li>
            </ul>

            <h4>2. Asignación de Fiscales</h4>
            <p>Asigne fiscales a mesas específicas:</p>

            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div style="max-width: 600px;">
                        <h3 style="margin-bottom: 1rem;">Mesa 101 - Capital</h3>
                        <div style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                                <div><strong>Establecimiento:</strong></div>
                                <div>Escuela Nº 123</div>
                                <div><strong>Dirección:</strong></div>
                                <div>Av. Principal 456</div>
                                <div><strong>Votantes:</strong></div>
                                <div>350 electores</div>
                                <div><strong>Fiscal Asignado:</strong></div>
                                <div style="color: #10b981;">Juan Pérez</div>
                            </div>
                        </div>
                        <div>
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Reasignar Fiscal</label>
                            <select class="mockup-input" style="width: 100%; margin-bottom: 1rem;">
                                <option>Seleccionar fiscal...</option>
                                <option>María García - Disponible</option>
                                <option>Carlos López - Disponible</option>
                                <option>Ana Martínez - Asignada a Mesa 102</option>
                            </select>
                            <button class="mockup-button" style="width: 100%;">Asignar Fiscal</button>
                        </div>
                    </div>
                </div>
            </div>

            <p><strong>Proceso de Asignación:</strong></p>
            <ol>
                <li>Seleccione la mesa desde el listado</li>
                <li>Haga clic en "Asignar Fiscal"</li>
                <li>Elija el usuario de tipo 4 (Fiscal) desde el desplegable</li>
                <li>Confirme la asignación</li>
                <li>El fiscal recibirá acceso automático a esa mesa</li>
            </ol>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Importante: Un Fiscal, Una Mesa</strong>
                    <p>Cada fiscal de nivel 4 solo puede estar asignado a una mesa. Si reasigna un fiscal, perderá acceso a su mesa anterior.</p>
                </div>
            </div>

            <h4>3. Monitoreo de Estado</h4>
            <p>Durante la jornada electoral, visualice el estado de cada mesa:</p>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Indicador</th>
                            <th>Significado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span class="badge badge-green">● Activa</span></td>
                            <td>Mesa funcionando normalmente, fiscal reportando</td>
                        </tr>
                        <tr>
                            <td><span class="badge badge-yellow">● Inactiva</span></td>
                            <td>No hay registros recientes de votación</td>
                        </tr>
                        <tr>
                            <td><span class="badge badge-red">● Sin Fiscal</span></td>
                            <td>Mesa sin fiscal asignado</td>
                        </tr>
                        <tr>
                            <td><span class="badge badge-blue">● Sin Conectar</span></td>
                            <td>Fiscal asignado pero no ha ingresado al sistema</td>
                        </tr>
                        <tr>
                            <td><span class="badge badge-gray">● Cerrada</span></td>
                            <td>Votación finalizada</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>4. Dashboard de Control</h4>
            <p>Visualice métricas clave de todas las mesas:</p>

            <ul>
                <li><strong>Total de Mesas:</strong> Cantidad total en el sistema</li>
                <li><strong>Mesas con Fiscal:</strong> Mesas correctamente asignadas</li>
                <li><strong>Mesas sin Fiscal:</strong> Requieren asignación urgente</li>
                <li><strong>Mesas Activas:</strong> Funcionando normalmente</li>
                <li><strong>Mesas Inactivas:</strong> Requieren atención</li>
                <li><strong>Participación Promedio:</strong> % de votación general</li>
            </ul>

            <h3>Filtros y Búsqueda</h3>

            <p>Localice mesas rápidamente usando:</p>

            <ul>
                <li><strong>Por Número:</strong> Busque mesa específica</li>
                <li><strong>Por Localidad:</strong> Filtre por ubicación geográfica</li>
                <li><strong>Por Estado:</strong> Solo activas, inactivas, sin fiscal, etc.</li>
                <li><strong>Por Fiscal:</strong> Vea qué mesas tiene asignadas cada fiscal</li>
                <li><strong>Por Participación:</strong> Ordene por % de votación</li>
            </ul>

            <h3>Gestión Durante la Jornada</h3>

            <h4>Monitoreo Activo</h4>
            <p>Durante el día de elección:</p>

            <ol>
                <li><strong>Apertura (8:00 AM):</strong> Verifique que todas las mesas tengan fiscal asignado</li>
                <li><strong>Durante el día:</strong> Monitoree mesas inactivas y contacte fiscales</li>
                <li><strong>Horarios críticos:</strong> Verifique participación en cada mesa</li>
                <li><strong>Cierre (18:00):</strong> Confirme que todas las mesas cerraron correctamente</li>
            </ol>

            <h4>Gestión de Incidencias</h4>
            <p>Si una mesa presenta problemas:</p>

            <ol>
                <li>Identifique la mesa en el dashboard</li>
                <li>Revise el estado y última actividad</li>
                <li>Contacte al fiscal asignado</li>
                <li>Si es necesario, reasigne otro fiscal</li>
                <li>Documente la incidencia en observaciones</li>
            </ol>

            <h3>Exportación de Datos</h3>

            <p>Exporte listados de mesas para:</p>

            <ul>
                <li><strong>Planificación:</strong> Listado completo con asignaciones</li>
                <li><strong>Distribución:</strong> Información por localidad para coordinadores</li>
                <li><strong>Monitoreo:</strong> Estado actual de todas las mesas</li>
                <li><strong>Reportes:</strong> Análisis post-electoral</li>
            </ul>

            <h3>Mejores Prácticas</h3>

            <ul>
                <li><strong>Asignación anticipada:</strong> Complete asignaciones al menos 48hs antes</li>
                <li><strong>Verificación:</strong> Confirme que cada fiscal recibió su asignación</li>
                <li><strong>Respaldo:</strong> Identifique fiscales suplentes para emergencias</li>
                <li><strong>Comunicación:</strong> Mantenga canal abierto con todos los fiscales</li>
                <li><strong>Monitoreo constante:</strong> Revise el dashboard cada 30 minutos durante la jornada</li>
                <li><strong>Documentación:</strong> Registre todas las incidencias en observaciones</li>
            </ul>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Consejo: Notificaciones</strong>
                    <p>Configure alertas automáticas para mesas inactivas por más de 2 horas durante la jornada electoral.</p>
                </div>
            </div>
        </div>
    `,

    'modulo-usuarios': `
        <div class="doc-section">
            <h2>Módulo: Gestión de Usuarios</h2>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Acceso Administrativo</strong>
                    <p>Disponible solo para niveles 1-2 (Administradores y Super Administradores).</p>
                </div>
            </div>

            <h3>Descripción General</h3>
            <p>El módulo de Gestión de Usuarios permite crear, modificar y administrar cuentas de acceso al sistema PickPad. Es fundamental para el control de permisos y la seguridad de la plataforma.</p>

            <h3>Tipos de Usuario</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Nivel</th>
                            <th>Nombre</th>
                            <th>Permisos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>1</strong></td>
                            <td>Super Administrador</td>
                            <td>Acceso total, puede crear otros administradores</td>
                        </tr>
                        <tr>
                            <td><strong>2</strong></td>
                            <td>Administrador</td>
                            <td>Acceso total excepto crear administradores</td>
                        </tr>
                        <tr>
                            <td><strong>3</strong></td>
                            <td>Coordinador</td>
                            <td>Acceso a estadísticas, picks, testigo. Sin gestión de usuarios.</td>
                        </tr>
                        <tr>
                            <td><strong>4</strong></td>
                            <td>Fiscal</td>
                            <td>Solo fiscalización de mesa asignada</td>
                        </tr>
                        <tr>
                            <td><strong>5</strong></td>
                            <td>Consultor</td>
                            <td>Solo búsqueda y consulta de padrón</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Creación de Usuarios</h3>

            <h4>Paso a Paso</h4>
            <ol>
                <li>Acceda a "Usuarios" → "Crear Nuevo Usuario"</li>
                <li>Complete los datos obligatorios:
                    <ul>
                        <li><strong>Email:</strong> Dirección de correo única</li>
                        <li><strong>Nombre Completo:</strong> Nombre del usuario</li>
                        <li><strong>Contraseña:</strong> Mínimo 8 caracteres</li>
                        <li><strong>Tipo de Usuario:</strong> Nivel de permisos (1-5)</li>
                    </ul>
                </li>
                <li>Datos opcionales:
                    <ul>
                        <li><strong>Teléfono:</strong> Para contacto</li>
                        <li><strong>DNI:</strong> Identificación</li>
                        <li><strong>Localidad:</strong> Zona de trabajo</li>
                        <li><strong>Notas:</strong> Información adicional</li>
                    </ul>
                </li>
                <li>Haga clic en "Crear Usuario"</li>
                <li>El usuario recibirá sus credenciales y podrá acceder inmediatamente</li>
            </ol>

            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div style="max-width: 500px;">
                        <h3 style="margin-bottom: 1rem;">Crear Nuevo Usuario</h3>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Email *</label>
                            <input class="mockup-input" style="width: 100%;" placeholder="usuario@ejemplo.com">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Nombre Completo *</label>
                            <input class="mockup-input" style="width: 100%;" placeholder="Juan Pérez">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Contraseña *</label>
                            <input class="mockup-input" type="password" style="width: 100%;" placeholder="••••••••">
                        </div>
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; font-weight: 500; margin-bottom: 0.5rem;">Tipo de Usuario *</label>
                            <select class="mockup-input" style="width: 100%;">
                                <option>Seleccionar tipo...</option>
                                <option>1 - Super Administrador</option>
                                <option>2 - Administrador</option>
                                <option>3 - Coordinador</option>
                                <option>4 - Fiscal</option>
                                <option>5 - Consultor</option>
                            </select>
                        </div>
                        <button class="mockup-button" style="width: 100%;">Crear Usuario</button>
                    </div>
                </div>
            </div>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Seguridad: Contraseñas</strong>
                    <p>Las contraseñas deben tener mínimo 8 caracteres. Recomendamos usar combinación de mayúsculas, minúsculas, números y símbolos.</p>
                </div>
            </div>

            <h3>Modificación de Usuarios</h3>

            <h4>Editar Información</h4>
            <ol>
                <li>Localice el usuario en el listado</li>
                <li>Haga clic en el botón "Editar"</li>
                <li>Modifique los campos necesarios</li>
                <li>Guarde los cambios</li>
            </ol>

            <h4>Cambiar Tipo de Usuario</h4>
            <p>Para modificar permisos:</p>
            <ol>
                <li>Edite el usuario</li>
                <li>Cambie el "Tipo de Usuario"</li>
                <li>Confirme el cambio</li>
                <li>Los nuevos permisos aplican inmediatamente</li>
            </ol>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Importante: Cambio de Tipo</strong>
                    <p>Si cambia un Fiscal (nivel 4) a otro tipo, perderá su asignación de mesa. Deberá reasignarla desde el módulo Control.</p>
                </div>
            </div>

            <h4>Restablecer Contraseña</h4>
            <p>Si un usuario olvidó su contraseña:</p>
            <ol>
                <li>Localice el usuario</li>
                <li>Haga clic en "Restablecer Contraseña"</li>
                <li>Ingrese una nueva contraseña temporal</li>
                <li>Comunique al usuario la nueva contraseña</li>
                <li>Indique que debe cambiarla en su primer acceso</li>
            </ol>

            <h3>Desactivación y Eliminación</h3>

            <h4>Desactivar Usuario</h4>
            <p>Para suspender temporalmente el acceso sin eliminar:</p>
            <ol>
                <li>Edite el usuario</li>
                <li>Marque "Usuario Inactivo"</li>
                <li>Guarde los cambios</li>
                <li>El usuario no podrá iniciar sesión</li>
                <li>Puede reactivarlo cuando sea necesario</li>
            </ol>

            <h4>Eliminar Usuario</h4>
            <p>Para eliminación permanente:</p>
            <ol>
                <li>Localice el usuario</li>
                <li>Haga clic en "Eliminar"</li>
                <li>Confirme la acción (IRREVERSIBLE)</li>
                <li>El usuario y todos sus datos se eliminarán</li>
            </ol>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Advertencia: Eliminación</strong>
                    <p>La eliminación es permanente. Se recomienda desactivar en lugar de eliminar para mantener historial. Solo elimine usuarios creados por error.</p>
                </div>
            </div>

            <h3>Listado y Filtros</h3>

            <p>El listado de usuarios permite:</p>

            <ul>
                <li><strong>Búsqueda:</strong> Por nombre, email o DNI</li>
                <li><strong>Filtro por Tipo:</strong> Ver solo fiscales, coordinadores, etc.</li>
                <li><strong>Filtro por Estado:</strong> Activos, inactivos, todos</li>
                <li><strong>Filtro por Localidad:</strong> Usuarios de zona específica</li>
                <li><strong>Ordenamiento:</strong> Por nombre, fecha creación, tipo, etc.</li>
            </ul>

            <h3>Vista de Fiscales</h3>

            <p>Para usuarios de tipo 4 (Fiscales), existe una vista especial que muestra:</p>

            <ul>
                <li>Nombre y contacto del fiscal</li>
                <li>Mesa asignada (si tiene)</li>
                <li>Estado de conexión</li>
                <li>Última actividad</li>
                <li>Acciones rápidas (asignar mesa, contactar, editar)</li>
            </ul>

            <h3>Exportación de Listados</h3>

            <p>Exporte listados de usuarios para:</p>

            <ul>
                <li><strong>Planificación:</strong> Listado completo con datos de contacto</li>
                <li><strong>Comunicación:</strong> Emails y teléfonos para envío masivo</li>
                <li><strong>Control:</strong> Usuarios por tipo y estado</li>
                <li><strong>Auditoría:</strong> Registro de creación y modificaciones</li>
            </ul>

            <h3>Seguridad y Mejores Prácticas</h3>

            <ul>
                <li><strong>Principio de Mínimo Privilegio:</strong> Asigne solo los permisos necesarios</li>
                <li><strong>Revisión Periódica:</strong> Audite usuarios activos mensualmente</li>
                <li><strong>Contraseñas Seguras:</strong> Exija contraseñas robustas en la creación</li>
                <li><strong>Desactivación Oportuna:</strong> Desactive usuarios que ya no requieren acceso</li>
                <li><strong>Documentación:</strong> Use el campo notas para registrar información relevante</li>
                <li><strong>Comunicación Clara:</strong> Informe a los usuarios sobre sus permisos y responsabilidades</li>
            </ul>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Consejo: Organización</strong>
                    <p>Use el campo "Localidad" para agrupar usuarios por zona de trabajo. Esto facilita la coordinación y comunicación.</p>
                </div>
            </div>
        </div>
    `,

    'modulo-padrones': `
        <div class="doc-section">
            <h2>Módulo: Gestión de Padrones</h2>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Acceso Administrativo</strong>
                    <p>Disponible solo para niveles 1-2 (Administradores y Super Administradores).</p>
                </div>
            </div>

            <h3>Descripción General</h3>
            <p>El módulo de Padrones permite importar, actualizar y exportar la base de datos electoral. Es el módulo fundamental para mantener actualizada la información de votantes en el sistema.</p>

            <h3>Importación de Padrón</h3>

            <h4>Formato del Archivo</h4>
            <p>El sistema acepta archivos Excel (.xlsx) con las siguientes columnas obligatorias:</p>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Columna</th>
                            <th>Descripción</th>
                            <th>Ejemplo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>documento</strong></td>
                            <td>Número de DNI sin puntos</td>
                            <td>12345678</td>
                        </tr>
                        <tr>
                            <td><strong>apellido</strong></td>
                            <td>Apellido completo en mayúsculas</td>
                            <td>GARCÍA</td>
                        </tr>
                        <tr>
                            <td><strong>nombre</strong></td>
                            <td>Nombre completo en mayúsculas</td>
                            <td>JUAN CARLOS</td>
                        </tr>
                        <tr>
                            <td><strong>clase</strong></td>
                            <td>Clase electoral</td>
                            <td>1990</td>
                        </tr>
                        <tr>
                            <td><strong>localidad</strong></td>
                            <td>Localidad de empadronamiento</td>
                            <td>CAPITAL</td>
                        </tr>
                        <tr>
                            <td><strong>mesa</strong></td>
                            <td>Número de mesa asignada</td>
                            <td>101</td>
                        </tr>
                        <tr>
                            <td><strong>orden</strong></td>
                            <td>Orden en la mesa</td>
                            <td>15</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h4>Proceso de Importación</h4>
            <ol>
                <li>Acceda a "Padrones" → "Importar Padrón"</li>
                <li>Descargue la plantilla Excel si no la tiene</li>
                <li>Prepare su archivo siguiendo el formato exacto</li>
                <li>Haga clic en "Seleccionar Archivo" y elija su Excel</li>
                <li>El sistema validará el formato y mostrará un resumen:
                    <ul>
                        <li>Total de registros encontrados</li>
                        <li>Registros válidos</li>
                        <li>Registros con errores</li>
                        <li>Detalle de errores (si los hay)</li>
                    </ul>
                </li>
                <li>Revise el resumen cuidadosamente</li>
                <li>Seleccione el modo de importación:
                    <ul>
                        <li><strong>Agregar:</strong> Añade nuevos registros sin modificar existentes</li>
                        <li><strong>Actualizar:</strong> Actualiza registros existentes y agrega nuevos</li>
                        <li><strong>Reemplazar:</strong> ELIMINA todo y carga desde cero</li>
                    </ul>
                </li>
                <li>Confirme la importación</li>
                <li>Espere a que el proceso finalice (puede tomar varios minutos)</li>
            </ol>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>ADVERTENCIA CRÍTICA: Modo Reemplazar</strong>
                    <p>El modo "Reemplazar" ELIMINARÁ PERMANENTEMENTE todos los datos del padrón, incluyendo marcas de votación, picks y estadísticas. SOLO use este modo al inicio de un nuevo ciclo electoral. SIEMPRE haga un backup antes.</p>
                </div>
            </div>

            <h4>Validaciones Automáticas</h4>
            <p>Durante la importación, el sistema valida:</p>

            <ul>
                <li>Formato de documento (solo números)</li>
                <li>Campos obligatorios completados</li>
                <li>Números de mesa válidos</li>
                <li>Orden en mesa coherente</li>
                <li>No duplicados de documento</li>
                <li>Longitud correcta de campos</li>
            </ul>

            <h3>Exportación de Padrón</h3>

            <h4>Opciones de Exportación</h4>
            <p>Puede exportar el padrón completo o filtrado:</p>

            <ol>
                <li>Acceda a "Padrones" → "Exportar Padrón"</li>
                <li>Configure filtros (opcional):
                    <ul>
                        <li>Localidad específica</li>
                        <li>Mesa o rango de mesas</li>
                        <li>Solo votantes con picks</li>
                        <li>Solo votantes que votaron/no votaron</li>
                    </ul>
                </li>
                <li>Seleccione columnas a incluir:
                    <ul>
                        <li>Datos básicos (documento, nombre, apellido)</li>
                        <li>Datos electorales (mesa, orden, clase)</li>
                        <li>Estado de votación</li>
                        <li>Picks y emopicks</li>
                    </ul>
                </li>
                <li>Elija formato:
                    <ul>
                        <li><strong>Excel (.xlsx):</strong> Para análisis y procesamiento</li>
                        <li><strong>CSV:</strong> Para sistemas externos</li>
                        <li><strong>PDF:</strong> Para impresión de listados</li>
                    </ul>
                </li>
                <li>Haga clic en "Exportar"</li>
                <li>El archivo se descargará automáticamente</li>
            </ol>

            <h4>Casos de Uso de Exportación</h4>

            <ul>
                <li><strong>Backup:</strong> Exportar todo el padrón antes de cambios importantes</li>
                <li><strong>Análisis:</strong> Exportar con picks para análisis externo</li>
                <li><strong>Impresión:</strong> Generar PDFs de mesas específicas</li>
                <li><strong>Integración:</strong> Exportar CSV para otros sistemas</li>
                <li><strong>Reportes:</strong> Exportar con estado de votación post-electoral</li>
            </ul>

            <h3>Actualización de Datos</h3>

            <h4>Actualización Masiva</h4>
            <p>Para actualizar múltiples registros:</p>

            <ol>
                <li>Exporte el padrón actual</li>
                <li>Modifique los datos necesarios en Excel</li>
                <li>Importe usando modo "Actualizar"</li>
                <li>El sistema actualizará solo los registros modificados</li>
            </ol>

            <h4>Corrección de Errores</h4>
            <p>Si detecta errores en el padrón:</p>

            <ol>
                <li>Identifique los registros incorrectos</li>
                <li>Prepare un archivo Excel solo con las correcciones</li>
                <li>Use modo "Actualizar" para aplicar cambios</li>
                <li>Verifique que las correcciones se aplicaron correctamente</li>
            </ol>

            <h3>Estadísticas del Padrón</h3>

            <p>El módulo muestra métricas útiles:</p>

            <ul>
                <li><strong>Total de Votantes:</strong> Cantidad total en el sistema</li>
                <li><strong>Por Localidad:</strong> Distribución geográfica</li>
                <li><strong>Por Mesa:</strong> Cantidad de votantes por mesa</li>
                <li><strong>Por Clase:</strong> Distribución por año</li>
                <li><strong>Última Actualización:</strong> Fecha de última importación</li>
                <li><strong>Integridad:</strong> Porcentaje de registros completos</li>
            </ul>

            <h3>Backup y Recuperación</h3>

            <h4>Backup Regular</h4>
            <p>Recomendaciones de respaldo:</p>

            <ul>
                <li>Exporte el padrón completo semanalmente</li>
                <li>Guarde el backup con fecha en el nombre</li>
                <li>Almacene en múltiples ubicaciones</li>
                <li>Mantenga al menos 3 versiones históricas</li>
            </ul>

            <h4>Recuperación ante Errores</h4>
            <p>Si cometió un error en la importación:</p>

            <ol>
                <li>NO entre en pánico</li>
                <li>Contacte inmediatamente a un super administrador</li>
                <li>Si tiene backup reciente, use modo "Reemplazar" con el backup</li>
                <li>Documente qué sucedió para evitar repetir el error</li>
            </ol>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Mejor Práctica: Entorno de Prueba</strong>
                    <p>Si es su primera vez importando un padrón, practique primero con un archivo pequeño (100-200 registros) para familiarizarse con el proceso.</p>
                </div>
            </div>

            <h3>Solución de Problemas Comunes</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Problema</th>
                            <th>Causa</th>
                            <th>Solución</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Archivo no se carga</td>
                            <td>Formato incorrecto</td>
                            <td>Verifique que sea .xlsx y use la plantilla oficial</td>
                        </tr>
                        <tr>
                            <td>Muchos registros con error</td>
                            <td>Columnas incorrectas</td>
                            <td>Revise nombres de columnas exactos (sin espacios extra)</td>
                        </tr>
                        <tr>
                            <td>Importación muy lenta</td>
                            <td>Archivo muy grande</td>
                            <td>Divida en archivos más pequeños (10,000 registros cada uno)</td>
                        </tr>
                        <tr>
                            <td>Duplicados rechazados</td>
                            <td>Documentos repetidos</td>
                            <td>Limpie duplicados en Excel antes de importar</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Mejores Prácticas</h3>

            <ul>
                <li><strong>Backup siempre:</strong> Exporte antes de cualquier importación importante</li>
                <li><strong>Validar en Excel:</strong> Revise datos antes de importar</li>
                <li><strong>Modo correcto:</strong> Use "Agregar" para nuevos datos, "Actualizar" para cambios</li>
                <li><strong>Horario adecuado:</strong> Importe en horarios de baja actividad</li>
                <li><strong>Comunicar cambios:</strong> Informe al equipo sobre actualizaciones del padrón</li>
                <li><strong>Documentar:</strong> Registre fecha y motivo de cada importación</li>
            </ul>
        </div>
    `,

    'modulo-configuracion': `
        <div class="doc-section">
            <h2>Módulo: Configuración del Sistema</h2>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Acceso Administrativo</strong>
                    <p>Disponible solo para niveles 1-2 (Administradores y Super Administradores).</p>
                </div>
            </div>

            <h3>Descripción General</h3>
            <p>El módulo de Configuración permite ajustar parámetros globales del sistema, configurar opciones de seguridad, y personalizar el comportamiento de PickPad según las necesidades específicas de cada elección.</p>

            <h3>Configuraciones Disponibles</h3>

            <h4>1. Información Electoral</h4>
            <p>Datos básicos de la elección actual:</p>

            <ul>
                <li><strong>Nombre de la Elección:</strong> Ej: "Elecciones Generales 2024"</li>
                <li><strong>Fecha de la Elección:</strong> Fecha programada</li>
                <li><strong>Tipo de Elección:</strong> General, Primaria, Legislativa, etc.</li>
                <li><strong>Distrito Electoral:</strong> Jurisdicción</li>
                <li><strong>Hora de Apertura:</strong> Hora de inicio (default: 8:00)</li>
                <li><strong>Hora de Cierre:</strong> Hora de fin (default: 18:00)</li>
            </ul>

            <h4>2. Seguridad y Sesiones</h4>
            <p>Parámetros de seguridad del sistema:</p>

            <ul>
                <li><strong>Tiempo de Sesión:</strong> Minutos antes de auto-logout (default: 30)</li>
                <li><strong>Advertencia Previa:</strong> Minutos antes de mostrar advertencia (default: 5)</li>
                <li><strong>Intentos de Login:</strong> Máximo de intentos fallidos antes de bloqueo</li>
                <li><strong>Tiempo de Bloqueo:</strong> Minutos de bloqueo tras intentos fallidos</li>
                <li><strong>Complejidad de Contraseña:</strong> Requisitos mínimos</li>
            </ul>

            <h4>3. Funcionalidades por Módulo</h4>
            <p>Activar/desactivar funcionalidades:</p>

            <ul>
                <li><strong>Módulo Picks:</strong> Habilitar gestión de picks</li>
                <li><strong>Módulo Testigo:</strong> Habilitar mesas testigo</li>
                <li><strong>Modo Fiscalización:</strong> Activar durante jornada electoral</li>
                <li><strong>Exportación Pública:</strong> Permitir exportar datos a usuarios nivel 3+</li>
                <li><strong>Estadísticas en Tiempo Real:</strong> Actualización automática</li>
            </ul>

            <h4>4. Notificaciones y Alertas</h4>
            <p>Configurar alertas automáticas:</p>

            <ul>
                <li><strong>Alerta Mesas Inactivas:</strong> Tiempo sin actividad para alertar</li>
                <li><strong>Alerta Baja Participación:</strong> Umbral de participación crítico</li>
                <li><strong>Notificaciones Email:</strong> Habilitar envío de emails</li>
                <li><strong>Destinatarios:</strong> Emails para recibir alertas</li>
            </ul>

            <h4>5. Visualización y UX</h4>
            <p>Personalización de interfaz:</p>

            <ul>
                <li><strong>Tema:</strong> Claro, Oscuro, Automático</li>
                <li><strong>Idioma:</strong> Español (más idiomas en desarrollo)</li>
                <li><strong>Formato de Fecha:</strong> DD/MM/YYYY o MM/DD/YYYY</li>
                <li><strong>Zona Horaria:</strong> Ajuste horario local</li>
                <li><strong>Página Inicial:</strong> Módulo que aparece al iniciar sesión</li>
            </ul>

            <h4>6. Datos Históricos</h4>
            <p>Configurar referencias históricas:</p>

            <ul>
                <li><strong>Participación Histórica:</strong> % de referencia de elecciones anteriores</li>
                <li><strong>Año de Referencia:</strong> Elección usada para comparaciones</li>
                <li><strong>Usar Histórico en Proyecciones:</strong> Incluir en cálculos de tendencia</li>
            </ul>

            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div>
                        <h3 style="margin-bottom: 1rem;">Configuración del Sistema</h3>
                        <div style="background: #f9fafb; border-radius: 0.5rem; padding: 1rem;">
                            <div style="margin-bottom: 1rem;">
                                <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Información Electoral</h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                                    <div>Nombre: <strong>Elecciones 2024</strong></div>
                                    <div>Fecha: <strong>27/10/2024</strong></div>
                                    <div>Apertura: <strong>08:00</strong></div>
                                    <div>Cierre: <strong>18:00</strong></div>
                                </div>
                            </div>
                            <div style="margin-bottom: 1rem;">
                                <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Seguridad</h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.875rem;">
                                    <div>Tiempo Sesión: <strong>30 min</strong></div>
                                    <div>Advertencia: <strong>5 min</strong></div>
                                </div>
                            </div>
                            <div>
                                <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Módulos Activos</h4>
                                <div style="font-size: 0.875rem;">
                                    <div>✅ Picks | ✅ Testigo | ✅ Estadísticas RT</div>
                                </div>
                            </div>
                        </div>
                        <button class="mockup-button" style="width: 100%; margin-top: 1rem;">Guardar Configuración</button>
                    </div>
                </div>
            </div>

            <h3>Modificación de Configuraciones</h3>

            <h4>Proceso de Cambio</h4>
            <ol>
                <li>Acceda a "Configuración"</li>
                <li>Seleccione la sección que desea modificar</li>
                <li>Realice los cambios necesarios</li>
                <li>Haga clic en "Guardar Configuración"</li>
                <li>Los cambios aplican inmediatamente</li>
            </ol>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Precaución: Cambios Durante Jornada</strong>
                    <p>Evite modificar configuraciones críticas (seguridad, módulos) durante la jornada electoral. Puede causar interrupciones o comportamientos inesperados.</p>
                </div>
            </div>

            <h3>Configuraciones Recomendadas</h3>

            <h4>Antes de la Elección</h4>
            <ul>
                <li>Configure información electoral completa</li>
                <li>Active todos los módulos necesarios</li>
                <li>Configure alertas y notificaciones</li>
                <li>Ajuste tiempos de sesión (recomienda 60 min durante jornada)</li>
                <li>Configure datos históricos de referencia</li>
            </ul>

            <h4>Durante la Jornada</h4>
            <ul>
                <li>Mantener configuración estable</li>
                <li>Solo ajustar si es absolutamente necesario</li>
                <li>Monitorear alertas configuradas</li>
            </ul>

            <h4>Después de la Elección</h4>
            <ul>
                <li>Desactivar modo fiscalización</li>
                <li>Reducir tiempo de sesión a valores normales</li>
                <li>Guardar configuración como referencia</li>
            </ul>

            <h3>Respaldo de Configuración</h3>

            <p>El sistema guarda automáticamente un historial de cambios:</p>

            <ul>
                <li><strong>Registro de Cambios:</strong> Qué se modificó y cuándo</li>
                <li><strong>Usuario Responsable:</strong> Quién realizó el cambio</li>
                <li><strong>Valores Anteriores:</strong> Para recuperación si es necesario</li>
                <li><strong>Exportar Configuración:</strong> Descargar configuración actual</li>
            </ul>

            <h3>Mejores Prácticas</h3>

            <ul>
                <li><strong>Configurar con anticipación:</strong> Complete todo al menos 1 semana antes</li>
                <li><strong>Probar configuración:</strong> Verifique que todo funciona correctamente</li>
                <li><strong>Documentar cambios:</strong> Registre por qué modificó algo</li>
                <li><strong>Evitar cambios de último momento:</strong> Puede causar problemas</li>
                <li><strong>Consultar antes:</strong> Si tiene dudas, consulte con soporte técnico</li>
            </ul>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Consejo: Configuración por Defecto</strong>
                    <p>Las configuraciones por defecto del sistema están optimizadas para la mayoría de los casos. Solo modifique si tiene un motivo específico.</p>
                </div>
            </div>
        </div>
    `,

    'modulo-perfil': `
        <div class="doc-section">
            <h2>Módulo: Perfil de Usuario</h2>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Acceso Universal</strong>
                    <p>Disponible para todos los usuarios. Cada usuario solo puede ver y modificar su propio perfil.</p>
                </div>
            </div>

            <h3>Descripción General</h3>
            <p>El módulo de Perfil permite a cada usuario gestionar su información personal, cambiar su contraseña, y personalizar sus preferencias de uso del sistema.</p>

            <h3>Información del Perfil</h3>

            <h4>Datos Personales</h4>
            <p>Información que puede visualizar y editar:</p>

            <ul>
                <li><strong>Nombre Completo:</strong> Su nombre como aparece en el sistema</li>
                <li><strong>Email:</strong> Dirección de correo electrónico (no editable)</li>
                <li><strong>Teléfono:</strong> Número de contacto</li>
                <li><strong>DNI:</strong> Número de documento</li>
                <li><strong>Localidad:</strong> Zona de trabajo asignada</li>
            </ul>

            <h4>Información de Cuenta</h4>
            <p>Datos que puede visualizar pero NO editar:</p>

            <ul>
                <li><strong>Tipo de Usuario:</strong> Nivel de permisos (1-5)</li>
                <li><strong>Fecha de Creación:</strong> Cuándo se creó su cuenta</li>
                <li><strong>Última Sesión:</strong> Último acceso al sistema</li>
                <li><strong>Mesa Asignada:</strong> (Solo nivel 4) Número de mesa</li>
            </ul>

            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div style="max-width: 500px;">
                        <h3 style="margin-bottom: 1rem;">Mi Perfil</h3>
                        <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                            <div style="text-align: center; margin-bottom: 1rem;">
                                <div style="width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0 auto; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem; font-weight: bold;">JP</div>
                            </div>
                            <div style="font-size: 0.875rem;">
                                <div style="margin-bottom: 0.5rem;"><strong>Juan Pérez</strong></div>
                                <div style="color: #6b7280; margin-bottom: 0.5rem;">juan.perez@ejemplo.com</div>
                                <div style="margin-bottom: 0.5rem;">Tipo: <span class="badge badge-blue">Coordinador</span></div>
                                <div style="color: #6b7280;">Última sesión: Hoy, 14:30</div>
                            </div>
                        </div>
                        <button class="mockup-button" style="width: 100%; margin-bottom: 0.5rem;">Editar Perfil</button>
                        <button style="width: 100%; padding: 0.75rem; background: white; border: 1px solid #d1d5db; border-radius: 0.375rem; cursor: pointer;">Cambiar Contraseña</button>
                    </div>
                </div>
            </div>

            <h3>Edición del Perfil</h3>

            <h4>Modificar Información Personal</h4>
            <ol>
                <li>Haga clic en el ícono de perfil (esquina superior derecha)</li>
                <li>Seleccione "Mi Perfil"</li>
                <li>Haga clic en "Editar Perfil"</li>
                <li>Modifique los campos editables</li>
                <li>Haga clic en "Guardar Cambios"</li>
            </ol>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Campos Protegidos</strong>
                    <p>Email, tipo de usuario y mesa asignada solo pueden modificarse por un administrador. Si necesita cambiar estos datos, contacte a su coordinador.</p>
                </div>
            </div>

            <h3>Cambio de Contraseña</h3>

            <h4>Proceso de Cambio</h4>
            <ol>
                <li>Acceda a "Mi Perfil"</li>
                <li>Haga clic en "Cambiar Contraseña"</li>
                <li>Ingrese su contraseña actual</li>
                <li>Ingrese su nueva contraseña</li>
                <li>Confirme la nueva contraseña</li>
                <li>Haga clic en "Cambiar Contraseña"</li>
                <li>Su sesión se cerrará automáticamente</li>
                <li>Inicie sesión nuevamente con la nueva contraseña</li>
            </ol>

            <h4>Requisitos de Contraseña</h4>
            <p>Su nueva contraseña debe cumplir:</p>

            <ul>
                <li>Mínimo 8 caracteres</li>
                <li>Al menos una letra mayúscula</li>
                <li>Al menos una letra minúscula</li>
                <li>Al menos un número</li>
                <li>Se recomienda incluir un símbolo especial</li>
                <li>No puede ser igual a las 3 contraseñas anteriores</li>
            </ul>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Seguridad de Contraseña</strong>
                    <p>Use una contraseña única y segura. No comparta su contraseña con nadie. Si cree que su contraseña fue comprometida, cámbiela inmediatamente.</p>
                </div>
            </div>

            <h3>Preferencias de Usuario</h3>

            <h4>Personalización de Interfaz</h4>
            <p>Configure su experiencia de usuario:</p>

            <ul>
                <li><strong>Tema Visual:</strong> Claro, Oscuro o Automático</li>
                <li><strong>Página Inicial:</strong> Módulo que aparece al iniciar sesión</li>
                <li><strong>Notificaciones:</strong> Habilitar/deshabilitar notificaciones del navegador</li>
                <li><strong>Sonidos:</strong> Activar sonidos para alertas</li>
                <li><strong>Idioma:</strong> Español (más opciones próximamente)</li>
            </ul>

            <h4>Preferencias de Datos</h4>
            <p>Configure cómo se muestran los datos:</p>

            <ul>
                <li><strong>Resultados por Página:</strong> 10, 25, 50 o 100</li>
                <li><strong>Formato de Fecha:</strong> DD/MM/YYYY o MM/DD/YYYY</li>
                <li><strong>Actualización Automática:</strong> Frecuencia de refresh en estadísticas</li>
            </ul>

            <h3>Historial de Actividad</h3>

            <p>Visualice su actividad reciente en el sistema:</p>

            <ul>
                <li><strong>Últimos Accesos:</strong> Fecha, hora y dispositivo</li>
                <li><strong>Acciones Recientes:</strong> Últimas operaciones realizadas</li>
                <li><strong>Cambios de Configuración:</strong> Modificaciones en preferencias</li>
            </ul>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Privacidad y Seguridad</strong>
                    <p>Si nota actividad sospechosa en su historial (accesos desde ubicaciones desconocidas), cambie su contraseña inmediatamente y notifique a un administrador.</p>
                </div>
            </div>

            <h3>Cerrar Sesión</h3>

            <p>Para salir del sistema de forma segura:</p>

            <ol>
                <li>Haga clic en su nombre (esquina superior derecha)</li>
                <li>Seleccione "Cerrar Sesión"</li>
                <li>Su sesión se cerrará inmediatamente</li>
                <li>Será redirigido a la pantalla de login</li>
            </ol>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Buena Práctica: Cierre de Sesión</strong>
                    <p>Siempre cierre sesión al terminar, especialmente si usa computadoras compartidas o públicas. Esto protege su cuenta y los datos del sistema.</p>
                </div>
            </div>

            <h3>Recuperación de Acceso</h3>

            <h4>Olvidé mi Contraseña</h4>
            <p>Si olvidó su contraseña:</p>

            <ol>
                <li>NO intente adivinar repetidamente (bloqueará su cuenta)</li>
                <li>Contacte a su coordinador o administrador</li>
                <li>Proporcione su email registrado</li>
                <li>El administrador restablecerá su contraseña</li>
                <li>Recibirá una contraseña temporal</li>
                <li>Cámbiela inmediatamente al iniciar sesión</li>
            </ol>

            <h4>Cuenta Bloqueada</h4>
            <p>Si su cuenta fue bloqueada por intentos fallidos:</p>

            <ol>
                <li>Espere 15 minutos (el bloqueo es temporal)</li>
                <li>O contacte a un administrador para desbloqueo inmediato</li>
                <li>Verifique que está usando la contraseña correcta</li>
                <li>Si persiste, solicite restablecimiento de contraseña</li>
            </ol>

            <h3>Mejores Prácticas</h3>

            <ul>
                <li><strong>Actualice sus datos:</strong> Mantenga teléfono y datos de contacto actualizados</li>
                <li><strong>Contraseña segura:</strong> Use contraseña única y compleja</li>
                <li><strong>Cambie regularmente:</strong> Modifique su contraseña cada 3 meses</li>
                <li><strong>No comparta:</strong> Su cuenta es personal e intransferible</li>
                <li><strong>Cierre sesión:</strong> Siempre al terminar, especialmente en equipos compartidos</li>
                <li><strong>Reporte anomalías:</strong> Si nota algo extraño, notifique inmediatamente</li>
            </ul>
        </div>
    `
};

export default moduleAdminDocs;
