<template>
  <v-main>
    <v-container class="fill-height">
      <v-row>
        <v-col class="mx-auto" md="8" lg="10">
          <v-card rounded="xl">
            <div class="d-flex flex-column flex-sm-row">
              <v-card-title tag="h1">Messages</v-card-title>
              <v-spacer></v-spacer>
              <v-btn
                class="ma-4"
                prepend-icon="mdi-account-group"
                @click="openDialog('create')"
                :loading="isLoading"
              >
                Create Group
              </v-btn>
            </div>

            <v-list lines="one">
              <v-list-subheader tag="h2">Rooms</v-list-subheader>

              <template v-for="room in rooms" :key="room.id">
                <v-room-item :room="room" />

                <v-divider inset></v-divider>
              </template>
            </v-list>

            <v-card-actions class="justify-center">
              <v-btn @click="fetchMore" :loading="isLoading">
                Fetch more
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>

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
import { useThrottleFn } from '@vueuse/core';
import _ from 'lodash';
import { computed, defineAsyncComponent, inject, ref } from 'vue';

import {
  useRouterDialog,
  useSnackbar,
  useSocketChat,
  useSocketEventListener,
} from '@/composables';
import { KEYS } from '@/constants';
import {
  ICreateRoomRequest,
  IRoomResponse,
  ISearchRoomsRequest,
} from '@/interfaces';
import VRoomItem from '@/views/Messages/RoomItem.vue';

const { createSnackbarError } = useSnackbar();

const socket = useSocketChat();

const updateDrawerRooms = inject(KEYS.DRAWER.UPDATE_ROOMS)!;

const rooms = ref<Array<IRoomResponse>>([]);

const { request: requestRooms, isLoading: isLoadingRooms } =
  useSocketEventListener<{ rooms: Array<IRoomResponse> }, ISearchRoomsRequest>(
    socket,
    'list:room',
    {
      response({ rooms: data }) {
        rooms.value = _.uniqBy([...rooms.value, ...data], (room) => room.id);
        updateDrawerRooms(rooms.value);
      },
      exception(error) {
        createSnackbarError(error.message);
      },
      immediate: true,
      paramsOrData: { take: 20 },
    },
  );

const requestRoomsThrottle = useThrottleFn(requestRooms, 500);

function fetchMore() {
  const excludeIds = _.map(rooms.value, (room) => room.id);

  requestRoomsThrottle({
    take: 10,
    excludeIds: excludeIds.length ? excludeIds : undefined,
  });
}

function handleCreateRoom(data: IRoomResponse) {
  rooms.value.unshift(data);
}

const { request: requestCreateRoom, isLoading: isLoadingCreateRoom } =
  useSocketEventListener<IRoomResponse, ICreateRoomRequest>(
    socket,
    'create:room',
    {
      response: handleCreateRoom,
      listener: handleCreateRoom,
      exception(error) {
        createSnackbarError(error.message);
      },
    },
  );

const { isActiveDialog, openDialog, closeDialog } = useRouterDialog({
  name: 'Messages',
  param: 'dialog',
});

const dialogs = {
  create: {
    component: defineAsyncComponent(
      () => import('@/components/Rooms/Dialogs/DialogCreateRoomGroup.vue'),
    ),
    onSubmit: requestCreateRoom,
  },
};

const isLoading = computed(
  () => isLoadingRooms.value || isLoadingCreateRoom.value,
);
</script>
