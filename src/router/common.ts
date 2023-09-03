import { RouteRecordRaw } from 'vue-router';

import VSidebar from '@/layouts/Default/Sidebar.vue';
import VTopbar from '@/layouts/Default/Topbar.vue';
import AccessDenied from '@/views/Errors/AccessDenied.vue';
import InternalServer from '@/views/Errors/InternalServer.vue';
import NotFound from '@/views/Errors/NotFound.vue';

export const defaultCommonRoutes = [
  {
    path: '/access-denied',
    name: 'AccessDenied',
    meta: { requiresAuth: true },
    components: {
      topbar: VTopbar,
      sidebar: VSidebar,
      default: AccessDenied,
    },
  },
  {
    path: '/internal-server',
    name: 'InternalServer',
    meta: { requiresAuth: true },
    components: {
      topbar: VTopbar,
      sidebar: VSidebar,
      default: InternalServer,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    meta: { requiresAuth: true },
    components: {
      topbar: VTopbar,
      sidebar: VSidebar,
      default: NotFound,
    },
  },
] as Array<RouteRecordRaw>;
