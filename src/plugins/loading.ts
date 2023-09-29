import { App, Plugin, ref } from 'vue';

import { KEYS } from '@/constants';
import { axiosInstacne } from '@/services';

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$axios = axiosInstacne;

    const loadings = ref<Array<[string, number | boolean]>>([]);

    app.provide(KEYS.LOADINGS, loadings);
  },
};

export default plugin;
