import { Regex } from '@akiratatsuhisa/sawamura-utils';
import { RouteRecordRaw } from 'vue-router';

import VBottomAppBar from '@/layouts/Default/BottomAppBar.vue';
import VLeftAppBar from '@/layouts/Default/LeftAppBar.vue';
import VLeftInnerAppBar from '@/layouts/Default/LeftInnerAppBar.vue';
import VTopAppBar from '@/layouts/Default/TopAppBar.vue';

export default {
  path: 'dashboard',
  name: 'Dashboard',
  meta: {
    requiresAuth: true,
    requiresRoles: ['Administrator'],
    breadcrumb: {
      title: 'dashboard',
      to: { name: 'Dashboard' },
    },
  },
  components: {
    left: VLeftAppBar,
    top: VTopAppBar,
    leftInner: VLeftInnerAppBar,
    bottom: VBottomAppBar,
    default: () => import('@/views/Dashboard/Index.vue'),
  },
  children: [
    {
      path: `/dashboard/users/:id(${Regex.Url.UUID.source})?/:dialog(changeRoles)?`,
      name: 'Dashboard:Users',
      meta: {
        breadcrumb: {
          title: 'users',
          to: { name: 'Dashboard:Users' },
        },
      },
      beforeEnter(to) {
        const dialog = to.params.dialog as string | undefined;
        const id = to.params.id as string | undefined;

        if (!dialog && !id) {
          return true;
        }

        if (dialog === 'changeRoles' && id !== '') {
          return true;
        }

        return { name: to.name };
      },
      component: () => import('@/views/Dashboard/Users/Index.vue'),
      children: [
        {
          path: `/dashboard/users/roles/:dialog(create|update|delete)?/:id(${Regex.Url.UUID.source})?`,
          name: 'Dashboard:Users:Roles',
          meta: {
            breadcrumb: {
              title: 'roles',
              to: { name: 'Dashboard:Users:Roles' },
            },
          },
          beforeEnter(to) {
            const dialog = to.params.dialog as string | undefined;
            const id = to.params.id as string | undefined;

            if (!dialog && !id) {
              return true;
            }

            if (dialog === 'create' && !id) {
              return true;
            }

            if ((dialog === 'update' || dialog === 'delete') && id !== '') {
              return true;
            }

            return { name: to.name };
          },
          component: { template: '' },
        },
      ],
    },
    {
      path: 'messages',
      name: 'Dashboard:Messages',
      meta: {
        breadcrumb: {
          title: 'messages',
          to: { name: 'Dashboard:Messages' },
        },
      },
      component: () => import('@/views/Dashboard/Messages/Index.vue'),
    },
  ],
} as RouteRecordRaw;
