/**
 * exportUtils.js
 *
 * Utilidades para exportar datos del padrón electoral.
 * Provee funciones para formatear datos, convertir registros a distintos
 * formatos de columnas, serializar a CSV y descargar archivos desde el navegador.
 * Soporta exportación a .xlsx mediante la librería XLSX (SheetJS).
 */

import * as XLSX from 'xlsx';

/**
 * Formatea un timestamp ISO o string de fecha a una cadena legible en locale es-AR.
 * Incluye día, mes, año, hora, minutos y segundos.
 *
 * @param {string|null} dateString - Fecha en formato ISO o cualquier formato compatible con `new Date()`.
 * @returns {string} Fecha formateada (ej: "22/03/2026, 14:35:00") o cadena vacía si el valor es falsy.
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

/**
 * Convierte un valor booleano a su representación legible en español.
 *
 * @param {boolean|null|undefined} value - Valor a convertir.
 * @returns {string} "Sí", "No", o cadena vacía si el valor es null/undefined.
 */
export const formatBoolean = (value) => {
  if (value === null || value === undefined) return '';
  return value ? 'Sí' : 'No';
};

/**
 * Formatea un timestamp para su uso en columnas de pick/check en exportaciones.
 * - Si el timestamp corresponde al día de hoy, retorna solo la hora (HH:MM).
 * - Si corresponde a otro día, retorna la fecha en formato DD/MM.
 *
 * @param {string|null} timestamp - Timestamp ISO del evento de check.
 * @returns {string} Hora (HH:MM) si es hoy, fecha (DD/MM) si es otro día, o cadena vacía si es falsy.
 */
export const formatPickCheckDateTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const today = new Date();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  const isToday = date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear();

  if (isToday) {
    return `${hours}:${minutes}`;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
};

/**
 * Mapea un array de registros del padrón al formato básico de exportación.
 * Incluye solo los campos de identificación y ubicación del elector.
 *
 * Columnas generadas: Documento, Apellido, Nombre, Sexo, Clase, Domicilio, Mesa N°.
 *
 * @param {Array<Object>} data - Array de registros del padrón.
 * @returns {Array<Object>} Array de objetos con las columnas del formato básico.
 */
export const processBasicData = (data) => {
  return data.map(record => ({
    'Documento': record.documento || '',
    'Apellido': record.apellido || '',
    'Nombre': record.nombre || '',
    'Sexo': record.sexo || '',
    'Clase': record.clase || '',
    'Domicilio': record.domicilio || '',
    'Mesa N°': record.mesa_numero || ''
  }));
};

/**
 * Mapea un array de registros del padrón al formato completo de exportación.
 * Incluye todos los campos del padrón: identificación, voto, pick, datos adicionales y check.
 * Espera que los registros tengan las relaciones `emopicks`, `voto_pick_user_profile`,
 * `emopick_user_profile` y `pick_check_user_profile` ya cargadas (joins de Supabase).
 *
 * @param {Array<Object>} data - Array de registros con relaciones incluidas.
 * @returns {Array<Object>} Array de objetos con todas las columnas del formato completo.
 */
export const processCompleteData = (data) => {
  return data.map(record => ({
    'Documento': record.documento || '',
    'Apellido': record.apellido || '',
    'Nombre': record.nombre || '',
    'Sexo': record.sexo || '',
    'Clase': record.clase || '',
    'Domicilio': record.domicilio || '',
    'Mesa N°': record.mesa_numero || '',
    'Orden': record.orden || '',
    'Voto Emitido': formatBoolean(record.voto_emitido),
    'Fecha/Hora Voto': formatDate(record.voto_pick_at),
    'Fiscal Voto': record.voto_pick_user_profile?.full_name || '',
    'Pick': record.emopicks?.display || '',
    'Nota Pick': record.pick_nota || '',
    'Usuario Pick': record.emopick_user_profile?.full_name || '',
    'Voto Obligatorio': formatBoolean(record.da_voto_obligatorio),
    'Es Nuevo': formatBoolean(record.da_es_nuevo),
    'Texto Libre': record.da_texto_libre || '',
    'Check': formatBoolean(record.pick_check),
    'Usuario Check': record.pick_check_user_profile?.full_name || ''
  }));
};

/**
 * Convierte un array de objetos a una cadena en formato CSV.
 * Los encabezados se toman de las claves del primer objeto.
 * Los valores que contengan comas, comillas o saltos de línea son correctamente
 * escapados según el estándar RFC 4180.
 *
 * @param {Array<Object>} data - Array de objetos con estructura uniforme.
 * @returns {string} Cadena CSV con encabezados en la primera fila, o cadena vacía si el array es vacío.
 */
export const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');

  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const csvRows = data.map(row =>
    headers.map(header => escapeCSVValue(row[header])).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Crea un archivo Blob a partir del contenido, agrega BOM UTF-8 para compatibilidad
 * con Excel, y dispara la descarga en el navegador mediante un enlace temporal.
 *
 * @param {string} content - Contenido del archivo a descargar (ej: string CSV).
 * @param {string} filename - Nombre del archivo resultante (ej: "padron_filtrado_2026.csv").
 * @param {string} mimeType - Tipo MIME del archivo (ej: "text/csv;charset=utf-8;").
 */
export const downloadFile = (content, filename, mimeType) => {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Genera un nombre de archivo con timestamp del momento actual y un sufijo según el tipo.
 *
 * Formato resultante: `padron_{tipo}_{YYYY-MM-DD_HH-MM-SS}.{format}`
 *
 * @param {string} format - Extensión del archivo (ej: "csv", "xlsx").
 * @param {boolean} isBasic - Si es true, usa el sufijo "filtrado"; si no, usa "completo".
 * @returns {string} Nombre de archivo generado (ej: "padron_filtrado_2026-03-22_14-35-00.csv").
 */
export const generateFileName = (format, isBasic) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  const timestamp = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  const type = isBasic ? 'filtrado' : 'completo';
  return `padron_${type}_${timestamp}.${format}`;
};

/**
 * Función de paso que valida y retorna los datos sin ninguna transformación.
 * Retorna un array vacío si los datos son nulos o vacíos.
 *
 * @param {Array<Object>|null} data - Array de registros crudos.
 * @returns {Array<Object>} El mismo array si tiene contenido, o array vacío.
 */
export const processRawData = (data) => {
  if (!data || data.length === 0) return [];
  return data;
};

/**
 * Mapea un array de registros al formato extendido básico de exportación.
 * Prioriza los campos de pick y check (con usuario y fecha), seguidos de
 * los datos de identificación del elector y localidad de la mesa.
 *
 * Si el registro tiene `pick_check = true` y un perfil de usuario check definido,
 * la columna "Check verificado por:" incluye el nombre y la hora/fecha del evento
 * formateada con `formatPickCheckDateTime`.
 *
 * @param {Array<Object>} data - Array de registros con relaciones incluidas.
 * @returns {Array<Object>} Array de objetos con columnas del formato extendido básico.
 */
export const processExtendedBasicData = (data) => {
  return data.map(record => {
    let checkVerifiedBy = '';
    if (record.pick_check && record.pick_check_user_profile?.full_name) {
      checkVerifiedBy = record.pick_check_user_profile.full_name;
      if (record.pick_check_at) {
        checkVerifiedBy += ` - ${formatPickCheckDateTime(record.pick_check_at)}`;
      }
    }

    return {
      'Pick': record.emopicks?.display || '',
      'Marcado por:': record.emopick_user_profile?.full_name || '',
      'Nota Pick': record.pick_nota || '',
      'Check verificado por:': checkVerifiedBy,
      'Voto Emitido': formatBoolean(record.voto_emitido),
      'Documento': record.documento || '',
      'Apellido': record.apellido || '',
      'Nombre': record.nombre || '',
      'Sexo': record.sexo || '',
      'Clase': record.clase || '',
      'Domicilio': record.domicilio || '',
      'Mesa N°': record.mesa_numero || '',
      'Localidad': record.mesas?.mesa_localidad || ''
    };
  });
};

/**
 * Convierte un array de objetos crudos a una cadena en formato CSV.
 * Idéntica en comportamiento a `convertToCSV`, pensada para datos sin transformación previa.
 * Los valores con comas, comillas o saltos de línea son escapados correctamente.
 *
 * @param {Array<Object>} data - Array de objetos con estructura uniforme.
 * @returns {string} Cadena CSV con encabezados en la primera fila, o cadena vacía si el array es vacío.
 */
export const convertRawToCSV = (data) => {
  if (!data || data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(',');

  const escapeCSVValue = (value) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const csvRows = data.map(row =>
    headers.map(header => escapeCSVValue(row[header])).join(',')
  );

  return [csvHeaders, ...csvRows].join('\n');
};

/**
 * Exporta un array de objetos a un archivo .xlsx con formato visual aplicado.
 *
 * Formato aplicado:
 * - Encabezados en negrita con fondo gris claro (D3D3D3) y alineación centrada.
 * - Ancho de columnas calculado automáticamente según el contenido, con máximo de 50 caracteres.
 * - El archivo se descarga directamente en el navegador.
 * - La hoja se nombra "Padrón".
 *
 * @param {Array<Object>} data - Array de objetos a exportar (ya formateados para visualización).
 * @param {string} filename - Nombre del archivo resultante (ej: "padron_completo_2026.xlsx").
 * @returns {Promise<void>}
 */
export const exportToExcelWithFormat = async (data, filename) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Padrón');

  const range = XLSX.utils.decode_range(worksheet['!ref']);

  for (let C = range.s.c; C <= range.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + '1';
    if (!worksheet[address]) continue;
    worksheet[address].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "D3D3D3" } },
      alignment: { horizontal: "center", vertical: "center" }
    };
  }

  const colWidths = [];
  for (let C = range.s.c; C <= range.e.c; ++C) {
    let maxWidth = 10;
    for (let R = range.s.r; R <= range.e.r; ++R) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      const cell = worksheet[cellAddress];
      if (cell && cell.v) {
        const cellLength = String(cell.v).length;
        maxWidth = Math.max(maxWidth, cellLength);
      }
    }
    colWidths.push({ wch: Math.min(maxWidth + 2, 50) });
  }
  worksheet['!cols'] = colWidths;

  XLSX.writeFile(workbook, filename);
};
