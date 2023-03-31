import { KEYS } from '@/constants';

import { initSocket, useSocket } from './useSocket';

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
