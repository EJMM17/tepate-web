import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main:           path.resolve(__dirname, 'index.html'),
        productos:      path.resolve(__dirname, 'productos.html'),
        servicios:      path.resolve(__dirname, 'servicios.html'),
        proyectos:      path.resolve(__dirname, 'proyectos.html'),
        nosotros:       path.resolve(__dirname, 'nosotros.html'),
        contacto:       path.resolve(__dirname, 'contacto.html'),
        avisoPrivacidad: path.resolve(__dirname, 'aviso-privacidad.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
