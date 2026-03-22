/**
 * eslint.config.js
 *
 * Configuración de ESLint para el proyecto (formato flat config, ESLint v9+).
 * Aplica las reglas recomendadas de JavaScript, junto con plugins específicos
 * para React Hooks y React Refresh (HMR en Vite).
 *
 * Entorno: browser (globals del navegador disponibles globalmente).
 * Archivos cubiertos: todos los archivos .js y .jsx del proyecto.
 * Directorio excluido: dist/ (build de producción).
 */

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  /**
   * Excluye el directorio `dist/` del análisis de ESLint.
   * Los archivos compilados no deben ser lintados.
   */
  { ignores: ['dist'] },
  {
    /**
     * Extiende las reglas recomendadas de ESLint para JavaScript.
     * Cubre todos los archivos .js y .jsx del proyecto.
     */
    extends: [js.configs.recommended],
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      /**
       * Permite sintaxis ECMAScript 2020 (nullish coalescing, optional chaining, etc.).
       * Incluye los globals del entorno browser (window, document, navigator, etc.).
       */
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      /**
       * react-hooks: Aplica las reglas de uso correcto de hooks de React.
       * Detecta violaciones como hooks llamados condicionalmente o fuera de componentes.
       */
      'react-hooks': reactHooks,
      /**
       * react-refresh: Garantiza compatibilidad con el Hot Module Replacement (HMR) de Vite.
       * Advierte cuando un módulo exporta algo que no sea un componente React,
       * lo que podría romper el reemplazo en caliente.
       */
      'react-refresh': reactRefresh,
    },
    rules: {
      /**
       * Incluye todas las reglas recomendadas del plugin react-hooks:
       * - rules-of-hooks: Exige que los hooks se llamen en el nivel superior de componentes o hooks personalizados.
       * - exhaustive-deps: Exige que el array de dependencias de useEffect/useCallback/useMemo sea completo.
       */
      ...reactHooks.configs.recommended.rules,
      /**
       * Emite una advertencia (warn) si un módulo exporta algo que no sea un componente React.
       * `allowConstantExport: true` permite exportar constantes no-componentes sin advertencia,
       * lo cual es necesario para archivos como context providers o configuraciones.
       */
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
];
