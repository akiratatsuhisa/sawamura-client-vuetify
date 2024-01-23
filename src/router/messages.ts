import { Regex } from '@akiratatsuhisa/sawamura-utils';
import _ from 'lodash';
import { RouteRecordRaw } from 'vue-router';

import VBottomAppBar from '@/layouts/Default/BottomAppBar.vue';
import VLeftAppBar from '@/layouts/Default/LeftAppBar.vue';
import VRoomDetailLeftAppBar from '@/views/Messages/layouts/RoomDetailLeftAppBar.vue';
import VRoomDetailLeftInnerAppBar from '@/views/Messages/layouts/RoomDetailLeftInnerAppBar.vue';
import VRoomDetailTopAppBar from '@/views/Messages/layouts/RoomDetailTopAppBar.vue';
import VRoomsTopAppBar from '@/views/Messages/layouts/RoomsTopAppBar.vue';

export default [
  {
    path: 'messages/:dialog(create)?',
    name: 'Messages',
    meta: { requiresAuth: true },
    components: {
      left: VLeftAppBar,
      top: VRoomsTopAppBar,
      bottom: VBottomAppBar,
      default: () => import('@/views/Messages/Index.vue'),
    },
  },
  {
    path: `/messages/:roomId(${Regex.Url.UUID.source})/:dialog(update|photo|cover|theme|delete|icon|members)?/:memberDialog(create|update|role|delete)?/:memberId(${Regex.Url.UUID.source})?`,
    name: 'Messages:Room',
    meta: { requiresAuth: true },
    components: {
      left: VRoomDetailLeftAppBar,
      top: VRoomDetailTopAppBar,
      leftInner: VRoomDetailLeftInnerAppBar,
      default: () => import('@/views/Messages/Detail/Index.vue'),
    },
    beforeEnter(to) {
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
