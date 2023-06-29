import { RouteRecordRaw } from 'vue-router';

export default {
  path: '/oauth',
  component: () => import('@/layouts/Auth/Index.vue'),
  children: [
    {
      path: 'callback',
      name: 'Oauth:Callback',
      component: () => import('@/views/Oauth/Callback.vue'),
    },
    {
      path: 'error',
      name: 'Oauth:Error',
      component: () => import('@/views/Oauth/Error.vue'),
    },
  ],
} as RouteRecordRaw;
