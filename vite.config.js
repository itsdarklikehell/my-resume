import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  base: '/my-resume/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        controlCenter: 'projects/pwnagotchi-control-center.html',
        plugins: 'projects/pwnagotchi-plugins.html',
        pwnspeaker: 'projects/pwnspeaker.html',
      },
    },
  },
})
