/**
 * Pagination Component
 *
 * Componente de paginación completo con controles de navegación y selector de tamaño de página.
 * Implementa un diseño inteligente de números de página con elipsis para optimizar espacio.
 *
 * Características principales:
 * - Navegación rápida (primera/última página)
 * - Navegación secuencial (anterior/siguiente)
 * - Visualización inteligente de números de página con elipsis
 * - Selector de cantidad de elementos por página
 * - Contador de elementos mostrados vs. totales
 * - Diseño responsivo (diferentes vistas para móvil/escritorio)
 * - Estados deshabilitados durante carga
 */

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * @param {number} currentPage - Página actual (base 1)
 * @param {number} totalPages - Total de páginas disponibles
 * @param {number} totalItems - Total de elementos en el dataset completo
 * @param {number} pageSize - Cantidad de elementos por página
 * @param {Function} onPageChange - Callback cuando se cambia de página
 * @param {Function} onPageSizeChange - Callback cuando se cambia el tamaño de página
 * @param {Array} pageSizeOptions - Opciones disponibles para tamaño de página
 * @param {boolean} loading - Indica si hay una operación en curso (deshabilita controles)
 */
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  loading = false
}) {
  // Calcular el rango de elementos mostrados en la página actual
  // startItem: Primer elemento de la página (ej: página 2 con 10 items = elemento 11)
  // endItem: Último elemento de la página (considera si es la última página parcial)
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  /**
   * Genera un array inteligente de números de página para mostrar
   *
   * Implementa un algoritmo que muestra números relevantes con elipsis (...) cuando hay muchas páginas.
   * Esto evita renderizar cientos de botones cuando hay datasets grandes.
   *
   * Comportamiento según contexto:
   * - Si totalPages <= 5: Muestra todos los números
   * - Si estamos cerca del inicio (página 1-3): Muestra [1, 2, 3, 4, ..., última]
   * - Si estamos cerca del final: Muestra [1, ..., N-3, N-2, N-1, N]
   * - Si estamos en el medio: Muestra [1, ..., actual-1, actual, actual+1, ..., última]
   *
   * @returns {Array} Array de números de página y strings '...' para elipsis
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Máximo de números de página visibles sin elipsis

    // CASO 1: Pocas páginas - Mostrar todas sin elipsis
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // CASO 2: Estamos cerca del inicio (páginas 1-3)
      // Patrón: [1, 2, 3, 4, ..., última]
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
      // CASO 3: Estamos cerca del final
      // Patrón: [1, ..., N-3, N-2, N-1, N]
      else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      }
      // CASO 4: Estamos en el medio
      // Patrón: [1, ..., actual-1, actual, actual+1, ..., última]
      else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Obtener array de números de página a renderizar
  const pageNumbers = getPageNumbers();

  // RENDERIZADO: Layout responsivo con contador de items y controles de navegación
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200">
      {/* Sección izquierda: Contador de elementos mostrados
          Formato: "Mostrando 11-20 de 150 resultados"
          En móvil se ocultan algunas palabras para ahorrar espacio */}
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <span className="hidden sm:inline">Mostrando</span>
        <span className="font-medium">{startItem}-{endItem}</span>
        <span>de</span>
        <span className="font-medium">{totalItems}</span>
        <span className="hidden sm:inline">resultados</span>
      </div>

      {/* Sección derecha: Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Selector de tamaño de página
            Permite cambiar cuántos elementos se muestran por página */}
        <div className="flex items-center gap-1 text-sm text-gray-700 mr-2">
          <label htmlFor="pageSize" className="hidden sm:inline">Por página:</label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={loading}
            className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {pageSizeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Botón: Ir a primera página
            Deshabilitado si ya estamos en la primera página o durante carga */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || loading}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Primera página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Botón: Ir a página anterior
            Deshabilitado si estamos en la primera página o durante carga */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Vista escritorio: Números de página individuales con elipsis
            Permite saltar directamente a cualquier página visible */}
        <div className="hidden sm:flex items-center gap-1">
          {pageNumbers.map((page, idx) => {
            // Renderizar elipsis como texto estático
            if (page === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">
                  ...
                </span>
              );
            }
            // Renderizar botón de número de página
            // La página actual se destaca con fondo azul
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`min-w-[32px] px-2 py-1 rounded text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Vista móvil: Indicador simple de página actual
            Formato: "3 / 10" (más compacto para pantallas pequeñas) */}
        <div className="sm:hidden flex items-center gap-2 text-sm text-gray-700">
          <span className="font-medium">{currentPage}</span>
          <span>/</span>
          <span className="font-medium">{totalPages}</span>
        </div>

        {/* Botón: Ir a página siguiente
            Deshabilitado si estamos en la última página o durante carga */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Botón: Ir a última página
            Deshabilitado si ya estamos en la última página o durante carga */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || loading}
          className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
