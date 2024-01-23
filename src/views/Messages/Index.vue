<template>
  <v-main class="fill-height bg-surface-container">
    <v-container
      fluid
      class="h-100"
      :class="[$vuetify?.display.smAndDown ? 'pa-0' : 'pa-4']"
    >
      <v-sheet
        class="bg-surface h-100"
        variant="flat"
        :rounded="$vuetify?.display.smAndDown ? '0' : 'lg'"
      >
        <div class="d-flex flex-column flex-md-row align-md-center">
          <v-card-title tag="h1">{{ translate('title') }}</v-card-title>

          <v-spacer v-if="$vuetify.display.smAndDown" />

          <v-room-search v-if="$vuetify.display.mdAndUp" />

          <v-btn
            class="ma-4"
            variant="flat"
            prepend-icon="mdi-account-group"
            @click="openDialog('create')"
            :loading="isLoading"
          >
            {{ translate('createGroup') }}
          </v-btn>
        </div>

        <v-room-list />

        <v-card-actions class="justify-center">
          <v-btn @click="fetchMore" :loading="isLoading">
            {{ translateShared('fetchMore') }}
          </v-btn>
        </v-card-actions>
      </v-sheet>
    </v-container>

    <v-floating-action-button-wrapper>
      <template #default>
        <v-floating-action-button
          :title="translate('createGroup')"
          icon="mdi-account-group"
          :is-fab-show="$vuetify.display.smAndDown && isFabShow"
          :is-fab-show-detail="isFabShowDetail"
          :style="{ bottom: $vuetify.display.xs ? '80px' : '0' }"
          @click="openDialog('create')"
        />
      </template>

      <template #rail>
        <v-floating-action-button
          :title="translate('createGroup')"
          icon="mdi-account-group"
          :is-fab-show="$vuetify.display.mdAndUp && isFabShow"
          @click="openDialog('create')"
          :screen-fab="false"
        />
      </template>
    </v-floating-action-button-wrapper>
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
import { SOCKET_EVENTS } from '@akiratatsuhisa/sawamura-utils';
import { storeToRefs } from 'pinia';
import { computed, defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';

import {
  usePageLocale,
  useRouterDialog,
  useScrollBehavior,
  useSnackbar,
  useSocketChat,
  useSocketEventListener,
} from '@/composables';
import { ICreateRoomRequest, IRoomResponse } from '@/interfaces';
import { useRoomsStore } from '@/store';
import VRoomList from '@/views/Messages/components/RoomList.vue';
import VRoomSearch from '@/views/Messages/components/RoomSearch.vue';

const router = useRouter();

const { translate, translateShared } = usePageLocale({
  prefix: 'messages.list',
});

const roomsStore = useRoomsStore();
const { isLoadingRooms } = storeToRefs(roomsStore);
const { fetchMore, updateListRoom } = roomsStore;

const { createSnackbarByException } = useSnackbar();
const socket = useSocketChat();

const { request: requestCreateRoom, isLoading: isLoadingCreateRoom } =
  useSocketEventListener<IRoomResponse, ICreateRoomRequest>(
    socket,
    SOCKET_EVENTS.ROOM_EVENTS.CREATE_ROOM,
    {
      response: (data) => {
        updateListRoom(data);
        router.push({
          name: 'Messages:Room',
          params: {
            roomId: data.id,
          },
        });
      },
      exception: createSnackbarByException,
    },
  );

const { isActiveDialog, openDialog, closeDialog } = useRouterDialog({
  name: 'Messages',
  param: 'dialog',
});

const dialogs = {
  create: {
    component: defineAsyncComponent(
      () => import('@/views/Messages/components/DialogCreateRoomGroup.vue'),
    ),
    onSubmit: requestCreateRoom,
  },
};

const isLoading = computed(
  () => isLoadingRooms.value || isLoadingCreateRoom.value,
);

const { isFabShow, isFabShowDetail } = useScrollBehavior();
</script>
