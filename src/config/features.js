/**
 * Feature Flags Configuration
 *
 * Propósito: Controlar la disponibilidad de funcionalidades específicas de la aplicación.
 * Permite habilitar/deshabilitar características sin modificar múltiples archivos.
 *
 * Para habilitar una funcionalidad: cambiar su valor a true
 * Para deshabilitar una funcionalidad: cambiar su valor a false
 */

export const FEATURES = {
  /**
   * Mesa Testigo
   * Control y seguimiento de muestras electorales
   *
   * Estado actual: DESHABILITADA (en desarrollo)
   * Para activar: cambiar a true
   */
  MESA_TESTIGO_ENABLED: false,
};
