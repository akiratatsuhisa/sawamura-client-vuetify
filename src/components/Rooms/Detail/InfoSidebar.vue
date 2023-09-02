<template>
  <v-navigation-drawer
    v-model="drawer"
    location="right"
    :width="$vuetify.display.smAndDown ? $vuetify.display.width : '320'"
  >
    <template #prepend>
      <v-toolbar color="surface" v-if="$vuetify.display.smAndDown">
        <v-app-bar-nav-icon icon="mdi-arrow-left" @click="drawer = !drawer">
        </v-app-bar-nav-icon>
      </v-toolbar>
      <v-sheet class="pa-4 text-center">
        <v-avatar
          color="secondary-container"
          class="elevation-6"
          :image="roomPhotoUrl"
          size="80"
        ></v-avatar>
        <h3>
          {{ displayName }}
        </h3>
      </v-sheet>

      <v-divider />
    </template>

    <v-expansion-panels multiple>
      <v-expansion-panel elevation="0" rounded="0">
        <v-expansion-panel-title>
          {{ translate('menus.basicsInformation.index') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list density="compact" nav class="mx-n6">
            <v-list-item
              v-if="room?.isGroup && currentMember?.role !== 'Member'"
              rounded="pill"
              @click="openDialog('update')"
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-pencil" />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ translate('menus.basicsInformation.editName') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="room?.isGroup && currentMember?.role !== 'Member'"
              rounded="pill"
              @click="openDialog('photo')"
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-image-sync" />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ translate('menus.basicsInformation.changePhoto') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="currentMember?.role !== 'Member'"
              rounded="pill"
              @click="openDialog('cover')"
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-image-edit" />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ translate('menus.basicsInformation.changeCover') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="isThemeSelectable && currentMember?.role !== 'Member'"
              rounded="pill"
              @click="openDialog('theme')"
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-avatar
                    v-if="room.themeSource"
                    :color="displayThemeColor"
                    size="x-small"
                    class="elevation-4"
                  ></v-avatar>
                  <v-icon icon="mdi-palette" v-else />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ translate('menus.basicsInformation.chooseTheme') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="room?.isGroup && currentMember?.role === 'Administrator'"
              rounded="pill"
              @click="openDialog('delete')"
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-trash-can" />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ translate('menus.basicsInformation.deleteChat') }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item rounded="pill" @click="openDialog('icon')">
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-hand-okay" />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ translate('menus.basicsInformation.reactionIcon') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel elevation="0" rounded="0">
        <v-expansion-panel-title>
          {{ translate('menus.support.index') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list density="compact" nav class="mx-n6">
            <v-list-item
              v-if="room?.isGroup"
              rounded="pill"
              @click="
                openDialog('members', {
                  params: { memberDialog: 'delete', memberId: identityId },
                })
              "
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-logout" />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ translate('menus.support.outGroup') }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel elevation="0" rounded="0">
        <v-expansion-panel-title>
          {{ translate('menus.members.index') }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list density="compact" nav class="mx-n6">
            <v-list-item
              v-if="room?.isGroup && currentMember?.role !== 'Member'"
              rounded="pill"
              @click="
                openDialog('members', {
                  params: { memberDialog: 'create' },
                })
              "
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-account-plus-outline" />
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ translate('menus.members.insertMember') }}
              </v-list-item-title>
            </v-list-item>

            <v-info-sidebar-member-item
              v-for="roomMember in roomMembers"
              :key="roomMember.id"
              :is-group="room.isGroup"
              :is-loading="isLoading"
              :room-member="roomMember"
              @open-dialog="(params) => openDialog('members', { params })"
            />
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-navigation-drawer>

  <template v-for="(dialog, name) in dialogs" :key="name">
    <component
      :is="dialog.component"
      :model-value="isActiveDialog(name)"
      @update:model-value="closeDialog"
      @submit="dialog.onSubmit"
    />
  </template>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, defineAsyncComponent, inject } from 'vue';
import { useRouter } from 'vue-router';

import VInfoSidebarMemberItem from '@/components/Rooms/Detail/InfoSidebarMemberItem.vue';
import {
  useAuth,
  useDisplayThemeColor,
  usePageLocale,
  useRoom,
  useRouterDialog,
  useSnackbar,
  useSocketChat,
  useSocketEventListener,
  useThemeModeStorage,
} from '@/composables';
import { KEYS } from '@/constants';
import {
  ICreateRoomMemberRequest,
  IDeleteRoomMemberRequest,
  IDeleteRoomRequest,
  IRoomResponse,
  IUpdateRoomMemberRequest,
  IUpdateRoomRequest,
} from '@/interfaces';

const props = defineProps<{
  modelValue?: IRoomResponse;
  drawer: boolean;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value?: IRoomResponse): void;
  (event: 'update:drawer', value: boolean): void;
}>();

const { translate } = usePageLocale({
  prefix: 'messages.room',
});

const drawer = computed({
  get() {
    return props.drawer;
  },
  set(value: boolean) {
    emit('update:drawer', value);
  },
});

const { identityId } = useAuth();

const router = useRouter();

const { createSnackbarError } = useSnackbar();

const socket = useSocketChat();

const room = inject(KEYS.CHAT.ROOM)!;

const { isThemeSelectable } = useThemeModeStorage();

const displayThemeColor = useDisplayThemeColor(
  computed(() => room.value.themeSource),
);

const reactionIcon = inject(KEYS.CHAT.REACTION_ICON)!;

function onSelectReactionIcon(data: { value: string }) {
  reactionIcon.value = data.value;
}

const { roomMembers, currentMember, displayName, roomPhotoUrl, updateImage } =
  useRoom(room);

function setRoom(data: IRoomResponse) {
  if (data.id !== room.value?.id) {
    return;
  }
  room.value = data;
}

function handleDeleteRoom(data: IRoomResponse) {
  if (data.id !== room.value?.id) {
    return;
  }

  router.push({ name: 'Messages' });
}

useSocketEventListener<IRoomResponse>(socket, 'update:room:photo', {
  listener(data) {
    if (data.id !== room.value?.id) {
      return;
    }
    room.value = data;
    updateImage('photo');
  },
});

useSocketEventListener<IRoomResponse>(socket, 'update:room:cover', {
  listener(data) {
    if (data.id !== room.value?.id) {
      return;
    }
    room.value = data;
    updateImage('cover');
  },
});

const { request: requestUpdateRoom, isLoading: isLoadingUpdateRoom } =
  useSocketEventListener<IRoomResponse, IUpdateRoomRequest>(
    socket,
    'update:room',
    {
      response: setRoom,
      listener: setRoom,
      exception(error) {
        if (error.data.id !== room.value?.id) {
          return;
        }

        createSnackbarError(error.message);
      },
    },
  );

const { request: requestDeleteRoom, isLoading: isLoadingDeleteRoom } =
  useSocketEventListener<IRoomResponse, IDeleteRoomRequest>(
    socket,
    'delete:room',
    {
      response: handleDeleteRoom,
      listener: handleDeleteRoom,
      exception(error) {
        if (error.data.id !== room.value?.id) {
          return;
        }

        createSnackbarError(error.message);
      },
    },
  );

const { request: requestCreateMember, isLoading: isLoadingCreateMember } =
  useSocketEventListener<IRoomResponse, ICreateRoomMemberRequest>(
    socket,
    'create:member',
    {
      response: setRoom,
      listener: setRoom,
      exception(error) {
        if (error.data.roomId !== room.value?.id) {
          return;
        }

        createSnackbarError(error.message);
      },
    },
  );

const { request: requestUpdateMember, isLoading: isLoadingUpdateMember } =
  useSocketEventListener<IRoomResponse, IUpdateRoomMemberRequest>(
    socket,
    'update:member',
    {
      response: setRoom,
      listener: setRoom,
      exception(error) {
        if (error.data.roomId !== room.value?.id) {
          return;
        }

        createSnackbarError(error.message);
      },
    },
  );

const { request: requestDeleteMember, isLoading: isLoadingDeleteMember } =
  useSocketEventListener<IRoomResponse, IDeleteRoomMemberRequest>(
    socket,
    'delete:member',
    {
      response: setRoom,
      listener: setRoom,
      exception(error) {
        if (error.data.roomId !== room.value?.id) {
          return;
        }

        createSnackbarError(error.message);
      },
    },
  );

const {
  isActiveDialog: originIsActiveDialog,
  openDialog,
  closeDialog,
} = useRouterDialog({
  name: 'Messages:Room',
  defaultParams: computed(() => ({
    roomId: room.value.id,
  })),
  param: 'dialog',
});

const dialogs = {
  update: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogUpdateRoom.vue'),
    ),
    onSubmit: requestUpdateRoom,
  },
  photo: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogUpdateRoomPhoto.vue'),
    ),
    onSubmit: () => undefined,
  },
  cover: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogUpdateRoomCover.vue'),
    ),
    onSubmit: () => undefined,
  },
  theme: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogUpdateRoomTheme.vue'),
    ),
    onSubmit: () => undefined,
  },
  delete: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogDeleteRoom.vue'),
    ),
    onSubmit: requestDeleteRoom,
  },
  icon: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogSelectReactionIcon.vue'),
    ),
    onSubmit: onSelectReactionIcon,
  },
  createMember: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogCreateMember.vue'),
    ),
    onSubmit: requestCreateMember,
  },
  updateMember: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogUpdateMember.vue'),
    ),
    onSubmit: requestUpdateMember,
  },
  updateMemberRole: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogUpdateMemberRole.vue'),
    ),
    onSubmit: requestUpdateMember,
  },
  deleteMember: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogDeleteMember.vue'),
    ),
    onSubmit: requestDeleteMember,
  },
};

function isActiveDialog(name: keyof typeof dialogs) {
  function isMemberDialog(memberDialog: string) {
    return originIsActiveDialog(
      ({ params }) =>
        params?.dialog === 'members' && params?.memberDialog === memberDialog,
    );
  }

  switch (name) {
    case 'createMember':
      return isMemberDialog('create');
    case 'updateMember':
      return isMemberDialog('update');
    case 'updateMemberRole':
      return isMemberDialog('role');
    case 'deleteMember':
      return isMemberDialog('delete');
    default:
      return originIsActiveDialog(name);
  }
}

const isLoading = computed(
  () =>
    props.loading ||
    isLoadingUpdateRoom.value ||
    isLoadingDeleteRoom.value ||
    isLoadingCreateMember.value ||
    isLoadingUpdateMember.value ||
    isLoadingDeleteMember.value,
);
</script>
