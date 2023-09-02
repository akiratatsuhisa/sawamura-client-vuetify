import { RouteRecordRaw } from 'vue-router';

import { Regex } from '@/helpers';

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
  component: () => import('@/views/Dashboard/Index.vue'),
  children: [
    {
      path: `/dashboard/users/:id(${Regex.Uuid.source})?/:dialog(changeRoles)?`,
      name: 'Dashboard:Users',
      meta: {
        breadcrumb: {
          title: 'users',
          to: { name: 'Dashboard:Users' },
        },
      },
      beforeEnter: (to) => {
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
      component: () => import('@/views/Dashboard/Users.vue'),
      children: [
        {
          path: `/dashboard/users/roles/:dialog(create|update|delete)?/:id(${Regex.Uuid.source})?`,
          name: 'Dashboard:Users:Roles',
          meta: {
            breadcrumb: {
              title: 'roles',
              to: { name: 'Dashboard:Users:Roles' },
            },
          },
          beforeEnter: (to) => {
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
      component: () => import('@/views/Dashboard/Messages.vue'),
    },
  ],
} as RouteRecordRaw;
