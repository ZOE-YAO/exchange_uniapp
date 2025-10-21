import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  // 不自定义 build.rollupOptions.output.format
  // 让 UniApp 插件自动处理所有构建配置
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

