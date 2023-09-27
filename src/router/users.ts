import { Regex } from '@akiratatsuhisa/sawamura-utils';
import { RouteRecordRaw } from 'vue-router';

import { Router } from '@/helpers';
import VLeftAppBar from '@/layouts/Default/LeftAppBar.vue';
import VUsers from '@/views/Users/Index.vue';
import VRelationshipsTopAppBar from '@/views/Users/layouts/RelationshipsTopAppBar.vue';
import VUsersTopAppBar from '@/views/Users/layouts/UsersTopAppBar.vue';
import VStatus from '@/views/Users/Status/Index.vue';
import VStatusTopAppBar from '@/views/Users/Status/layouts/StatusTopAppBar.vue';

export default [
  {
    path: `/users/:username(${Regex.Url.USERNAME.source})`,
    alias: `/u/:username(${Regex.Url.USERNAME.source})`,
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
    path: `/users/:username(${Regex.Url.USERNAME.source})/:tab(following|followers|followers-you-follow)`,
    name: 'Users:Detail:Relationship',
    meta: { requiresAuth: true },
    components: {
      left: VLeftAppBar,
      top: VRelationshipsTopAppBar,
      default: () => import('@/views/Users/Relationships.vue'),
    },
  },
  {
    path: `/users/:username(${Regex.Url.USERNAME.source})/status/:id(\\d{1,18})`,
    alias: [
      `/users/:username(${Regex.Url.USERNAME.source})/s/:id(\\d{1,18})`,
      `/u/:username(${Regex.Url.USERNAME.source})/status/:id(\\d{1,18})`,
      `/u/:username(${Regex.Url.USERNAME.source})/s/:id(\\d{1,18})`,
    ],
    name: 'Users:Status',
    meta: { requiresAuth: true },
    components: {
      left: VLeftAppBar,
      top: VStatusTopAppBar,
      default: VStatus,
    },
  },
] as Array<RouteRecordRaw>;
