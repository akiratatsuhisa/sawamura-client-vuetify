import { Socket } from 'socket.io-client';
import {
  inject,
  InjectionKey,
  onBeforeUnmount,
  onMounted,
  provide,
  ShallowRef,
  shallowRef,
} from 'vue';

import { useAuth } from '@/composables';
import { KEYS } from '@/constants';

export function initSocket(options: {
  key: InjectionKey<ShallowRef<Socket>>;
  namespace: string;
}) {
  const manager = inject(KEYS.MANAGER_SOCKETS)!;

  const { getAccessTokenSilently } = useAuth();

  const socket = shallowRef<Socket>(manager.socket(options.namespace));

  provide(options.key, socket as any);

  function connect() {
    console.debug(
      `socket:${options.namespace} connected`,
      `client(${socket.value.id})`,
    );
  }

  function disconnect() {
    console.debug(`socket:${options.namespace} disconnected`);
  }

  async function authenticate() {
    console.debug(`socket:${options.namespace}`, 'on authenticate');
    const token = await getAccessTokenSilently();
    socket.value.emit('authenticate', token);
  }

  onMounted(async () => {
    manager.opts.autoConnect = false;
    manager.opts.extraHeaders = {
      authorization: `Bearer ${await getAccessTokenSilently()}`,
    };
    socket.value.connect();

    socket.value.on('connect', connect);
    socket.value.on('disconnect', disconnect);
    socket.value.on('authenticate', authenticate);
  });

  onBeforeUnmount(async () => {
    socket.value.disconnect();

    socket.value.off('connect', connect);
    socket.value.off('disconnect', disconnect);
    socket.value.off('authenticate', authenticate);
  });

  return socket as ShallowRef<Socket>;
}

export function useSocket(options: {
  key: InjectionKey<ShallowRef<Socket>>;
  namespace: string;
}) {
  const socket = inject(options.key);

  if (!socket) {
    throw new Error(
      `socket:${options.namespace} Socket chat has not been initialized`,
    );
  }

  return socket as ShallowRef<Socket>;
}
