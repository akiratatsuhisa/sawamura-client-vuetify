<template>
  <v-dialog-create-room-group
    v-model="dialogCreateRoom"
    @submit="requestCreateRoom"
  >
  </v-dialog-create-room-group>

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
                @click="dialogCreateRoom = true"
                :loading="isLoading"
              >
                Create Group
              </v-btn>
            </div>

            <v-list lines="one">
              <v-list-subheader tag="h2">Rooms</v-list-subheader>

              <template v-for="room in rooms" :key="room.id">
                <v-list-item>
                  <template #prepend>
                    <v-avatar
                      color="primary"
                      class="elevation-6"
                      :image="getPhotoUrlByRoom(room)"
                    ></v-avatar>
                  </template>
                  <v-list-item-title>
                    <v-icon
                      :color="room.isGroup ? 'info' : 'warning'"
                      size="16"
                      :icon="
                        room.isGroup ? 'mdi-account-group' : 'mdi-account-key'
                      "
                    ></v-icon>
                    {{ room.name }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    {{ room.isGroup ? 'Group' : 'Private' }}
                  </v-list-item-subtitle>

                  <template #append>
                    <v-btn
                      color="grey-lighten-1"
                      icon="mdi-login-variant"
                      variant="text"
                      :to="{
                        name: 'Messages:Room',
                        params: { roomId: room.id },
                      }"
                    ></v-btn>
                  </template>
                </v-list-item>

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
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed, inject, ref } from 'vue';

import VDialogCreateRoomGroup from '@/components/Rooms/Dialogs/DialogCreateRoomGroup.vue';
import { useSocketChat } from '@/composables/useSocketChat';
import { useSocketEventListener } from '@/composables/useSocketEventListener';
import { KEYS } from '@/constants';
import {
  ICreateRoomRequest,
  IRoomResponse,
  ISearchRoomsRequest,
} from '@/interfaces/rooms';

const updateDrawerRooms = inject(KEYS.DRAWER.UPDATE_ROOMS)!;

const rooms = ref<Array<IRoomResponse>>([]);
const socket = useSocketChat();

function getPhotoUrlByRoom(room: IRoomResponse) {
  return room.photoUrl
    ? `${import.meta.env.VITE_API_URL}/rooms/${room.id}/photo`
    : import.meta.env.VITE_NO_BACKGROUND_URL;
}

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
        console.error(error);
      },
    },
  );

requestRooms({
  take: 20,
});

const throttleRequestRooms = _.throttle(requestRooms, 500);

function fetchMore() {
  const excludeIds = _.map(rooms.value, (room) => room.id);

  throttleRequestRooms({
    take: 10,
    excludeIds: excludeIds.length ? excludeIds : undefined,
  });
}

const dialogCreateRoom = ref(false);

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
        console.error(error);
      },
    },
  );

const isLoading = computed(
  () => isLoadingRooms.value || isLoadingCreateRoom.value,
);
</script>
