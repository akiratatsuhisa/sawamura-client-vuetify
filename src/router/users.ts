import { RouteRecordRaw } from 'vue-router';

import VSidebar from '@/layouts/Default/Sidebar.vue';
import VTopbar from '@/layouts/Default/Topbar.vue';

export default [
  {
    path: '/users/:username',
    alias: '/u/:username',
    name: 'Users:Page',
    meta: { requiresAuth: true },
    components: {
      topbar: VTopbar,
      sidebar: VSidebar,
      default: () => import('@/views/Users/Page/Index.vue'),
    },
  },
  /**
   * @deprecated
   */
  // {
  //   path: 'profile/:dialog(photo|cover|theme|edit)?',
  //   name: 'Users:Profile',
  //   meta: { requiresAuth: true },
  //   components: {
  //     topbar: VTopbar,
  //     sidebar: VSidebar,
  //     default: () => import('@/views/Users/Profile.vue'),
  //   },
  // },
] as Array<RouteRecordRaw>;