import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'ferreteria_selva_logo.png',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png',
      ],
      workbox: {
        // Aumenta el límite de tamaño de archivo a 4 MiB (4 * 1024 * 1024 bytes)
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,png,jpg,jpeg,gif,svg,ico,webmanifest}'],
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.origin.includes('firestore.googleapis.com') ||
              url.origin.includes('firebase.googleapis.com') ||
              url.origin.includes('firebaseio.com'),
            handler: 'NetworkOnly',
            options: {
              cacheName: 'firebase-excluded',
            },
          },
        ],
      },
      // Opcional: Define el manifiesto aquí si no tienes un manifest.webmanifest separado
      manifest: {
        name: 'Proyecto 2025',
        short_name: 'P2025',
        description: 'Aplicación PWA para Proyecto 2025',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  base: '/',
  server: {
    host: '0.0.0.0', // Permite que otros dispositivos accedan al servidor
    port: 5173,
  },
});