import { Manager } from 'socket.io-client';
import { App, Plugin } from 'vue';

import { KEYS } from '@/constants';

const plugin: Plugin = {
  install(app: App) {
    const manager = new Manager(import.meta.env.VITE_WS_URL, {
      path: import.meta.env.VITE_HANDSHAKE_PATH,
      autoConnect: false,
    });

    app.config.globalProperties.$socketManager = manager;
    app.provide(KEYS.MANAGER_SOCKETS, manager);
  },
};

export default plugin;
