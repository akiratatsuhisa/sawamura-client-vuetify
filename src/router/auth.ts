import { RouteRecordRaw } from 'vue-router';

import { Router } from '@/helpers';
import VLeftAppBar from '@/layouts/Default/LeftAppBar.vue';
import VSettingsTopAppBar from '@/views/Settings/layouts/SettingsTopAppBar.vue';

export default {
  path: '/',
  component: () => import('@/layouts/Auth/Index.vue'),
  children: [
    {
      path: 'login',
      name: 'Auth:Login',
      component: () => import('@/views/Auth/Login.vue'),
    },
    {
      path: 'register',
      name: 'Auth:Register',
      component: () => import('@/views/Auth/Register.vue'),
    },
    {
      path: 'forgotPassword',
      name: 'Auth:ForgotPassword',
      component: () => import('@/views/Auth/ForgotPassword.vue'),
    },
    {
      path: 'confirmEmail',
      name: 'Auth:ConfirmEmail',
      component: () => import('@/views/Auth/ConfirmEmail.vue'),
    },
    {
      path: 'resetPassword',
      name: 'Auth:ResetPassword',
      component: () => import('@/views/Auth/ResetPassword.vue'),
    },
  ],
} as RouteRecordRaw;

export const defaultAuthRoutes = [
  {
    path: 'settings/:tab(account|display|languages|email|password|oauth\\-providers)?',
    name: 'Settings',
    meta: { requiresAuth: true },
    components: {
      left: VLeftAppBar,
      top: VSettingsTopAppBar,
      default: () => import('@/views/Settings/Index.vue'),
    },
    beforeEnter(to, from) {
      Router.setBackRoute(to, from);
    },
  },
] as Array<RouteRecordRaw>;
