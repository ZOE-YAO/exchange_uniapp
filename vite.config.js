import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  build: {
    // 针对 App 平台的构建配置
    rollupOptions: {
      output: {
        // 移除不支持的 format 配置，使用默认值
        manualChunks: undefined,
      }
    },
    // 禁用代码分割以支持 App 平台
    minify: 'terser',
    cssCodeSplit: false,
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    proxy: {
      '/api/v6': {
        target: 'https://open.er-api.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api/v4': {
        target: 'https://api.exchangerate-api.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})

