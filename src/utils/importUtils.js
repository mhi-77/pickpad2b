/**
 * importUtils.js - Utilidades para importación de padrón electoral
 *
 * Proporciona funciones para:
 * - Parseo de archivos CSV y Excel
 * - Validación de estructura e integridad de datos
 * - Normalización de registros
 * - Descarga de plantillas y reportes de errores
 *
 * @module importUtils
 */

import * as XLSX from 'xlsx';

// ============================================================
// CONSTANTES
// ============================================================

/**
 * Columnas obligatorias que deben estar presentes en todo archivo de importación
 */
export const REQUIRED_COLUMNS = [
  'documento',
  'apellido',
  'nombre',
  'sexo',
  'clase',
  'domicilio',
  'mesa_numero',
  'orden'
];

/**
 * Todas las columnas que puede contener el archivo de importación
 */
export const ALL_COLUMNS = [
  'documento', 'apellido', 'nombre', 'sexo', 'clase', 'domicilio',
  'mesa_numero', 'orden', 'da_es_nuevo', 'da_voto_obligatorio', 'da_texto_libre',
  'emopick_id', 'pick_nota', 'pick_check', 'voto_emitido', 'voto_pick_at',
  'voto_pick_user', 'emopick_user', 'pick_check_user'
];

// ============================================================
// FUNCIONES DE PARSEO
// ============================================================

/**
 * Parsea un archivo CSV y retorna headers y records
 */
export const parseCSVFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());

        if (lines.length === 0) {
          reject(new Error('El archivo está vacío'));
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const records = [];

        for (let i = 1; i < lines.length; i++) {
          const values = parseCSVLine(lines[i]);
          if (values.length === headers.length) {
            const record = {};
            headers.forEach((header, index) => {
              record[header] = values[index];
            });
            records.push(record);
          }
        }

        resolve({ headers, records });
      } catch (error) {
        reject(new Error(`Error al parsear CSV: ${error.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file, 'UTF-8');
  });
};

/**
 * Parsea una línea CSV manejando valores entre comillas
 */
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current.trim());
  return values;
};

/**
 * Parsea un archivo Excel (XLS/XLSX) y retorna headers y records
 */
export const parseXLSXFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1, defval: '' });

        if (jsonData.length === 0) {
          reject(new Error('El archivo está vacío'));
          return;
        }

        const headers = jsonData[0].map(h => String(h).trim());
        const records = [];

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          const record = {};
          headers.forEach((header, index) => {
            record[header] = row[index] !== undefined ? String(row[index]).trim() : '';
          });
          records.push(record);
        }

        resolve({ headers, records });
      } catch (error) {
        reject(new Error(`Error al parsear Excel: ${error.message}`));
      }
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
};

// ============================================================
// FUNCIONES DE VALIDACIÓN
// ============================================================

/**
 * Valida la estructura de un registro
 */
export const validateRecordStructure = (record, rowNumber) => {
  const errors = [];

  if (!record.documento || record.documento === '') {
    errors.push({
      row: rowNumber,
      field: 'documento',
      value: record.documento,
      error: 'El documento es obligatorio y no puede estar vacío'
    });
  } else if (isNaN(record.documento) || parseInt(record.documento) <= 0) {
    errors.push({
      row: rowNumber,
      field: 'documento',
      value: record.documento,
      error: 'El documento debe ser un número positivo'
    });
  }

  if (record.mesa_numero && record.mesa_numero !== '' && isNaN(record.mesa_numero)) {
    errors.push({
      row: rowNumber,
      field: 'mesa_numero',
      value: record.mesa_numero,
      error: 'El número de mesa debe ser un número'
    });
  }

  if (record.orden && record.orden !== '' && isNaN(record.orden)) {
    errors.push({
      row: rowNumber,
      field: 'orden',
      value: record.orden,
      error: 'El orden debe ser un número'
    });
  }

  if (record.clase && record.clase !== '' && (isNaN(record.clase) || parseInt(record.clase) < 1900 || parseInt(record.clase) > new Date().getFullYear() + 10)) {
    errors.push({
      row: rowNumber,
      field: 'clase',
      value: record.clase,
      error: `La clase debe ser un año entre 1900 y ${new Date().getFullYear() + 10}`
    });
  }

  if (record.emopick_id && record.emopick_id !== '' && isNaN(record.emopick_id)) {
    errors.push({
      row: rowNumber,
      field: 'emopick_id',
      value: record.emopick_id,
      error: 'El emopick_id debe ser un número'
    });
  }

  if (record.sexo && record.sexo !== '' && !['M', 'F', 'm', 'f', 'X', 'x'].includes(record.sexo)) {
    errors.push({
      row: rowNumber,
      field: 'sexo',
      value: record.sexo,
      error: 'El sexo debe ser M o F'
    });
  }

  const booleanFields = ['voto_emitido', 'pick_check', 'da_es_nuevo', 'da_voto_obligatorio'];
  booleanFields.forEach(field => {
    if (record[field] && record[field] !== '') {
      const value = String(record[field]).toLowerCase();
      if (!['true', 'false', '1', '0', 'sí', 'si', 'no', 'yes'].includes(value)) {
        errors.push({
          row: rowNumber,
          field: field,
          value: record[field],
          error: `${field} debe ser true/false, 1/0, o sí/no`
        });
      }
    }
  });

  const uuidFields = ['voto_pick_user', 'emopick_user', 'pick_check_user'];
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  uuidFields.forEach(field => {
    if (record[field] && record[field] !== '' && !uuidRegex.test(record[field])) {
      errors.push({
        row: rowNumber,
        field: field,
        value: record[field],
        error: `${field} debe ser un UUID válido`
      });
    }
  });

  if (record.voto_pick_at && record.voto_pick_at !== '') {
    const date = new Date(record.voto_pick_at);
    if (isNaN(date.getTime())) {
      errors.push({
        row: rowNumber,
        field: 'voto_pick_at',
        value: record.voto_pick_at,
        error: 'voto_pick_at debe ser una fecha válida en formato ISO 8601'
      });
    }
  }

  return errors;
};

/**
 * Valida la integridad referencial de un registro
 */
export const validateRecordIntegrity = (record, rowNumber, referenceData) => {
  const errors = [];
  const { mesas, emopicks, profiles } = referenceData;

  if (record.mesa_numero && record.mesa_numero !== '') {
    const mesaNum = parseInt(record.mesa_numero);
    if (!mesas.includes(mesaNum)) {
      errors.push({
        row: rowNumber,
        field: 'mesa_numero',
        value: record.mesa_numero,
        error: `La mesa ${mesaNum} no existe en la base de datos`
      });
    }
  }

  if (record.emopick_id && record.emopick_id !== '') {
    const emopickId = parseInt(record.emopick_id);
    if (!emopicks.includes(emopickId)) {
      errors.push({
        row: rowNumber,
        field: 'emopick_id',
        value: record.emopick_id,
        error: `El emopick ${emopickId} no existe en la base de datos`
      });
    }
  }

  const uuidFields = ['voto_pick_user', 'emopick_user', 'pick_check_user'];
  uuidFields.forEach(field => {
    if (record[field] && record[field] !== '') {
      if (!profiles.includes(record[field])) {
        errors.push({
          row: rowNumber,
          field: field,
          value: record[field],
          error: `El usuario ${record[field]} no existe en profiles`
        });
      }
    }
  });

  return errors;
};

/**
 * Detecta documentos duplicados dentro del archivo
 */
export const checkDuplicateDocuments = (records) => {
  const documentMap = new Map();
  const duplicates = [];

  records.forEach((record, index) => {
    const doc = record.documento;
    if (doc && doc !== '') {
      if (documentMap.has(doc)) {
        duplicates.push({
          row: index + 2,
          field: 'documento',
          value: doc,
          error: `Documento duplicado en el archivo (también en fila ${documentMap.get(doc)})`
        });
      } else {
        documentMap.set(doc, index + 2);
      }
    }
  });

  return duplicates;
};

// ============================================================
// FUNCIONES DE NORMALIZACIÓN
// ============================================================

/**
 * Normaliza un registro convirtiéndolo a los tipos correctos
 */
export const normalizeRecord = (record) => {
  const normalized = {};

  // ===== PASO 1: Copiar solo campos con nombres válidos =====
  Object.keys(record).forEach(key => {
    // Ignorar campos con nombres vacíos o inválidos
    if (key && key.trim() !== '') {
      normalized[key] = record[key];
    }
  });

  // ===== NORMALIZAR: Campos numéricos (bigint) =====
  // IMPORTANTE: bigint NO acepta strings vacíos, deben ser null
  if (normalized.documento && normalized.documento !== '') {
    normalized.documento = parseInt(normalized.documento);
  } else {
    throw new Error('documento es obligatorio');
  }

  if (normalized.mesa_numero && normalized.mesa_numero !== '') {
    normalized.mesa_numero = parseInt(normalized.mesa_numero);
  } else {
    normalized.mesa_numero = null;
  }

  if (normalized.orden && normalized.orden !== '') {
    normalized.orden = parseInt(normalized.orden);
  } else {
    normalized.orden = null;
  }

  if (normalized.clase && normalized.clase !== '') {
    normalized.clase = parseInt(normalized.clase);
  } else {
    normalized.clase = null;
  }

  if (normalized.emopick_id && normalized.emopick_id !== '') {
    normalized.emopick_id = parseInt(normalized.emopick_id);
  } else {
    normalized.emopick_id = null;
  }

  // ===== NORMALIZAR: Sexo (uppercase o null) =====
  if (normalized.sexo && normalized.sexo !== '') {
    normalized.sexo = normalized.sexo.toUpperCase();
  } else {
    normalized.sexo = null;
  }

  // ===== NORMALIZAR: Campos booleanos =====
  const booleanFields = ['voto_emitido', 'pick_check', 'da_es_nuevo', 'da_voto_obligatorio'];
  booleanFields.forEach(field => {
    if (normalized[field] !== undefined && normalized[field] !== '') {
      const value = String(normalized[field]).toLowerCase();
      normalized[field] = ['true', '1', 'sí', 'si', 'yes'].includes(value);
    } else {
      normalized[field] = false;
    }
  });

  // ===== NORMALIZAR: Campos UUID (null si vacío) =====
  const uuidFields = ['voto_pick_user', 'emopick_user', 'pick_check_user'];
  uuidFields.forEach(field => {
    if (normalized[field] && normalized[field] !== '') {
      // Mantener el UUID como string
      normalized[field] = normalized[field];
    } else {
      normalized[field] = null;
    }
  });

  // ===== NORMALIZAR: voto_pick_at (fecha ISO 8601 o null) =====
  if (normalized.voto_pick_at && normalized.voto_pick_at !== '') {
    normalized.voto_pick_at = new Date(normalized.voto_pick_at).toISOString();
  } else {
    normalized.voto_pick_at = null;
  }

  // ===== NORMALIZAR: Campos de texto (string vacío o valor) =====
  if (!normalized.pick_nota) normalized.pick_nota = '';
  if (!normalized.da_texto_libre) normalized.da_texto_libre = '';

  const stringFields = ['apellido', 'nombre', 'domicilio'];
  stringFields.forEach(field => {
    if (normalized[field] === undefined || normalized[field] === null) {
      normalized[field] = '';
    }
  });

  // ===== PASO FINAL: Eliminar cualquier campo con nombre vacío que pueda haber quedado =====
  Object.keys(normalized).forEach(key => {
    if (!key || key.trim() === '') {
      delete normalized[key];
    }
  });

  return normalized;
};

// ============================================================
// FUNCIONES DE EXPORTACIÓN
// ============================================================

/**
 * Genera contenido CSV de plantilla de importación
 */
export const generateImportTemplate = () => {
  const headers = [
    'documento', 'apellido', 'nombre', 'sexo', 'clase', 'domicilio',
    'mesa_numero', 'orden', 'da_es_nuevo', 'da_voto_obligatorio', 'da_texto_libre',
    'emopick_id', 'pick_nota', 'pick_check', 'voto_emitido', 'voto_pick_at',
    'voto_pick_user', 'emopick_user', 'pick_check_user'
  ];

  const exampleRow = [
    '12345678', 'GARCIA', 'JUAN', 'M', '1985', 'CALLE FALSA 123',
    '1000', '1', 'false', 'true', '',
    '1', 'Votó temprano', 'true', 'true', '2025-10-22T10:30:00Z',
    '', '', ''
  ];

  const escapeCSV = (value) => {
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escapeCSV).join(',');
  const exampleLine = exampleRow.map(escapeCSV).join(',');

  return `${headerLine}\n${exampleLine}`;
};

/**
 * Descarga un reporte CSV con los errores de validación
 */
export const downloadErrorReport = (errors) => {
  const headers = ['Fila', 'Campo', 'Valor', 'Error'];
  const csvHeaders = headers.join(',');

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvRows = errors.map(error =>
    [error.row, error.field, error.value, error.error].map(escapeCSV).join(',')
  );

  const csvContent = [csvHeaders, ...csvRows].join('\n');
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `errores_importacion_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Descarga la plantilla CSV de importación
 */
export const downloadTemplate = () => {
  const content = generateImportTemplate();
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + content], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'plantilla_importacion_padron.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};