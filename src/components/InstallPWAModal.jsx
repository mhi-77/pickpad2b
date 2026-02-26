import React, { useState } from 'react';
import { X, Smartphone, Monitor, Share, MoreVertical, PlusSquare, Download } from 'lucide-react';

/**
 * Componente InstallPWAModal
 *
 * Propósito: Muestra instrucciones paso a paso para instalar PickPad como PWA.
 * Este modal es el FALLBACK para plataformas que no soportan instalación nativa
 * (principalmente iOS Safari). En Android/Chrome y PC/Edge la instalación ocurre
 * directamente via el diálogo nativo del navegador (gestionado por useInstallPWA).
 *
 * Props:
 * - isOpen  {boolean}  → controla si el modal está visible
 * - onClose {function} → callback para cerrar el modal (viene de useInstallPWA)
 *
 * Características:
 * - Detección automática de plataforma (Android, iOS, PC) al renderizar
 * - Tabs para cambiar manualmente entre las tres plataformas
 * - Accesible: role="dialog", aria-modal, aria-label en todos los botones
 *
 * Uso en App.jsx:
 *   import { useInstallPWA } from '../hooks/useInstallPWA';
 *   import InstallPWAModal from './InstallPWAModal';
 *
 *   const { isOpen: installOpen, openModal: openInstall, closeModal: closeInstall } = useInstallPWA();
 *   <InstallPWAModal isOpen={installOpen} onClose={closeInstall} />
 */

// --- Detección de plataforma al cargar ---
function detectPlatform() {
  const ua = navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  const isAndroid = /Android/.test(ua);
  if (isIOS) return 'ios';
  if (isAndroid) return 'android';
  return 'desktop';
}

// --- Definición de pasos por plataforma ---
const STEPS = {
  android: {
    label: 'Android · Chrome',
    icon: <Smartphone className="w-5 h-5" />,
    steps: [
      {
        icon: <MoreVertical className="w-5 h-5 text-blue-500" />,
        text: <>Tocá el ícono de <strong>tres puntos</strong> (⋮) en la esquina superior derecha de Chrome.</>,
      },
      {
        icon: <Download className="w-5 h-5 text-blue-500" />,
        text: <>Seleccioná <strong>"Agregar a pantalla de inicio"</strong> o <strong>"Instalar app"</strong>.</>,
      },
      {
        icon: <PlusSquare className="w-5 h-5 text-blue-500" />,
        text: <>Confirmá tocando <strong>"Instalar"</strong>. El ícono de PickPad aparecerá en tu pantalla de inicio.</>,
      },
    ],
  },
  ios: {
    label: 'iPhone · Safari',
    icon: <Smartphone className="w-5 h-5" />,
    steps: [
      {
        icon: <Share className="w-5 h-5 text-blue-500" />,
        text: <>Tocá el ícono de <strong>compartir</strong> (□↑) en la barra inferior de Safari.</>,
      },
      {
        icon: <PlusSquare className="w-5 h-5 text-blue-500" />,
        text: <>Deslizá hacia abajo y seleccioná <strong>"Agregar a pantalla de inicio"</strong>.</>,
      },
      {
        icon: <Download className="w-5 h-5 text-blue-500" />,
        text: <>Tocá <strong>"Agregar"</strong> en la esquina superior derecha. El ícono aparecerá en tu pantalla de inicio.</>,
      },
    ],
  },
  desktop: {
    label: 'PC · Chrome / Edge',
    icon: <Monitor className="w-5 h-5" />,
    steps: [
      {
        icon: <Download className="w-5 h-5 text-blue-500" />,
        text: <>En la barra de direcciones, buscá el ícono de <strong>instalar</strong> (⊕) a la derecha de la URL.</>,
      },
      {
        icon: <PlusSquare className="w-5 h-5 text-blue-500" />,
        text: <>Hacé click y seleccioná <strong>"Instalar"</strong> en el diálogo que aparece.</>,
      },
      {
        icon: <Monitor className="w-5 h-5 text-blue-500" />,
        text: <>PickPad se abrirá como una ventana independiente y aparecerá en tu menú de inicio o dock.</>,
      },
    ],
  },
};

// Orden de tabs de plataformas
const PLATFORMS = ['android', 'ios', 'desktop'];

// --- Componente principal ---
export default function InstallPWAModal({ isOpen, onClose }) {
  // Detecta la plataforma una sola vez y la usa como tab activo inicial
  const [activePlatform, setActivePlatform] = useState(detectPlatform);

  // No renderiza nada si el modal está cerrado
  if (!isOpen) return null;

  const { steps } = STEPS[activePlatform];

  return (
    // Overlay oscuro — click fuera del modal lo cierra
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Instrucciones para instalar la app"
    >
      {/* Contenedor del modal — stopPropagation evita cerrar al hacer click adentro */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header azul con título y tabs de plataforma ── */}
        <div className="bg-blue-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Instalá PickPad</h2>
              <p className="text-blue-100 text-sm mt-0.5">
                Seguí los pasos según tu dispositivo
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar instrucciones de instalación"
              className="p-2 rounded-full hover:bg-blue-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs: permiten cambiar entre plataformas manualmente */}
          <div className="flex gap-2 mt-4">
            {PLATFORMS.map(platform => (
              <button
                key={platform}
                onClick={() => setActivePlatform(platform)}
                aria-label={`Ver instrucciones para ${STEPS[platform].label}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  activePlatform === platform
                    ? 'bg-white text-blue-600'                   // tab activo
                    : 'bg-blue-500 text-white hover:bg-blue-400' // tab inactivo
                }`}
              >
                {STEPS[platform].icon}
                {STEPS[platform].label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Cuerpo: pasos numerados ── */}
        <div className="px-6 py-5">
          <ol className="space-y-4">
            {steps.map((step, index) => (
              <li key={index} className="flex items-start gap-4">
                {/* Número del paso */}
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-bold text-sm flex items-center justify-center">
                  {index + 1}
                </span>
                {/* Ícono + texto descriptivo */}
                <div className="flex items-start gap-2 pt-0.5">
                  <span className="flex-shrink-0 mt-0.5">{step.icon}</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Nota informativa sobre los beneficios de instalar */}
          <div className="mt-5 bg-blue-50 rounded-xl p-4">
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>¿Por qué instalarla?</strong> La app instalada carga más rápido,
              funciona sin barra del navegador y puede usarse con conexión limitada.
            </p>
          </div>
        </div>

        {/* ── Footer con acciones ── */}
        <div className="px-6 pb-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            aria-label="Cerrar y no volver a mostrar"
            className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Ahora no
          </button>
          <button
            onClick={onClose}
            aria-label="Entendido, cerrar instrucciones"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition-colors min-h-[44px]"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
}
