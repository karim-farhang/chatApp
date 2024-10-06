import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, './src'),
      // Polyfill Node.js modules that are not available in browser environments
      path: 'path-browserify',
      fs: false, // Disable fs (file system) in browser environments
      url: 'url',
    },
  },
  build: {
    rollupOptions: {
      plugins: [
        // Polyfill Node.js modules during build
        NodeGlobalsPolyfillPlugin({
          buffer: true, // Enable polyfill for Buffer
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Define esbuild polyfills for Node.js globals to use in the browser
      define: {
        global: 'globalThis',
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
});
