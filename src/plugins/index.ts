/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Types and Plugins
import type { App } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

import VBaseBottomSheet from '@/components/VBaseBottomSheet.vue';
import VBaseDialog from '@/components/VBaseDialog.vue';
import VBaseLoading from '@/components/VBaseLoading.vue';
import VBaseMenu from '@/components/VBaseMenu.vue';
import VFloatingActionButton from '@/components/VFloatingActionButton.vue';
import VFloatingActionButtonWrapper from '@/components/VFloatingActionButtonWrapper.vue';
import i18n from '@/locales';
import axios from '@/plugins/axios';
import loading from '@/plugins/loading';
import notification from '@/plugins/notification';
import socket from '@/plugins/socket';
import vuetify from '@/plugins/vuetify';
import { loadFonts } from '@/plugins/webfontloader';
import router from '@/router';
import pinia from '@/store';

export function registerPlugins(app: App) {
  loadFonts();
  app
    .use(router)
    .use(pinia)
    .use(loading)
    .use(axios)
    .use(socket)
    .use(vuetify)
    .use(notification)
    .use(i18n)
    .use(VueApexCharts);

  app.component('VBaseLoading', VBaseLoading);
  app.component('VBaseDialog', VBaseDialog);
  app.component('VBaseMenu', VBaseMenu);
  app.component('VBaseBottomSheet', VBaseBottomSheet);
  app.component('VFloatingActionButton', VFloatingActionButton);
  app.component('VFloatingActionButtonWrapper', VFloatingActionButtonWrapper);
}
