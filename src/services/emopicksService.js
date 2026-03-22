/**
 * emopicksService.js
 *
 * Servicio de acceso a la tabla `emopicks` en Supabase.
 * Los emopicks son las opciones de marcado disponibles para clasificar electores
 * (representadas típicamente por un emoji o display y un contador de usos).
 *
 * Todas las funciones retornan un array vacío ante cualquier error,
 * garantizando que los componentes consumidores nunca reciban `null` o `undefined`.
 */

import { supabase } from '../lib/supabase';

/**
 * Carga solo los emopicks que tienen al menos un uso registrado (`count > 0`).
 * Útil para mostrar únicamente las opciones que han sido utilizadas en el padrón,
 * filtrando las que aún no tienen actividad.
 *
 * Retorna los campos: `id`, `display`, `count`, ordenados por `id` ascendente.
 *
 * @returns {Promise<Array<{id: number, display: string, count: number}>>}
 *   Array de emopicks con uso, o array vacío si ocurre un error o no hay resultados.
 */
export const loadEmopicksWithCount = async () => {
  try {
    const { data, error } = await supabase
      .from('emopicks')
      .select('id, display, count')
      .gt('count', 0)
      .order('id');

    if (error) {
      console.error('Error loading emopicks:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in loadEmopicksWithCount:', error);
    return [];
  }
};

/**
 * Carga todos los emopicks disponibles en la tabla, independientemente de su contador.
 * Útil para listar todas las opciones posibles al asignar un pick a un elector,
 * incluyendo las que aún no han sido usadas.
 *
 * Retorna los campos: `id`, `display`, `count`, ordenados por `id` ascendente.
 *
 * @returns {Promise<Array<{id: number, display: string, count: number}>>}
 *   Array completo de emopicks, o array vacío si ocurre un error o la tabla está vacía.
 */
export const loadAllEmopicks = async () => {
  try {
    const { data, error } = await supabase
      .from('emopicks')
      .select('id, display, count')
      .order('id');

    if (error) {
      console.error('Error loading all emopicks:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in loadAllEmopicks:', error);
    return [];
  }
};

/**
 * Formatea la representación visual de un emopick combinando su display y su conteo.
 *
 * @param {string} display - Texto o emoji del emopick (ej: "👍").
 * @param {number} count - Cantidad de veces que fue utilizado.
 * @returns {string} Cadena formateada (ej: "👍 (42)").
 */
export const formatEmopickDisplay = (display, count) => {
  return `${display} (${count})`;
};
