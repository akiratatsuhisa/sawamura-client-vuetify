// Plugins
import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
// Utilities
import { defineConfig } from 'vite';
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
          home: ['./src/views/Home.vue'],
          rooms: ['./src/views/Messages/RoomList.vue'],
          messages: ['./src/views/Messages/RoomContent.vue'],
          dashboard: [
            './src/views/Dashboard/Index.vue',
            './src/views/Dashboard/Users.vue',
            './src/views/Dashboard/Messages.vue',
          ],
          auth: [
            './src/views/Auth/Profile.vue',
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
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});
