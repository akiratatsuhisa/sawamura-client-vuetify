/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types and Plugins
import type { App } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import BaseDialog from '@/components/BaseDialog.vue';

import router from '../router';
import pinia from '../store';
import axios from './axios';
import socket from './socket';
import vuetify from './vuetify';
import { loadFonts } from './webfontloader';

export function registerPlugins(app: App) {
  loadFonts();
  app
    .use(vuetify)
    .use(axios)
    .use(socket)
    .use(router)
    .use(pinia)
    .use(VueApexCharts);

  app.component('BaseDialog', BaseDialog);
}
