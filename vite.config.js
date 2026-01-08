import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: '/dev.html',
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    include: ['tests/**/*.test.js'],
  },
});
