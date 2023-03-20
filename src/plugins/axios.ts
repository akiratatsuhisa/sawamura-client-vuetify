import { App, Plugin } from 'vue';

import { KEYS } from '@/constants';
import { axiosInstacne } from '@/services';

const plugin: Plugin = {
  install(app: App) {
    app.config.globalProperties.$axios = axiosInstacne;
    app.provide(KEYS.AXIOS, axiosInstacne);
  },
};

export default plugin;
