// Composables
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import { useAuth } from '@/composables/useAuth';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('@/layouts/default/Index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "home" */ '@/views/Home.vue'),
      },
      {
        path: 'messages',
        children: [
          {
            path: '',
            name: 'Messages',
            meta: { requiresAuth: true },
            component: () =>
              import(
                /* webpackChunkName: "messages" */ '@/views/Messages/Index.vue'
              ),
          },
          {
            path: ':roomId',
            name: 'Messages:Room',
            meta: { requiresAuth: true },
            component: () =>
              import(
                /* webpackChunkName: "messages" */ '@/views/Messages/Room.vue'
              ),
          },
        ],
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        meta: { requiresAuth: true },
        component: () =>
          import(
            /* webpackChunkName: "dashboard" */ '@/views/Dashboard/Index.vue'
          ),
        children: [
          {
            path: 'users',
            name: 'Dashboard:Users',
            meta: { requiresAuth: true },
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ '@/views/Dashboard/Users.vue'
              ),
          },
          {
            path: 'messages',
            name: 'Dashboard:Messages',
            meta: { requiresAuth: true },
            component: () =>
              import(
                /* webpackChunkName: "dashboard" */ '@/views/Dashboard/Messages.vue'
              ),
          },
        ],
      },
      {
        path: 'profile',
        name: 'Profile',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "auth" */ '@/views/Auth/Profile.vue'),
      },
      {
        path: 'profile/photo',
        name: 'Profile:Photo',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "auth" */ '@/views/Auth/Profile.vue'),
      },
      {
        path: 'profile/cover',
        name: 'Profile:Cover',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "auth" */ '@/views/Auth/Profile.vue'),
      },
      {
        path: 'users/:id',
        name: 'Users:Detail',
        meta: { requiresAuth: true },
        component: () =>
          import(/* webpackChunkName: "users" */ '@/views/Users/Detail.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/auth/Index.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () =>
          import(/* webpackChunkName: "auth" */ '@/views/Auth/Login.vue'),
      },
      {
        path: 'register',
        name: 'Register',
        component: () =>
          import(/* webpackChunkName: "auth" */ '@/views/Auth/Register.vue'),
      },
      {
        path: 'forgotPassword',
        name: 'ForgotPassword',
        component: () =>
          import(
            /* webpackChunkName: "auth" */ '@/views/Auth/ForgotPassword.vue'
          ),
      },
      {
        path: 'resetPassword',
        name: 'ResetPassword',
        component: () =>
          import(
            /* webpackChunkName: "auth" */ '@/views/Auth/ResetPassword.vue'
          ),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

const { isAuthenticated } = useAuth();

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return {
      name: 'Login',
      query: { redirectUrl: to.fullPath },
    };
  }
});

export default router;
