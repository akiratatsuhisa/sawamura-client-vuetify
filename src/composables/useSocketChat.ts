import { initSocket, useSocket } from '@/composables';
import { KEYS } from '@/constants';

const options = {
  key: KEYS.SOCKET_CHAT,
  namespace: '/chat',
};

export function initSocketChat() {
  return initSocket(options);
}

export function useSocketChat() {
  return useSocket(options);
}
