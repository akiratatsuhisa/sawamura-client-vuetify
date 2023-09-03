<template>
  <v-main>
    <v-container class="fill-height">
      <v-row>
        <v-col class="mx-auto" cols="12" lg="10">
          <v-card rounded="xl">
            <div class="d-flex flex-column flex-sm-row">
              <v-card-title tag="h1">{{ translate('title') }}</v-card-title>
              <v-spacer></v-spacer>
              <v-btn
                class="ma-4"
                prepend-icon="mdi-account-group"
                @click="openDialog('create')"
                :loading="isLoading"
              >
                {{ translate('createGroup') }}
              </v-btn>
            </div>

            <v-list lines="two">
              <v-list-subheader tag="h2">
                {{ translate('subtitle') }}
              </v-list-subheader>

              <v-room-list-item
                v-for="room in rooms"
                :key="room.id"
                :room="room"
              />
            </v-list>

            <v-card-actions class="justify-center">
              <v-btn @click="fetchMore" :loading="isLoading">
                {{ translate('fetchMore') }}
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
import _ from 'lodash';
import { storeToRefs } from 'pinia';
import { computed, defineAsyncComponent } from 'vue';

import {
  usePageLocale,
  useRouterDialog,
  useSnackbar,
  useSocketChat,
  useSocketEventListener,
} from '@/composables';
import {
  ICreateRoomRequest,
  IRoomMessageResponse,
  IRoomResponse,
} from '@/interfaces';
import { useRoomsStore } from '@/store';
import VRoomListItem from '@/views/Messages/RoomListItem.vue';

const { translate } = usePageLocale({ prefix: 'messages.list' });

const roomsStore = useRoomsStore();

const { rooms, isLoadingRooms } = storeToRefs(roomsStore);
const { fetchMore, updateListRoom } = roomsStore;

const { createSnackbarError } = useSnackbar();
const socket = useSocketChat();

const { request: requestCreateRoom, isLoading: isLoadingCreateRoom } =
  useSocketEventListener<IRoomResponse, ICreateRoomRequest>(
    socket,
    'create:room',
    {
      response: updateListRoom,
      listener: updateListRoom,
      exception(error) {
        createSnackbarError(error.message);
      },
    },
  );
useSocketEventListener<IRoomResponse>(socket, 'update:room:photo', {
  listener: updateListRoom,
});
useSocketEventListener<IRoomResponse>(socket, 'update:room', {
  listener: updateListRoom,
});
useSocketEventListener<IRoomResponse>(socket, 'delete:room', {
  listener: updateListRoom,
});
useSocketEventListener<IRoomMessageResponse>(socket, 'create:message', {
  listener: (data) => updateListRoom(data.room),
});
useSocketEventListener<IRoomMessageResponse>(socket, 'delete:message', {
  listener: (data) => updateListRoom(data.room),
});

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
