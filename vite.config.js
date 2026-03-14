import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// Leer package.json para extraer versión y licencia.
// Centraliza estos valores: modificar package.json actualiza automáticamente
// la UI sin necesidad de tocar ningún componente manualmente.
const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));

// Obtener la fecha del último commit de Git para mostrarla en el modal de créditos.
// Se ejecuta en tiempo de build (no en el navegador), por lo que siempre refleja
// la fecha del último deploy sin necesidad de actualizarla manualmente.
const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                 'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

// Mapeo manual del mes a español para evitar dependencia del locale del servidor
let lastCommitDate;
try {
  const raw = execSync('git log -1 --format=%cd --date=format:"%m %Y"').toString().trim();
  const [month, year] = raw.split(' ');
  lastCommitDate = `${months[parseInt(month) - 1]} ${year}`;
} catch {
  const now = new Date();
  lastCommitDate = `${months[now.getMonth()]} ${now.getFullYear()}`;
}

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // Versión de la app leída desde package.json, disponible globalmente en el bundle
    __APP_VERSION__: JSON.stringify(pkg.version),

    // Licencia de uso leída desde package.json, disponible globalmente en el bundle
    __APP_LICENSE__: JSON.stringify(pkg.license),

    // Variable global inyectada en el bundle con la fecha del último commit, 
    // para mostrar en la UI cuándo fue la última actualización del código
    __LAST_UPDATED__: JSON.stringify(lastCommitDate),
  },
  plugins: [
    react(),

    VitePWA({
      // 'autoUpdate': el Service Worker se actualiza automáticamente en segundo plano
      // cuando hay una nueva versión desplegada, sin requerir acción del usuario
      registerType: 'autoUpdate',

      // Archivos estáticos adicionales que el SW debe pre-cachear al instalar
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],

      // Web App Manifest: define cómo se comporta la app cuando está "instalada"
      manifest: {
        name: 'PickPad - Gestión Electoral Digital', // nombre completo (ej: splash screen)
        short_name: 'PickPad',                       // nombre corto bajo el ícono
        description: 'Gestión y fiscalización pick & check de padrones electorales',
        theme_color: '#2563EA',      // color de la barra de estado del sistema operativo
        background_color: '#2563EA', // color de fondo del splash screen al abrir la app
        display: 'standalone',       // oculta la barra del navegador (se ve como app nativa)
        start_url: '/',              // URL que se abre al lanzar la app instalada

        // Íconos requeridos para distintos contextos (launcher, splash, etc.)
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            // 'maskable': permite que Android recorte el ícono en formas adaptables
            // (círculo, squircle, etc.) según el launcher del dispositivo
            src: 'pwa-512x512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
        
      },

      // Workbox: biblioteca que gestiona el Service Worker y las estrategias de caché
      workbox: {
        // Patrones de archivos del build que se pre-cachean al instalar la PWA
        // Esto permite que la app cargue offline (al menos la UI estática)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // Forzar que el SW nuevo tome control inmediatamente sin esperar
        // a que se cierren todas las pestañas de la versión anterior
        skipWaiting: true,

        // Forzar que el SW nuevo tome control de todas las pestañas abiertas
        // inmediatamente después de activarse, sin esperar a que recarguen
        clientsClaim: true,

        // Caché en tiempo de ejecución: para requests que ocurren mientras la app corre
        runtimeCaching: [
          {
            // Intercepta todas las llamadas a la API de Supabase
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,

            // 'NetworkFirst': intenta la red primero; si falla (sin conexión),
            // responde con la versión cacheada. Ideal para datos que deben
            // estar actualizados pero que también queremos disponibles offline
            handler: 'NetworkFirst',

            options: {
              cacheName: 'supabase-cache', // nombre del cache en el navegador
              expiration: {
                maxEntries: 50,                 // máximo 50 respuestas guardadas
                maxAgeSeconds: 60 * 60 * 24     // cada entrada expira en 1 día
              }
            }
          }
        ]
      }
    })
  ],

  // Rutas relativas en el build: necesario cuando el dominio sirve desde la raíz
  base: '/',
  build: {                          
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'supabase': ['@supabase/supabase-js'],
          'lucide': ['lucide-react'],
        }
      }
    }
  },

  optimizeDeps: {
    // lucide-react se excluye de la optimización de dependencias de Vite
    // para evitar problemas de compatibilidad con su sistema de íconos
    exclude: ['lucide-react'],
  },
});