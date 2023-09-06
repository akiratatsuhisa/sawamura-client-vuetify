<template>
  <v-main>
    <v-container class="fill-height">
      <v-row>
        <v-col class="mx-auto" cols="12" lg="10">
          <v-card rounded="xl" min-height="480">
            <div class="d-flex flex-column flex-sm-row align-md-center">
              <v-card-title tag="h1">{{ translate('title') }}</v-card-title>
              <v-spacer v-if="$vuetify.display.smAndDown" />
              <v-room-list-search />
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
                {{ translateShared('fetchMore') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-fade-transition>
      <v-btn
        v-if="$vuetify.display.smAndDown && isFabShow"
        position="fixed"
        location="bottom right"
        color="primary-container"
        elevation="3"
        :min-width="isFabShowDetail ? undefined : 56"
        min-height="56"
        class="v-btn--fab ma-3"
        @click="openDialog('create')"
      >
        <v-slide-x-reverse-transition>
          <v-icon :start="isFabShowDetail">mdi-account-group</v-icon>
        </v-slide-x-reverse-transition>

        <v-slide-x-transition>
          <span v-if="isFabShowDetail">
            {{ translate('createGroup') }}
          </span>
        </v-slide-x-transition>
      </v-btn>
    </v-fade-transition>
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
import { storeToRefs } from 'pinia';
import { computed, defineAsyncComponent } from 'vue';

import {
  usePageLocale,
  useRouterDialog,
  useSnackbar,
  useSocketChat,
  useSocketEventListener,
} from '@/composables';
import { useScrollBehavior } from '@/composables/useBehavior';
import { ICreateRoomRequest, IRoomResponse } from '@/interfaces';
import { useRoomsStore } from '@/store';
import VRoomListItem from '@/views/Messages/RoomListItem.vue';
import VRoomListSearch from '@/views/Messages/RoomListSearch.vue';

const { translate, translateShared } = usePageLocale({
  prefix: 'messages.list',
});

const { isFabShow, isFabShowDetail } = useScrollBehavior();

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

<style lang="scss" scoped>
.v-btn--fab {
  border-radius: 16px !important;
}
</style>
