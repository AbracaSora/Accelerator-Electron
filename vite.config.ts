import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
export default defineConfig({
  plugins: [vue(), electron({
    // 配置 Electron 入口文件
    entry: "electron/index.ts"
  }), Components({
    resolvers: [
      AntDesignVueResolver({
        importStyle: false, // css in js
      }),
    ],
  }),],
  //设置代理
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})