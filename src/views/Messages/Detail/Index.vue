<template>
  <v-info-sidebar v-model:drawer="drawer" :loading="isLoading" />

  <v-main class="fill-height">
    <div class="d-flex flex-column h-100">
      <v-toolbar tag="h2" color="surface">
        <v-btn
          v-if="$vuetify.display.smAndDown"
          color="primary"
          icon="mdi-arrow-left"
          @click="$router.back()"
        />

        <v-badge
          location="bottom end"
          :color="room?.isGroup ? 'tertiary' : 'secondary'"
          :icon="room?.isGroup ? 'mdi-account-group' : 'mdi-account-key'"
        >
          <v-avatar
            :image="roomPhotoUrl"
            color="secondary-container"
            class="elevation-2 ml-md-3"
          />
        </v-badge>

        <v-toolbar-title>{{ displayName }}</v-toolbar-title>
        <v-base-loading v-if="$vuetify.display.smAndDown" />

        <v-btn
          color="primary"
          icon="mdi-information"
          @click="drawer = !drawer"
        />
      </v-toolbar>

      <v-divider />

      <v-main-content />
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { SOCKET_EVENTS } from '@akiratatsuhisa/sawamura-utils';
import { useLocalStorage } from '@vueuse/core';
import { computed, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';

import {
  useRoom,
  useSocketChat,
  useSocketEventListener,
  useThemeStyle,
} from '@/composables';
import { KEYS } from '@/constants';
import { IRoomRequest, IRoomResponse } from '@/interfaces';
import VInfoSidebar from '@/views/Messages/Detail/components/InfoSidebar.vue';
import VMainContent from '@/views/Messages/Detail/components/MainContent.vue';

const display = useDisplay();

const socket = useSocketChat();

const router = useRouter();
const route = useRoute();

const roomId = computed<string>(() => route.params.roomId as string);

const drawerRooms = useLocalStorage<Record<string, boolean>>(
  'messages:room:drawer',
  {},
);

const drawer = computed<boolean>({
  get() {
    return drawerRooms.value[roomId.value];
  },
  set(value) {
    drawerRooms.value[roomId.value] = value;
  },
});

const iconRooms = useLocalStorage<Record<string, string>>(
  'messages:room:icon',
  {},
);

const reactionIcon = computed<string>({
  get() {
    return iconRooms.value[roomId.value];
  },
  set(value) {
    iconRooms.value[roomId.value] = value;
  },
});

provide(KEYS.CHAT.REACTION_ICON, reactionIcon);

watch(
  roomId,
  (id, _id, onCleanup) => {
    if (!id) {
      return;
    }

    if (drawer.value === undefined) {
      drawer.value = !display.mobile.value;
    } else if (display.mobile.value) {
      drawer.value = false;
    }

    socket.value.emit('join:room', { id });

    onCleanup(() => {
      socket.value.emit('leave:room', { id });
    });
  },
  { immediate: true },
);

const room = ref<IRoomResponse>({
  id: '',
  name: '',
  isGroup: false,
  roomMembers: [],
  photoUrl: null,
  coverUrl: null,
  lastActivatedAt: null,
  createdAt: '',
  themeSource: null,
  themeStyle: null,
  roomMessages: [],
});

const { currentMember, targetMember, roomPhotoUrl, displayName } =
  useRoom(room);

provide(KEYS.CHAT.ROOM, room);

provide(KEYS.CHAT.CURRENT_MEMBER, currentMember);
provide(KEYS.CHAT.TARGET_MEMBER, targetMember);

const { request: requestRoom, isLoading } = useSocketEventListener<
  IRoomResponse,
  IRoomRequest
>(socket, SOCKET_EVENTS.ROOM_EVENTS.READ_ROOM, {
  response(data) {
    room.value = data;
  },
  exception() {
    router.push({ name: 'Messages' });
  },
});

watch(
  roomId,
  (roomId) => {
    if (!roomId) {
      return;
    }

    requestRoom({
      id: roomId,
    });
  },
  { immediate: true },
);

useThemeStyle(computed(() => room.value.themeStyle));
</script>
