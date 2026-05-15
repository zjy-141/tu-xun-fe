import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    host: '127.0.0.1',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8088',
        changeOrigin: true,
      },
    },
  },
})
//     server: {
//         host: '127.0.0.1',
//         port: 5173,
//         proxy: {
//         '/api': {
//          // target: "https://shijian.tiaozhan.com",
//          target: 'http://127.0.0.1:8088',
//          changeOrigin: true,
//          secure: true
//         }
//         },
//     },
// }