<template>
  <v-navigation-drawer
    v-model="drawer"
    location="right"
    :width="$vuetify.display.smAndDown ? $vuetify.display.width : '320'"
  >
    <v-toolbar color="surface" v-if="$vuetify.display.smAndDown">
      <v-app-bar-nav-icon icon="mdi-arrow-left" @click="drawer = !drawer">
      </v-app-bar-nav-icon>
    </v-toolbar>
    <v-sheet class="pa-4 text-center">
      <v-avatar
        image="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        size="80"
      ></v-avatar>
      <h3>{{ room?.name }}</h3>
    </v-sheet>

    <v-expansion-panels multiple>
      <v-expansion-panel elevation="0" rounded="0">
        <v-expansion-panel-title>Basics Information</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list class="mx-md-n6">
            <v-list-item @click="dialogs.updateRoom = true">
              <template #prepend>
                <v-avatar
                  :color="
                    $vuetify.theme.current.dark
                      ? 'grey-darken-3'
                      : 'grey-lighten-3'
                  "
                >
                  <v-icon icon="mdi-pencil"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Edit name </v-list-item-title>
            </v-list-item>
            <v-list-item
              v-if="room?.isGroup && currentMember?.role === 'Admin'"
              @click="dialogs.deleteRoom = true"
            >
              <template #prepend>
                <v-avatar
                  :color="
                    $vuetify.theme.current.dark
                      ? 'grey-darken-3'
                      : 'grey-lighten-3'
                  "
                >
                  <v-icon icon="mdi-trash-can"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Delete chat </v-list-item-title>
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
                () => {
                  dialogs.deleteMember = true;
                  dialogs.memberId = identityId ?? '';
                }
              "
            >
              <template #prepend>
                <v-avatar
                  :color="
                    $vuetify.theme.current.dark
                      ? 'grey-darken-3'
                      : 'grey-lighten-3'
                  "
                >
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
              @click="dialogs.createMember = true"
            >
              <template #prepend>
                <v-avatar
                  :color="
                    $vuetify.theme.current.dark
                      ? 'grey-darken-3'
                      : 'grey-lighten-3'
                  "
                >
                  <v-icon icon="mdi-account-plus"></v-icon>
                </v-avatar>
              </template>

              <v-list-item-title> Add Member </v-list-item-title>
            </v-list-item>

            <v-list-item
              v-for="(roomMember, index) in roomMembers"
              :key="roomMember.id"
            >
              <template #prepend>
                <v-avatar
                  tag="button"
                  :image="`https://i.pravatar.cc/150?img=${index}`"
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
                  <v-list>
                    <v-list-item
                      append-icon="mdi-account-edit-outline"
                      title="Change nickname"
                      @click="
                        () => {
                          dialogs.updateMember = true;
                          dialogs.memberId = roomMember.member.id;
                        }
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
                        () => {
                          dialogs.updateMemberRole = true;
                          dialogs.memberId = roomMember.member.id;
                        }
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
                        () => {
                          dialogs.deleteMember = true;
                          dialogs.memberId = roomMember.member.id;
                        }
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

  <v-dialog-update-room
    v-model="dialogs.updateRoom"
    @submit="requestUpdateRoom"
  />
  <v-dialog-delete-room
    v-model="dialogs.deleteRoom"
    @submit="requestDeleteRoom"
  />
  <v-dialog-create-member
    v-model="dialogs.createMember"
    @submit="requestCreateMember"
  />
  <v-dialog-update-member
    v-model="dialogs.updateMember"
    :member-id="dialogs.memberId"
    @submit="requestUpdateMember"
  />
  <v-dialog-update-member-role
    v-if="room?.isGroup"
    v-model="dialogs.updateMemberRole"
    :member-id="dialogs.memberId"
    @submit="requestUpdateMember"
  />
  <v-dialog-delete-member
    v-model="dialogs.deleteMember"
    :member-id="dialogs.memberId"
    @submit="requestDeleteMember"
  />
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, inject, reactive } from 'vue';
import { useRouter } from 'vue-router';

import VDialogCreateMember from '@/components/Rooms/Dialogs/DialogCreateMember.vue';
import VDialogDeleteMember from '@/components/Rooms/Dialogs/DialogDeleteMember.vue';
import VDialogDeleteRoom from '@/components/Rooms/Dialogs/DialogDeleteRoom.vue';
import VDialogUpdateMember from '@/components/Rooms/Dialogs/DialogUpdateMember.vue';
import VDialogUpdateMemberRole from '@/components/Rooms/Dialogs/DialogUpdateMemberRole.vue';
import VDialogUpdateRoom from '@/components/Rooms/Dialogs/DialogUpdateRoom.vue';
import { useAuth } from '@/composables/useAuth';
import { useSocketChat } from '@/composables/useSocketChat';
import { useSocketEventListener } from '@/composables/useSocketEventListener';
import { KEYS } from '@/constants';
import {
  ICreateRoomMemberRequest,
  IDeleteRoomMemberRequest,
  IDeleteRoomRequest,
  IRoomResponse,
  IUpdateRoomMemberRequest,
  IUpdateRoomRequest,
} from '@/interfaces/rooms';

const { identityId } = useAuth();
const router = useRouter();

const socket = useSocketChat();

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

const room = inject(KEYS.CHAT.ROOM)!;

const roomMembers = computed(() =>
  _.filter(
    room.value?.roomMembers ?? [],
    (roomMember) => roomMember.role !== 'None',
  ),
);

const currentMember = inject(KEYS.CHAT.CURRENT_MEMBER)!;

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

const dialogs = reactive({
  updateRoom: false,
  deleteRoom: false,
  createMember: false,
  memberId: '',
  updateMember: false,
  updateMemberRole: false,
  deleteMember: false,
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

        console.error(error);
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

        console.error(error);
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

        console.error(error);
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

        console.error(error);
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

        console.error(error);
      },
    },
  );

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
