import { initSocket, useSocket } from '@/composables';
import { KEYS } from '@/constants';

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
