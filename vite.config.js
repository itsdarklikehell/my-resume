import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: '/my-resume/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: 'index.html',
    },
  },
})
