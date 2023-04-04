import { KEYS } from '@/constants';

import { initSocket, useSocket } from './useSocket';

const options = {
  key: KEYS.SOCKET_NOTIFICATIONS,
  namespace: '/notifications',
};

export function initSocketNotifications() {
  return initSocket(options);
}

export function useSocketNotifications() {
  return useSocket(options);
}
