import { RouteRecordRaw } from 'vue-router';

export default {
  path: '/oauth',
  component: () => import('@/layouts/Auth/Index.vue'),
  children: [
    {
      path: ':provider(github|google)',
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
