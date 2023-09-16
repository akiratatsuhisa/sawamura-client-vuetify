import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { useAuth } from '@/composables';
import VBottomAppBar from '@/layouts/Default/BottomAppBar.vue';
import VLeftAppBar from '@/layouts/Default/LeftAppBar.vue';
import VTopAppBar from '@/layouts/Default/TopAppBar.vue';

import authRoutes, { defaultAuthRoutes } from './auth';
import { defaultCommonRoutes } from './common';
import dashboardRoutes from './dashboard';
import messagesRoutes from './messages';
import oauthRoutes from './oauth';
import usersRoutes from './users';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/Default/Index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        meta: { requiresAuth: true },
        components: {
          left: VLeftAppBar,
          top: VTopAppBar,
          bottom: VBottomAppBar,
          default: () => import('@/views/Home/Index.vue'),
        },
      },
      {
        path: 'search',
        name: 'Search',
        meta: { requiresAuth: true },
        components: {
          left: VLeftAppBar,
          top: VTopAppBar,
          bottom: VBottomAppBar,
          default: () => import('@/views/Search/Index.vue'),
        },
      },
      ...messagesRoutes,
      ...usersRoutes,
      dashboardRoutes,
      ...defaultAuthRoutes,
      ...defaultCommonRoutes,
    ],
  },
  authRoutes,
  oauthRoutes,
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from) => {
  const { requiresAuth, requiresRoles } = to.meta;

  const { isAuthenticated, user, getAccessTokenSilently } = useAuth();

  if (requiresAuth || requiresRoles?.length) {
    await getAccessTokenSilently();
  }

  if (requiresAuth && !isAuthenticated.value) {
    return {
      name: 'Auth:Login',
      query: { redirectUrl: to.fullPath },
    };
  }

  if (
    requiresRoles?.length &&
    !user.value?.roles?.some((role) => requiresRoles.includes(role))
  ) {
    return {
      name: 'AccessDenied',
      query: { redirectUrl: from.fullPath },
    };
  }
});

export default router;
