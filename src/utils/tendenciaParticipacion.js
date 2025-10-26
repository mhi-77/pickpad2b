const INDICES_HISTORICOS = [
  { hora: 9, minutos: 0, porcentaje: 0.070 },
  { hora: 9, minutos: 30, porcentaje: 0.115 },
  { hora: 10, minutos: 0, porcentaje: 0.160 },
  { hora: 10, minutos: 30, porcentaje: 0.215 },
  { hora: 11, minutos: 0, porcentaje: 0.270 },
  { hora: 11, minutos: 30, porcentaje: 0.355 },
  { hora: 12, minutos: 0, porcentaje: 0.440 },
  { hora: 12, minutos: 30, porcentaje: 0.485 },
  { hora: 13, minutos: 0, porcentaje: 0.530 },
  { hora: 13, minutos: 30, porcentaje: 0.580 },
  { hora: 14, minutos: 0, porcentaje: 0.630 },
  { hora: 14, minutos: 30, porcentaje: 0.680 },
  { hora: 15, minutos: 0, porcentaje: 0.730 },
  { hora: 15, minutos: 30, porcentaje: 0.765 },
  { hora: 16, minutos: 0, porcentaje: 0.800 },
  { hora: 16, minutos: 30, porcentaje: 0.860 },
  { hora: 17, minutos: 0, porcentaje: 0.920 },
  { hora: 17, minutos: 30, porcentaje: 0.980 }
];

export function obtenerIndiceHistorico(fechaHora = null) {
  const ahora = fechaHora || new Date();
  const horaActual = ahora.getHours();
  const minutosActuales = ahora.getMinutes();

  if (horaActual < 3) {
    return null;
  }

  if (horaActual > 17 || (horaActual === 17 && minutosActuales > 30)) {
    return INDICES_HISTORICOS[INDICES_HISTORICOS.length - 1];
  }

  let indiceEncontrado = INDICES_HISTORICOS[0];

  for (let i = 0; i < INDICES_HISTORICOS.length; i++) {
    const indice = INDICES_HISTORICOS[i];

    if (indice.hora > horaActual) {
      break;
    }

    if (indice.hora === horaActual) {
      if (indice.minutos <= minutosActuales) {
        indiceEncontrado = indice;
      } else {
        break;
      }
    } else if (indice.hora < horaActual) {
      indiceEncontrado = indice;
    }
  }

  return indiceEncontrado;
}

export function obtenerAsistenciaHistorica(fechaHora = null) {
  const indice = obtenerIndiceHistorico(fechaHora);

  if (!indice) {
    return null;
  }

  return indice.porcentaje * 100;
}

export function calcularTendenciaProyectada(totalVotaron, totalEmpadronados, fechaHora = null) {
  if (totalEmpadronados === 0) {
    return null;
  }

  const indice = obtenerIndiceHistorico(fechaHora);

  if (!indice) {
    return null;
  }

  if (indice.porcentaje === 0) {
    return null;
  }

  const tendencia = (totalVotaron / indice.porcentaje) / totalEmpadronados;

  return tendencia * 100;
}

export function calcularAsistenciaActual(totalVotaron, totalEmpadronados) {
  if (totalEmpadronados === 0) {
    return 0;
  }

  return (totalVotaron / totalEmpadronados) * 100;
}

export function obtenerHoraFormateada(fechaHora = null) {
  const ahora = fechaHora || new Date();
  const horas = ahora.getHours().toString().padStart(2, '0');
  const minutos = ahora.getMinutes().toString().padStart(2, '0');
  return `${horas}:${minutos}`;
}

export function obtenerColorTendencia(tendenciaProyectada) {
  if (tendenciaProyectada === null) {
    return 'gray';
  }

  if (tendenciaProyectada >= 60) {
    return 'green';
  } else if (tendenciaProyectada >= 45) {
    return 'yellow';
  } else {
    return 'red';
  }
}
