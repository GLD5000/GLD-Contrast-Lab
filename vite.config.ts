import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined', // For inline testing
  },
  test: {
    includeSource: ['src/**/*.{js,ts}'],
    coverage: {
      reporter: ['text', 'html'],
    },
  },
  plugins: [react()],
  build: {
    sourcemap: true,
  },
});
