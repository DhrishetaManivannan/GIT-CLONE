import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': '/src/shared',
      '@views': '/src/views',
      '@api': '/src/api',
      '@constants':'/src/constants',
      
      '@cssVariables': path.resolve(__dirname, 'src/styles/variables.scss'),
      '@cssFonts': path.resolve(__dirname, 'src/styles/fonts.scss'),
    },
  },
    server: {
    port: 3000,
  },
  css: {
    preprocessorOptions: {
      scss: {
       
      },
    },
  },
})