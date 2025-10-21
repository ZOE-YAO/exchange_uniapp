import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),
  ],
  build: {
    // 针对 App 平台的构建配置
    target: 'es2015',
    minify: 'terser',
    cssCodeSplit: false,
    // 完全禁用代码分割
    rollupOptions: {
      output: {
        manualChunks: undefined,
        inlineDynamicImports: true,
      }
    },
    // 优化配置
    chunkSizeWarningLimit: 1500,
    assetsInlineLimit: 4096,
  },
  optimizeDeps: {
    exclude: ['vue-demi']
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

