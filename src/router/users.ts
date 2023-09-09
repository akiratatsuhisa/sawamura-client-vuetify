import { RouteRecordRaw } from 'vue-router';

import { Router } from '@/helpers';
import VLeftAppBar from '@/layouts/Default/LeftAppBar.vue';
import VRelationshipTopAppBar from '@/views/Users/layouts/RelationshipTopAppBar.vue';
import VUsersTopAppBar from '@/views/Users/layouts/UsersTopAppBar.vue';

export default [
  {
    path: '/users/:username',
    alias: '/u/:username',
    name: 'Users:Detail',
    meta: { requiresAuth: true },
    components: {
      top: VUsersTopAppBar,
      left: VLeftAppBar,
      default: () => import('@/views/Users/Index.vue'),
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
      top: VRelationshipTopAppBar,
      left: VLeftAppBar,
      default: () => import('@/views/Users/Relationship.vue'),
    },
  },
] as Array<RouteRecordRaw>;
