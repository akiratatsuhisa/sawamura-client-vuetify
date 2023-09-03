import _ from 'lodash';
import { RouteRecordRaw } from 'vue-router';

import { Regex } from '@/helpers';
import VRoomContentSidebar from '@/layouts/Default/Messages/RoomContentSidebar.vue';
import VRoomContentTopbar from '@/layouts/Default/Messages/RoomContentTopbar.vue';
import VRoomsTopbarDesktop from '@/layouts/Default/Messages/RoomsTopbarDesktop.vue';
import VRoomsTopbarMobile from '@/layouts/Default/Messages/RoomsTopbarMobile.vue';
import VSidebar from '@/layouts/Default/Sidebar.vue';

export default [
  {
    path: 'messages/:dialog(create)?',
    name: 'Messages',
    meta: { requiresAuth: true },
    components: {
      topbar: VRoomsTopbarDesktop,
      topbarMobile: VRoomsTopbarMobile,
      sidebar: VSidebar,
      default: () => import('@/views/Messages/RoomList.vue'),
    },
  },
  {
    path: `/messages/:roomId(${Regex.Uuid.source})/:dialog(update|photo|cover|theme|delete|icon|members)?/:memberDialog(create|update|role|delete)?/:memberId(${Regex.Uuid.source})?`,
    name: 'Messages:Room',
    components: {
      topbar: VRoomContentTopbar,
      sidebar: VRoomContentSidebar,
      default: () => import('@/views/Messages/RoomContent.vue'),
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
