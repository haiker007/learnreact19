import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
// import viteCompression from 'vite-plugin-compression';

const ReactCompilerConfig = {};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler', ReactCompilerConfig],
      },
    }),
    visualizer({
      open: true, // Automatically open the report in your browser
      filename: 'stats.html', // Output file name
      gzipSize: true, // Show gzip size (closer to real network impact)
      brotliSize: true, // Show brotli size
    }),
    // viteCompression({
    //   verbose: true, // Log compressed files to console
    //   disable: false, // Enable/disable
    //   threshold: 10240, // Only compress files larger than 10kb
    //   algorithm: 'gzip', // Compression algorithm
    //   ext: '.gz', // Extension
    // }),
    // viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'scripts/[name]-[hash].js',
        chunkFileNames: 'scripts/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'styles/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
        manualChunks(id) {
          console.log('Processing module for chunking:', id);
          if (id.includes('node_modules')) {
            // Redux related
            if (id.includes('redux') || id.includes('@reduxjs')) {
              return 'redux';
            }
            // React Router
            if (id.includes('react-router')) {
              console.log('react-router chunked:', id);
              return 'router';
            }
            // React and React-DOM in one chunk
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react';
            }
            // Ant Design related libraries
            if (id.includes('antd') || id.includes('@ant-design') || id.includes('rc-')) {
              return 'antd';
            }
            // i18next related
            if (id.includes('i18next')) {
              return 'i18n';
            }
            // dayjs
            if (id.includes('dayjs')) {
              return 'dayjs';
            }
            // Other vendor dependencies
            return 'vendor';
          }
        },
      },
    },
    sourcemap: false,
    minify: 'esbuild',
    // terserOptions: {},
    chunkSizeWarningLimit: 1000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
