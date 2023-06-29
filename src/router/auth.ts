import { RouteRecordRaw } from 'vue-router';

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
    path: 'profile/:dialog(photo|cover|theme|edit)?',
    name: 'Profile',
    meta: { requiresAuth: true },
    component: () => import('@/views/Auth/Profile.vue'),
  },
  {
    path: 'settings/:tab(email|password|oauth\\-providers)?',
    name: 'Settings',
    meta: { requiresAuth: true },
    component: () => import('@/views/Auth/Settings.vue'),
  },
] as Array<RouteRecordRaw>;
