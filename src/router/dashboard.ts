import { RouteRecordRaw } from 'vue-router';

import { Regex } from '@/helpers';

export default {
  path: 'dashboard',
  name: 'Dashboard',
  meta: {
    requiresAuth: true,
    requiresRoles: ['Administrator'],
    breadcrumb: {
      title: 'Dashboard',
      to: { name: 'Dashboard' },
    },
  },
  component: () => import('@/views/Dashboard/Index.vue'),
  children: [
    {
      path: 'users',
      name: 'Dashboard:Users',
      meta: {
        breadcrumb: {
          title: 'Users',
          to: { name: 'Dashboard:Users' },
        },
      },
      component: () => import('@/views/Dashboard/Users.vue'),
      children: [
        {
          path: `roles/:dialog(create|update|delete)?/:id(${Regex.Uuid.source})?`,
          name: 'Dashboard:Users:Roles',
          meta: {
            breadcrumb: {
              title: 'Roles',
              to: { name: 'Dashboard:Users:Roles' },
            },
          },
          beforeEnter: (to) => {
            const dialog = to.params.dialog as string | undefined;
            const id = to.params.id as string | undefined;

            // route: /roles
            if (!dialog && !id) {
              return true;
            }

            // route: /roles/create
            if (dialog === 'create' && !id) {
              return true;
            }

            // routes: /roles/update/:id or /roles/delete/:id
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
          title: 'Messages',
          to: { name: 'Dashboard:Messages' },
        },
      },
      component: () => import('@/views/Dashboard/Messages.vue'),
    },
  ],
} as RouteRecordRaw;
