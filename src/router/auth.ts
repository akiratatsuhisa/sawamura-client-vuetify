import { RouteRecordRaw } from 'vue-router';

import VSidebar from '@/layouts/Default/Sidebar.vue';
import VTopbar from '@/layouts/Default/Topbar.vue';

export default {
  path: '/',
  component: () => import('@/layouts/Auth/Index.vue'),
  children: [
    {
      path: 'login',
      name: 'Login',
      component: () => import('@/views/Auth/Login.vue'),
    },
    {
      path: 'register',
      name: 'Register',
      component: () => import('@/views/Auth/Register.vue'),
    },
    {
      path: 'forgotPassword',
      name: 'ForgotPassword',
      component: () => import('@/views/Auth/ForgotPassword.vue'),
    },
    {
      path: 'confirmEmail',
      name: 'ConfirmEmail',
      component: () => import('@/views/Auth/ConfirmEmail.vue'),
    },
    {
      path: 'resetPassword',
      name: 'ResetPassword',
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
      topbar: VTopbar,
      sidebar: VSidebar,
      default: () => import('@/views/Settings.vue'),
    },
  },
] as Array<RouteRecordRaw>;
