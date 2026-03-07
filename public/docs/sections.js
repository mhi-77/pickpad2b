const sections = {
    'acceso': `
        <div class="doc-section">
            <h2>Acceso al Sistema</h2>

            <h3>URL de Acceso</h3>
            <p>PickPad es una aplicación web accesible a través de navegadores modernos. La URL específica será proporcionada por su coordinador o administrador del sistema.</p>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Navegadores Compatibles</strong>
                    <p>Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. Para mejor experiencia, use siempre la última versión disponible.</p>
                </div>
            </div>

            <h3>Inicio de Sesión</h3>

            <div class="screenshot">
                <div class="screenshot-header">
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                    <div class="screenshot-dot"></div>
                </div>
                <div class="screenshot-body">
                    <div class="mockup-form">
                        <h3 style="color: #2563eb; margin-bottom: 1rem;">Ingresar a PickPad</h3>
                        <div class="mockup-input">Email: usuario@ejemplo.com</div>
                        <div class="mockup-input">Contraseña: ••••••••</div>
                        <button class="mockup-button">Iniciar Sesión</button>
                    </div>
                </div>
            </div>

            <h4>Pasos para Iniciar Sesión:</h4>
            <ol>
                <li>Ingrese su correo electrónico registrado en el campo "Email"</li>
                <li>Ingrese su contraseña en el campo correspondiente</li>
                <li>Haga clic en el botón "Iniciar Sesión"</li>
                <li>Espere a que el sistema valide sus credenciales</li>
                <li>Será redirigido automáticamente al panel principal</li>
            </ol>

            <h3>Primera Vez en el Sistema</h3>
            <p>Si es su primer acceso, deberá:</p>
            <ul>
                <li>Recibir las credenciales de acceso de un administrador</li>
                <li>Cambiar su contraseña inicial por una segura y personal</li>
                <li>Completar su información de perfil</li>
                <li>Familiarizarse con la interfaz y los módulos disponibles para su rol</li>
            </ul>

            <h3>Seguridad de la Sesión</h3>
            <p>PickPad implementa las siguientes medidas de seguridad:</p>

            <ul>
                <li><strong>Tiempo de Inactividad:</strong> Las sesiones expiran automáticamente después de 30 minutos sin actividad</li>
                <li><strong>Advertencia Previa:</strong> El sistema muestra una advertencia 5 minutos antes de cerrar la sesión</li>
                <li><strong>Cierre Automático:</strong> Al detectar inactividad prolongada, debe volver a iniciar sesión</li>
                <li><strong>Protección de Datos:</strong> No comparta sus credenciales con terceros</li>
            </ul>

            <div class="info-box warning">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div>
                    <strong>Seguridad de Credenciales</strong>
                    <p>Use contraseñas fuertes con al menos 8 caracteres, combinando mayúsculas, minúsculas, números y símbolos. Nunca comparta su contraseña.</p>
                </div>
            </div>

            <h3>Recuperación de Contraseña</h3>
            <p>Si olvidó su contraseña:</p>
            <ol>
                <li>Contacte a un administrador del sistema</li>
                <li>Proporcione su email registrado para verificación</li>
                <li>El administrador podrá restablecer su contraseña</li>
                <li>Recibirá una contraseña temporal que debe cambiar en el primer acceso</li>
            </ol>

            <h3>Problemas de Acceso Comunes</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Problema</th>
                            <th>Causa Probable</th>
                            <th>Solución</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Credenciales inválidas</td>
                            <td>Email o contraseña incorrectos</td>
                            <td>Verifique mayúsculas/minúsculas y espacios. Intente recuperar contraseña.</td>
                        </tr>
                        <tr>
                            <td>Página no carga</td>
                            <td>Problemas de conexión</td>
                            <td>Verifique su conexión a Internet. Intente recargar la página.</td>
                        </tr>
                        <tr>
                            <td>Sesión expirada</td>
                            <td>Tiempo de inactividad excedido</td>
                            <td>Vuelva a iniciar sesión. Sus datos guardados se mantendrán.</td>
                        </tr>
                        <tr>
                            <td>Cuenta bloqueada</td>
                            <td>Usuario deshabilitado</td>
                            <td>Contacte a un administrador para reactivar su cuenta.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `,

    'instalacion-pwa': `
        <div class="doc-section">
            <h2>Instalación de la PWA (Aplicación Web Progresiva)</h2>

            <p>PickPad puede instalarse en su dispositivo móvil o computadora como una aplicación independiente, permitiendo un acceso más rápido y una experiencia similar a las aplicaciones nativas.</p>

            <h3>Beneficios de la Instalación</h3>
            <ul>
                <li><strong>Acceso Rápido:</strong> Icono en la pantalla de inicio para abrir directamente</li>
                <li><strong>Pantalla Completa:</strong> La aplicación ocupa toda la pantalla sin la barra del navegador</li>
                <li><strong>Funcionamiento Offline:</strong> Acceso limitado sin conexión a recursos en caché</li>
                <li><strong>Notificaciones:</strong> Reciba alertas importantes del sistema</li>
                <li><strong>Menor Consumo:</strong> Optimización de recursos y batería</li>
            </ul>

            <h3>Instalación en Android (Chrome)</h3>

            <div class="workflow-diagram">
                <div class="workflow-step">
                    <div class="workflow-icon">1</div>
                    <div class="workflow-content">
                        <h4>Acceda a PickPad desde Chrome</h4>
                        <p>Abra la aplicación en el navegador Chrome de su dispositivo Android</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">2</div>
                    <div class="workflow-content">
                        <h4>Busque el Banner de Instalación</h4>
                        <p>Aparecerá un banner en la parte inferior sugiriendo "Agregar PickPad a la pantalla de inicio"</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">3</div>
                    <div class="workflow-content">
                        <h4>Toque "Instalar" o "Agregar"</h4>
                        <p>Confirme la instalación en el cuadro de diálogo que aparece</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">4</div>
                    <div class="workflow-content">
                        <h4>Acceda desde su Pantalla de Inicio</h4>
                        <p>El icono de PickPad aparecerá en su pantalla de inicio como cualquier otra aplicación</p>
                    </div>
                </div>
            </div>

            <div class="info-box info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                    <strong>Instalación Manual en Android</strong>
                    <p>Si no aparece el banner, toque el menú (⋮) en Chrome → "Agregar a pantalla de inicio" → "Instalar"</p>
                </div>
            </div>

            <h3>Instalación en iOS (Safari)</h3>

            <div class="workflow-diagram">
                <div class="workflow-step">
                    <div class="workflow-icon">1</div>
                    <div class="workflow-content">
                        <h4>Abra PickPad en Safari</h4>
                        <p>Asegúrese de usar Safari, ya que otros navegadores en iOS no soportan PWA completamente</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">2</div>
                    <div class="workflow-content">
                        <h4>Toque el Botón "Compartir"</h4>
                        <p>Busque el ícono de compartir (cuadrado con flecha hacia arriba) en la parte inferior</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">3</div>
                    <div class="workflow-content">
                        <h4>Seleccione "Agregar a Pantalla de Inicio"</h4>
                        <p>Desplácese en el menú y toque esta opción</p>
                    </div>
                </div>

                <div class="workflow-step">
                    <div class="workflow-icon">4</div>
                    <div class="workflow-content">
                        <h4>Confirme el Nombre y Agregue</h4>
                        <p>Puede editar el nombre si lo desea, luego toque "Agregar"</p>
                    </div>
                </div>
            </div>

            <h3>Instalación en Computadora (Chrome/Edge)</h3>

            <ol>
                <li>Abra PickPad en Chrome o Edge</li>
                <li>Busque el ícono de instalación (+) en la barra de direcciones</li>
                <li>Haga clic en "Instalar PickPad"</li>
                <li>Confirme en el cuadro de diálogo</li>
                <li>La aplicación se abrirá en una ventana independiente</li>
            </ol>

            <div class="info-box success">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                <div>
                    <strong>Verificación de Instalación Exitosa</strong>
                    <p>Si ve el ícono de PickPad en su pantalla de inicio y puede abrirlo sin que aparezca la barra del navegador, la instalación fue exitosa.</p>
                </div>
            </div>

            <h3>Desinstalación de la PWA</h3>

            <h4>En Android:</h4>
            <ul>
                <li>Mantenga presionado el ícono de PickPad</li>
                <li>Seleccione "Desinstalar" o "Eliminar"</li>
                <li>Confirme la acción</li>
            </ul>

            <h4>En iOS:</h4>
            <ul>
                <li>Mantenga presionado el ícono de PickPad</li>
                <li>Toque "Eliminar App"</li>
                <li>Confirme "Eliminar"</li>
            </ul>

            <h4>En Computadora:</h4>
            <ul>
                <li>Abra la aplicación instalada</li>
                <li>Vaya al menú (⋮) → "Desinstalar PickPad"</li>
                <li>Confirme la desinstalación</li>
            </ul>

            <h3>Actualización de la PWA</h3>
            <p>La aplicación se actualiza automáticamente cuando hay nuevas versiones disponibles. Puede forzar una actualización:</p>
            <ul>
                <li>Cierre completamente la aplicación</li>
                <li>Vuelva a abrirla</li>
                <li>El sistema descargará actualizaciones si están disponibles</li>
                <li>En algunos casos puede necesitar reinstalar la PWA</li>
            </ul>
        </div>
    `,

    'glosario': `
        <div class="doc-section">
            <h2>Glosario de Términos</h2>

            <p>Este glosario define los términos técnicos y conceptos específicos utilizados en PickPad.</p>

            <h3>Términos Generales</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 25%;">Término</th>
                            <th>Definición</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Comicio</strong></td>
                            <td>Evento electoral específico (elección, consulta popular, etc.) configurado en el sistema con nombre, fecha y horarios de votación.</td>
                        </tr>
                        <tr>
                            <td><strong>Padrón Electoral</strong></td>
                            <td>Lista completa de votantes habilitados para un comicio, con sus datos personales y asignación de mesa.</td>
                        </tr>
                        <tr>
                            <td><strong>Mesa Electoral</strong></td>
                            <td>Unidad básica de votación identificada por un número, pertenece a un circuito y establecimiento específico.</td>
                        </tr>
                        <tr>
                            <td><strong>Circuito</strong></td>
                            <td>División territorial que agrupa varios establecimientos de votación (también llamado "distrito" o "sección").</td>
                        </tr>
                        <tr>
                            <td><strong>Establecimiento</strong></td>
                            <td>Lugar físico donde se instalan mesas de votación (escuelas, centros comunitarios, etc.).</td>
                        </tr>
                        <tr>
                            <td><strong>Fiscal</strong></td>
                            <td>Usuario del sistema asignado a supervisar una o más mesas electorales durante la jornada.</td>
                        </tr>
                        <tr>
                            <td><strong>PWA</strong></td>
                            <td>Progressive Web App (Aplicación Web Progresiva): tecnología que permite instalar el sitio web como aplicación móvil.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Términos Específicos de PickPad</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 25%;">Término</th>
                            <th>Definición</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Pick</strong></td>
                            <td>Marca o señalización sobre un votante específico para identificarlo como "persona de interés" que debe ser monitoreada.</td>
                        </tr>
                        <tr>
                            <td><strong>EmoPick</strong></td>
                            <td>Clasificación emocional asociada a un pick (Muy Feliz, Feliz, Neutral, Triste, Muy Triste) que indica la predisposición del votante.</td>
                        </tr>
                        <tr>
                            <td><strong>Usuario Tipo</strong></td>
                            <td>Nivel de acceso asignado a cada usuario (1-5), donde 1 es el nivel más alto y 5 el más restringido.</td>
                        </tr>
                        <tr>
                            <td><strong>Fiscalizar</strong></td>
                            <td>Acción de marcar votantes que ya emitieron su voto en el padrón de una mesa específica durante la jornada electoral.</td>
                        </tr>
                        <tr>
                            <td><strong>Mesa Testigo</strong></td>
                            <td>Mesa seleccionada estratégicamente para hacer conteos de votos más detallados que permiten proyecciones tempranas.</td>
                        </tr>
                        <tr>
                            <td><strong>Muestreo</strong></td>
                            <td>Proceso de registrar datos de votación de mesas testigo durante el recuento de votos.</td>
                        </tr>
                        <tr>
                            <td><strong>Verificación</strong></td>
                            <td>Confirmación de que un pick fue revisado y validado por un usuario autorizado, registrando fecha y usuario verificador.</td>
                        </tr>
                        <tr>
                            <td><strong>Orden en Mesa</strong></td>
                            <td>Posición secuencial de un votante en el padrón de su mesa (1, 2, 3, etc.).</td>
                        </tr>
                        <tr>
                            <td><strong>Asistencia Histórica</strong></td>
                            <td>Porcentaje de participación de esa localidad o mesa en elecciones anteriores, usado para proyecciones.</td>
                        </tr>
                        <tr>
                            <td><strong>Tendencia de Participación</strong></td>
                            <td>Proyección estadística de participación final basada en votos actuales y datos históricos.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Estados y Clasificaciones</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 25%;">Estado/Clase</th>
                            <th>Descripción</th>
                            <th>Visualización</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Votó</strong></td>
                            <td>Votante que ya emitió su voto (marcado durante fiscalización)</td>
                            <td><span class="badge badge-green">Votó</span></td>
                        </tr>
                        <tr>
                            <td><strong>No Votó</strong></td>
                            <td>Votante que aún no ha emitido su voto</td>
                            <td><span class="badge badge-gray">Pendiente</span></td>
                        </tr>
                        <tr>
                            <td><strong>Con Pick</strong></td>
                            <td>Votante marcado como persona de interés</td>
                            <td><span class="badge badge-blue">★ Pick</span></td>
                        </tr>
                        <tr>
                            <td><strong>Pick Verificado</strong></td>
                            <td>Pick que fue confirmado por usuario autorizado</td>
                            <td><span class="badge badge-green">✓ Verificado</span></td>
                        </tr>
                        <tr>
                            <td><strong>Mesa Asignada</strong></td>
                            <td>Mesa que el fiscal puede fiscalizar</td>
                            <td><span class="badge badge-blue">Asignada</span></td>
                        </tr>
                        <tr>
                            <td><strong>Usuario Activo</strong></td>
                            <td>Usuario habilitado para acceder al sistema</td>
                            <td><span class="badge badge-green">Activo</span></td>
                        </tr>
                        <tr>
                            <td><strong>Usuario Inactivo</strong></td>
                            <td>Usuario temporalmente deshabilitado</td>
                            <td><span class="badge badge-red">Inactivo</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Acciones del Sistema</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th style="width: 25%;">Acción</th>
                            <th>Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Importar Padrón</strong></td>
                            <td>Carga masiva de datos de votantes desde archivo Excel o CSV al sistema.</td>
                        </tr>
                        <tr>
                            <td><strong>Exportar Datos</strong></td>
                            <td>Descarga de información del sistema en formato Excel con filtros personalizados.</td>
                        </tr>
                        <tr>
                            <td><strong>Asignar Mesa</strong></td>
                            <td>Vincular un fiscal específico a una mesa electoral para que pueda fiscalizarla.</td>
                        </tr>
                        <tr>
                            <td><strong>Marcar Votación</strong></td>
                            <td>Registrar que un votante ya emitió su voto durante la fiscalización de mesa.</td>
                        </tr>
                        <tr>
                            <td><strong>Crear Pick</strong></td>
                            <td>Marcar un votante como persona de interés con clasificación emocional opcional.</td>
                        </tr>
                        <tr>
                            <td><strong>Verificar Pick</strong></td>
                            <td>Confirmar la validez de un pick existente (solo usuarios niveles 1-3).</td>
                        </tr>
                        <tr>
                            <td><strong>Sincronización</strong></td>
                            <td>Actualización automática de datos entre el servidor y todos los clientes conectados.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
};

export default sections;
