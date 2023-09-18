import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';

/**
 * server.proxy 配置了代理，将以 /api 开头的请求代理到 http://38.47.101.62:9901。这意味着所有以 /api 开头的请求将被代理到目标地址。
 * plugins 包括了Vue插件，用于支持Vue.js。
 * resolve.alias 设置了别名，允许你使用@来引用项目中的 src 目录。
 */
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://38.47.101.62:9901',
        // target: 'http://127.0.0.1:9901',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
};
