import { App, Plugin, reactive } from 'vue';

import { alertFire, AlertOptions } from '@/composables';
import { KEYS } from '@/constants';

const plugin: Plugin = {
  install(app: App) {
    const items = reactive([]);
    app.provide(KEYS.ALERT, items);

    app.config.globalProperties.$alert = (options: AlertOptions) =>
      alertFire(items, options);
  },
};

export default plugin;
