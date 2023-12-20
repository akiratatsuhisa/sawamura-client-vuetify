import { App, Plugin, ref } from 'vue';

import { KEYS } from '@/constants';

const plugin: Plugin = {
  install(app: App) {
    const loadings = ref<Array<[string, number | boolean]>>([]);

    app.provide(KEYS.LOADINGS, loadings);
  },
};

export default plugin;
