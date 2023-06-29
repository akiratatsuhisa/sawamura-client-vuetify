import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { useAuth } from '@/composables';

import authRoutes, { defaultAuthRoutes } from './auth';
import { defaultCommonRoutes } from './common';
import dashboardRoutes from './dashboard';
import messagesRoutes from './messages';
import oauthRoutes from './oauth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/Default/Index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        meta: { requiresAuth: true },
        component: () => import('@/views/Home.vue'),
      },
      messagesRoutes,
      dashboardRoutes,
      ...defaultAuthRoutes,
      {
        path: 'users/:id',
        name: 'Users:Detail',
        meta: { requiresAuth: true },
        component: () => import('@/views/Users/Detail.vue'),
      },
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
      name: 'Login',
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
