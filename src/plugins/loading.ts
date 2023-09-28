import { App, Plugin, ref } from 'vue';

import { KEYS } from '@/constants';
import { axiosInstacne } from '@/services';

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$axios = axiosInstacne;

    const anyLoading = ref<Set<string>>(new Set());
    const loadingPercents = ref<Array<[string, number]>>([]);

    app.provide(KEYS.ANY_LOADING, anyLoading);
    app.provide(KEYS.LOADING_PERCENTS, loadingPercents);
  },
};

export default plugin;
