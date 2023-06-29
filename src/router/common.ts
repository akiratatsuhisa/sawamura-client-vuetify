import { RouteRecordRaw } from 'vue-router';

import AccessDenied from '@/views/Errors/AccessDenied.vue';
import InternalServer from '@/views/Errors/InternalServer.vue';
import NotFound from '@/views/Errors/NotFound.vue';

export const defaultCommonRoutes = [
  {
    path: '/access-denied',
    name: 'AccessDenied',
    meta: { requiresAuth: true },
    component: AccessDenied,
  },
  {
    path: '/internal-server',
    name: 'InternalServer',
    meta: { requiresAuth: true },
    component: InternalServer,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { requiresAuth: true },
    component: NotFound,
  },
] as Array<RouteRecordRaw>;
