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
    'Emoción': record.emopicks?.display || '',
    'Nota Emoción': record.pick_nota || '',
    'Usuario Emoción': record.emopick_user_profile?.full_name || '',
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
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const type = isBasic ? 'basico' : 'completo';
  return `padron_${type}_${timestamp}.${format}`;
};
