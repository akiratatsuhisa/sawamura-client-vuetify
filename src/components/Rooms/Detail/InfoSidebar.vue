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

      <v-divider></v-divider>
    </template>

    <v-expansion-panels multiple>
      <v-expansion-panel elevation="0" rounded="0">
        <v-expansion-panel-title>Basics Information</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list class="mx-md-n6">
            <v-list-item
              v-if="room?.isGroup && currentMember?.role !== 'Member'"
              @click="openDialog('update')"
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-pencil"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Edit name </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="room?.isGroup && currentMember?.role !== 'Member'"
              @click="openDialog('photo')"
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-image-sync"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Change photo </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="currentMember?.role !== 'Member'"
              @click="openDialog('cover')"
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-image-edit"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Change cover </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="currentMember?.role !== 'Member'"
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
                  <v-icon icon="mdi-palette" v-else></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Choose Theme </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="room?.isGroup && currentMember?.role === 'Admin'"
              @click="openDialog('delete')"
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-trash-can"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Delete chat </v-list-item-title>
            </v-list-item>
            <v-list-item @click="openDialog('icon')">
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-hand-okay"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Reaction Icon </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel elevation="0" rounded="0">
        <v-expansion-panel-title>Support</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list class="mx-md-n6">
            <v-list-item
              v-if="room?.isGroup"
              @click="
                openDialog('members', {
                  params: { memberDialog: 'delete', memberId: identityId },
                })
              "
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-logout"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Out group </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
      <v-expansion-panel elevation="0" rounded="0">
        <v-expansion-panel-title>Members</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list class="mx-md-n6">
            <v-list-item
              v-if="room?.isGroup && currentMember?.role !== 'Member'"
              @click="
                openDialog('members', {
                  params: { memberDialog: 'create' },
                })
              "
            >
              <template #prepend>
                <v-avatar color="secondary-container">
                  <v-icon icon="mdi-account-plus"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Add Member </v-list-item-title>
            </v-list-item>

            <v-list-item v-for="roomMember in roomMembers" :key="roomMember.id">
              <template #prepend>
                <v-avatar
                  color="secondary-container"
                  class="elevation-6"
                  tag="button"
                  :image="getPhotoUrlByRoomUser(roomMember.member)"
                  @click="
                    $router.push({
                      name: 'Users:Detail',
                      params: { id: roomMember.id },
                    })
                  "
                >
                </v-avatar>
              </template>

              <v-list-item-title>
                {{ roomMember.nickName ?? roomMember.member.username }}
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ roomMember.role }} - {{ roomMember.member.username }}
              </v-list-item-subtitle>

              <template #append>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn
                      class="align-self-center"
                      icon="mdi-dots-vertical"
                      variant="plain"
                      size="x-small"
                      v-bind="props"
                      :loading="isLoading"
                    ></v-btn>
                  </template>

                  <v-list class="bg-surface-variant text-on-surface-variant">
                    <v-list-item
                      append-icon="mdi-account-edit-outline"
                      title="Change nickname"
                      @click="
                        openDialog('members', {
                          params: {
                            memberDialog: 'update',
                            memberId: roomMember.member.id,
                          },
                        })
                      "
                    />
                    <v-list-item
                      v-if="
                        room?.isGroup &&
                        currentMember?.role !== 'Member' &&
                        !(
                          currentMember?.role === 'Moderator' &&
                          roomMember.role === 'Admin'
                        )
                      "
                      append-icon="mdi-database-edit-outline"
                      title="Change role"
                      @click="
                        openDialog('members', {
                          params: {
                            memberDialog: 'role',
                            memberId: roomMember.member.id,
                          },
                        })
                      "
                    />
                    <v-list-item
                      v-if="
                        room?.isGroup &&
                        currentMember?.role !== 'Member' &&
                        !(
                          currentMember?.role === 'Moderator' &&
                          roomMember.role === 'Admin'
                        )
                      "
                      append-icon="mdi-trash-can-outline"
                      title="Delete"
                      @click="
                        openDialog('members', {
                          params: {
                            memberDialog: 'delete',
                            memberId: roomMember.member.id,
                          },
                        })
                      "
                    />
                  </v-list>
                </v-menu>
              </template>
            </v-list-item>
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
import { computed, defineAsyncComponent, inject } from 'vue';
import { useRouter } from 'vue-router';

import {
  useAuth,
  useDisplayThemeColor,
  useRoom,
  useRouterDialog,
  useSnackbar,
  useSocketChat,
  useSocketEventListener,
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

const displayThemeColor = useDisplayThemeColor(
  computed(() => room.value.themeSource),
);

const reactionIcon = inject(KEYS.CHAT.REACTION_ICON)!;

function onSelectReactionIcon(data: { value: string }) {
  reactionIcon.value = data.value;
}

const {
  roomMembers,
  currentMember,
  displayName,
  roomPhotoUrl,
  updateImage,
  getPhotoUrlByRoomUser,
} = useRoom(room);

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
