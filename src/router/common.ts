import { RouteRecordRaw } from 'vue-router';

import VBottomAppBar from '@/layouts/Default/BottomAppBar.vue';
import VLeftAppBar from '@/layouts/Default/LeftAppBar.vue';
import VTopAppBar from '@/layouts/Default/TopAppBar.vue';
import AccessDenied from '@/views/Errors/AccessDenied.vue';
import InternalServer from '@/views/Errors/InternalServer.vue';
import NotFound from '@/views/Errors/NotFound.vue';

export const defaultCommonRoutes = [
  {
    path: '/access-denied',
    name: 'AccessDenied',
    meta: { requiresAuth: true },
    components: {
      left: VLeftAppBar,
      top: VTopAppBar,
      bottom: VBottomAppBar,
      default: AccessDenied,
    },
  },
  {
    path: '/internal-server',
    name: 'InternalServer',
    meta: { requiresAuth: true },
    components: {
      left: VLeftAppBar,
      top: VTopAppBar,
      bottom: VBottomAppBar,
      default: InternalServer,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { requiresAuth: true },
    components: {
      left: VLeftAppBar,
      top: VTopAppBar,
      bottom: VBottomAppBar,
      default: NotFound,
    },
  },
] as Array<RouteRecordRaw>;
