import { RouteRecordRaw } from 'vue-router';

import { Router } from '@/helpers';
import VLeftAppBar from '@/layouts/Default/LeftAppBar.vue';
import VUsers from '@/views/Users/Index.vue';
import VRelationshipsTopAppBar from '@/views/Users/layouts/RelationshipsTopAppBar.vue';
import VUsersTopAppBar from '@/views/Users/layouts/UsersTopAppBar.vue';

export default [
  {
    path: '/users/:username',
    alias: '/u/:username',
    name: 'Users:Detail',
    meta: { requiresAuth: true },
    components: {
      left: VLeftAppBar,
      top: VUsersTopAppBar,
      default: VUsers,
    },
    beforeEnter(to, from) {
      Router.setBackRoute(to, from);
    },
  },
  {
    path: '/users/:username/:tab(following|followers|followers-you-follow)',
    name: 'Users:Detail:Relationship',
    meta: { requiresAuth: true },
    components: {
      left: VLeftAppBar,
      top: VRelationshipsTopAppBar,
      default: () => import('@/views/Users/Relationships.vue'),
    },
  },
] as Array<RouteRecordRaw>;
