import * as XLSX from 'xlsx';

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

export const formatBoolean = (value) => {
  if (value === null || value === undefined) return '';
  return value ? 'Sí' : 'No';
};

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

export const processRawData = (data) => {
  if (!data || data.length === 0) return [];
  return data;
};

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
