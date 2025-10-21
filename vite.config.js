import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      uni(),
    ],
    build: {
      // 针对 App 平台完全禁用代码分割
      minify: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          inlineDynamicImports: true,
        }
      }
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
  }
})

