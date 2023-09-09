import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
    vuetify({
      autoImport: true,
      styles: { configFile: 'src/scss/settings.scss' },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Sawamura Application',
        short_name: 'Sawamura',
        description: 'Sawamura',
        theme_color: '#000000',
        background_color: '#FDFDF5',
        icons: [
          {
            src: 'pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          layout: [
            './src/layouts/Default/Index.vue',
            './src/layouts/Auth/Index.vue',
          ],
          auth: [
            './src/views/Auth/Login.vue',
            './src/views/Auth/Register.vue',
            './src/views/Auth/ForgotPassword.vue',
            './src/views/Auth/ConfirmEmail.vue',
            './src/views/Auth/ResetPassword.vue',
          ],
          oauth: [
            './src/views/Oauth/Callback.vue',
            './src/views/Oauth/Error.vue',
          ],
          home: ['./src/views/Home/Index.vue'],
          users: ['./src/views/Users/Index.vue'],
          rooms: ['./src/views/Messages/Index.vue'],
          messages: ['./src/views/Messages/Detail/Index.vue'],
          settings: ['./src/views/Settings/Index.vue'],
          dashboard: [
            './src/views/Dashboard/Index.vue',
            './src/views/Dashboard/Users/Index.vue',
            './src/views/Dashboard/Messages/Index.vue',
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});
