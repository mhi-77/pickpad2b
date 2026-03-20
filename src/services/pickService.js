/**
 * pickService.js
 *
 * Modulo de servicio para la gestion de "picks" en el padron electoral.
 * Encapsula la logica de permisos y las operaciones de base de datos
 * relacionadas con la asignacion, limpieza y verificacion de picks
 * sobre los registros de la tabla `padron`.
 *
 * Conceptos clave:
 * - Pick: asignacion de un emopick (categoria/etiqueta) a un votante del padron.
 * - Pick check: verificacion manual de que el pick asignado fue confirmado.
 * - userType: nivel de privilegio del usuario. Valores menores a 3 corresponden
 *   a administradores con permisos completos; valores >= 3 son usuarios normales
 *   con restricciones sobre registros ya votados.
 */

import { supabase } from '../lib/supabase';

/**
 * Determina si un usuario puede editar el pick de un registro del padron.
 *
 * Los administradores (userType < 3) siempre pueden editar.
 * Los usuarios normales (userType >= 3) solo pueden editar si el votante
 * aun no ha emitido su voto.
 *
 * @param {boolean} votoEmitido - Indica si el votante ya emitio su voto.
 * @param {number} userType - Nivel de privilegio del usuario autenticado.
 * @returns {boolean} `true` si el usuario tiene permiso para editar el pick.
 */
export const canEditPick = (votoEmitido, userType) => {
  if (userType < 3) {
    return true;
  }
  return !votoEmitido;
};

/**
 * Retorna el mensaje de bloqueo cuando un registro no puede ser modificado.
 *
 * Utilizado para mostrar al usuario la razon por la que un pick esta bloqueado.
 *
 * @param {boolean} votoEmitido - Indica si el votante ya emitio su voto.
 * @returns {string} Mensaje descriptivo del bloqueo, o cadena vacia si no hay bloqueo.
 */
export const getBlockedMessage = (votoEmitido) => {
  if (votoEmitido) {
    return 'Este registro no puede ser modificado porque el votante ya emitió su voto.';
  }
  return '';
};

/**
 * Valida si un usuario tiene permiso para realizar una accion sobre un pick.
 *
 * Los administradores (userType < 3) siempre tienen permiso.
 * Los usuarios normales (userType >= 3) no pueden editar ni verificar picks
 * de votantes que ya emitieron su voto.
 *
 * @param {Object} record - Registro del padron sobre el que se quiere actuar.
 * @param {boolean} record.voto_emitido - Indica si el votante ya emitio su voto.
 * @param {number} userType - Nivel de privilegio del usuario autenticado.
 * @param {'edit'|'check'} [action='edit'] - Accion que se desea realizar:
 *   - `'edit'`: modificar el emopick asignado al registro.
 *   - `'check'`: cambiar el estado de verificacion del pick.
 * @returns {{ allowed: boolean, message: string }} Objeto con el resultado de la validacion:
 *   - `allowed`: `true` si la accion esta permitida.
 *   - `message`: mensaje de error si la accion no esta permitida, cadena vacia si esta permitida.
 */
export const validatePickPermissions = (record, userType, action = 'edit') => {
  if (userType < 3) {
    return { allowed: true, message: '' };
  }

  if (action === 'edit' && record.voto_emitido) {
    return {
      allowed: false,
      message: 'No puedes editar picks de votantes que ya emitieron su voto.'
    };
  }

  if (action === 'check' && record.voto_emitido) {
    return {
      allowed: false,
      message: 'No puedes modificar la verificación de votantes que ya emitieron su voto.'
    };
  }

  return { allowed: true, message: '' };
};

/**
 * Actualiza el pick asignado a un registro del padron en la base de datos.
 *
 * Comportamiento segun el valor de `emopickId`:
 * - Si `emopickId` es `null`: limpia completamente el pick del registro,
 *   incluyendo nota, verificacion, usuario y timestamp de verificacion.
 * - Si `emopickId` tiene un valor: asigna el emopick indicado junto con
 *   el usuario que realiza la accion y la nota opcional.
 *
 * @async
 * @param {string} documento - Identificador unico del registro en la tabla `padron`.
 * @param {string|null} emopickId - ID del emopick a asignar, o `null` para limpiar el pick.
 * @param {string|null} pickNota - Nota opcional asociada al pick. Se ignora si `emopickId` es `null`.
 * @param {string} userId - ID del usuario autenticado que realiza la operacion.
 * @returns {Promise<Object[]>} Arreglo con el registro actualizado retornado por Supabase.
 * @throws {Error} Si ocurre un error en la operacion de base de datos.
 */
export const updatePadronPick = async (documento, emopickId, pickNota, userId) => {
  const updateData = emopickId === null
    ? {
        emopick_id: null,
        emopick_user: null,
        pick_nota: null,
        pick_check: false,
        pick_check_user: null,
        pick_check_at: null
      }
    : {
        emopick_id: emopickId,
        emopick_user: userId,
        pick_nota: pickNota || null
      };

  const { data, error } = await supabase
    .from('padron')
    .update(updateData)
    .eq('documento', documento)
    .select();

  if (error) {
    throw new Error(error.message || 'Error al actualizar el pick');
  }

  return data;
};

/**
 * Actualiza el estado de verificacion (pick check) de un registro del padron.
 *
 * Al activar la verificacion (`newPickCheckStatus = true`), registra el usuario
 * que la realizo y el timestamp actual.
 * Al desactivarla (`newPickCheckStatus = false`), limpia el usuario y el timestamp.
 *
 * @async
 * @param {string} documento - Identificador unico del registro en la tabla `padron`.
 * @param {boolean} newPickCheckStatus - Nuevo estado de verificacion: `true` para activar, `false` para desactivar.
 * @param {string} userId - ID del usuario autenticado que realiza la verificacion.
 * @returns {Promise<Object[]>} Arreglo con el registro actualizado retornado por Supabase.
 * @throws {Error} Si ocurre un error en la operacion de base de datos.
 */
export const updatePickCheck = async (documento, newPickCheckStatus, userId) => {
  const { data, error } = await supabase
    .from('padron')
    .update({
      pick_check: newPickCheckStatus,
      pick_check_user: newPickCheckStatus ? userId : null,
      pick_check_at: newPickCheckStatus ? new Date().toISOString() : null
    })
    .eq('documento', documento)
    .select();

  if (error) {
    throw new Error(error.message || 'Error al actualizar la verificación');
  }

  return data;
};
