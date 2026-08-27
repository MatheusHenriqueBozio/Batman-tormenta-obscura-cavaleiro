import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deploy na raiz do domínio (Vercel). Nada de caminho absoluto local.
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
});
