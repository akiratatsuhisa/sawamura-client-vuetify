import _ from 'lodash';
import { RouteRecordRaw } from 'vue-router';

import { Regex } from '@/helpers';
import VBottomAppBar from '@/layouts/Default/BottomAppBar.vue';
import VRoomDetailLeftAppBar from '@/views/Messages/layouts/RoomDetailLeftAppBar.vue';
import VRoomDetailTopAppBar from '@/views/Messages/layouts/RoomDetailTopAppBar.vue';
import VRoomsLeftAppBar from '@/views/Messages/layouts/RoomsLeftAppBar.vue';
import VRoomsTopAppBar from '@/views/Messages/layouts/RoomsTopAppBar.vue';
import VRoomsTopInnerAppBar from '@/views/Messages/layouts/RoomsTopInnerAppBar.vue';

export default [
  {
    path: 'messages/:dialog(create)?',
    name: 'Messages',
    meta: { requiresAuth: true },
    components: {
      top: VRoomsTopAppBar,
      topInner: VRoomsTopInnerAppBar,
      left: VRoomsLeftAppBar,
      bottom: VBottomAppBar,
      default: () => import('@/views/Messages/Index.vue'),
    },
  },
  {
    path: `/messages/:roomId(${Regex.Uuid.source})/:dialog(update|photo|cover|theme|delete|icon|members)?/:memberDialog(create|update|role|delete)?/:memberId(${Regex.Uuid.source})?`,
    name: 'Messages:Room',
    components: {
      top: VRoomDetailTopAppBar,
      left: VRoomDetailLeftAppBar,
      default: () => import('@/views/Messages/Detail/Index.vue'),
    },
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
] as Array<RouteRecordRaw>;
