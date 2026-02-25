import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
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
        description: 'Gestión Electoral Digital',
        theme_color: '#2563EA',      // color de la barra de estado del sistema operativo
        background_color: '#2563EA', // color de fondo del splash screen al abrir la app
        display: 'standalone',       // oculta la barra del navegador (se ve como app nativa)
        start_url: '/',              // URL que se abre al lanzar la app instalada

        // Íconos requeridos para distintos contextos (launcher, splash, etc.)
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            // 'maskable': permite que Android recorte el ícono en formas adaptables
            // (círculo, squircle, etc.) según el launcher del dispositivo
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },

      // Workbox: biblioteca que gestiona el Service Worker y las estrategias de caché
      workbox: {
        // Patrones de archivos del build que se pre-cachean al instalar la PWA
        // Esto permite que la app cargue offline (al menos la UI estática)
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

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
  base: './',
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
    exclude: ['lucide-react'],
  },

  optimizeDeps: {
    // lucide-react se excluye de la optimización de dependencias de Vite
    // para evitar problemas de compatibilidad con su sistema de íconos
    exclude: ['lucide-react'],
  },
});