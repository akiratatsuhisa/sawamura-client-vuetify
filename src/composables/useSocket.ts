import { Socket } from 'socket.io-client';
import {
  inject,
  InjectionKey,
  onBeforeUnmount,
  onMounted,
  provide,
  Ref,
  ref,
} from 'vue';

import { KEYS } from '@/constants';

import { useAuth } from './useAuth';

export function initSocket(options: {
  key: InjectionKey<Ref<Socket>>;
  namespace: string;
}) {
  const manager = inject(KEYS.MANAGER_SOCKETS)!;

  const { getAccessTokenSilently } = useAuth();

  const socket = ref<Socket>(manager.socket(options.namespace));

  provide(options.key, socket);

  function connect() {
    console.debug(
      `socket:${options.namespace}`,
      `client(${socket.value.id}) connected`,
    );
  }

  function disconnect() {
    console.debug(
      `socket:${options.namespace}`,
      `client(${socket.value.id}) disconnected`,
    );
  }

  async function authenticate() {
    console.debug(`socket:${options.namespace}`, 'on authenticate');
    const token = await getAccessTokenSilently({ throw: false });
    socket.value.emit(`socket:${options.namespace}`, `authenticate ${token}`);
  }

  onMounted(async () => {
    manager.opts.autoConnect = false;
    manager.opts.extraHeaders = {
      authorization: `Bearer ${await getAccessTokenSilently({ throw: false })}`,
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

  return socket as Ref<Socket>;
}

export function useSocket(options: {
  key: InjectionKey<Ref<Socket>>;
  namespace: string;
}) {
  const socket = inject(options.key);

  if (!socket) {
    throw new Error(
      `socket:${options.namespace} Socket chat has not been initialized`,
    );
  }

  return socket as Ref<Socket>;
}
