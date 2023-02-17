/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined', // For inline testing
  },
  test: {
    includeSource: ['src/**/*.{js,ts,tsx,jsx}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    reporters: ['default', 'html'], //add 'html' for ui 
    coverage: {
      reporter: ['text'],
    },
  },
  plugins: [react()],
  build: {
    sourcemap: true,
  },
});
