import { KEYS } from '@/constants';

import { initSocket, useSocket } from './useSocket';

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
