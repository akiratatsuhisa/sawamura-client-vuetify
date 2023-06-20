import { initSocket, useSocket } from '@/composables';
import { KEYS } from '@/constants';

const options = {
  key: KEYS.SOCKET_DASHBOARD,
  namespace: '/dashboard',
};

export function initSocketDashboard() {
  return initSocket(options);
}

export function useSocketDashboard() {
  return useSocket(options);
}
