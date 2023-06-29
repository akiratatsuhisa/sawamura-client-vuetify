import _ from 'lodash';
import { RouteRecordRaw } from 'vue-router';

import { Regex } from '@/helpers';

export default {
  path: 'messages',
  meta: { requiresAuth: true },
  children: [
    {
      path: ':dialog(create)?',
      name: 'Messages',
      component: () => import('@/views/Messages/RoomList.vue'),
    },
    {
      path: `:roomId(${Regex.Uuid.source})/:dialog(update|photo|cover|theme|delete|icon|members)?/:memberDialog(create|update|role|delete)?/:memberId(${Regex.Uuid.source})?`,
      name: 'Messages:Room',
      component: () => import('@/views/Messages/RoomContent.vue'),
      beforeEnter: (to) => {
        const dialog = to.params.dialog as string | undefined;
        const memberDialog = to.params.memberDialog as string | undefined;
        const memberId = to.params.memberId as string | undefined;

        if (!dialog && !memberDialog && !memberId) {
          return true;
        }

        const roomDialogNames = [
          'update',
          'photo',
          'cover',
          'theme',
          'delete',
          'icon',
        ];
        if (_.includes(roomDialogNames, dialog) && !memberDialog && !memberId) {
          return true;
        }

        if (dialog === 'members') {
          if (memberDialog === 'create' && !memberId) {
            return true;
          }

          const memberDialogNames = ['update', 'role', 'delete'];
          if (_.includes(memberDialogNames, memberDialog) && memberId !== '') {
            return true;
          }
        }

        return { name: to.name, params: { roomId: to.params.roomId } };
      },
    },
  ],
} as RouteRecordRaw;
