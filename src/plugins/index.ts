/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types and Plugins
import type { App } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import VBaseDialog from '@/components/VBaseDialog.vue';
import alert from '@/plugins/alert';
import axios from '@/plugins/axios';
import socket from '@/plugins/socket';
import vuetify from '@/plugins/vuetify';
import { loadFonts } from '@/plugins/webfontloader';
import router from '@/router';
import pinia from '@/store';

export function registerPlugins(app: App) {
  loadFonts();
  app
    .use(vuetify)
    .use(alert)
    .use(axios)
    .use(socket)
    .use(router)
    .use(pinia)
    .use(VueApexCharts);

  app.component('VBaseDialog', VBaseDialog);
}
