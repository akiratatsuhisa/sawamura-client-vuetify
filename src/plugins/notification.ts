import { App, Component, Plugin, reactive } from 'vue';

import {
  alertFire,
  AlertOptions,
  AlertProps,
  SnackbarOptions,
  SnackbarProps,
  snackbarShow,
} from '@/composables';
import { KEYS } from '@/constants';

const plugin: Plugin = {
  install(app: App) {
    // alerts config
    const alerts = reactive<Array<AlertProps>>([]);

    app.provide(KEYS.ALERTS, alerts);

    app.config.globalProperties.$alert = (options: AlertOptions) =>
      alertFire(alerts, options);

    // snackbars config
    const snackbars = reactive<Array<SnackbarProps>>([]);

    app.provide(KEYS.SNACKBARS, snackbars);

    app.config.globalProperties.$snackbar = (
      messageOrComponent: string | Component,
      options: SnackbarOptions,
    ) => snackbarShow(snackbars, messageOrComponent, options);
  },
};

export default plugin;
