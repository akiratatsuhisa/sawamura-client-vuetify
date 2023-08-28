<template>
  <v-info-sidebar v-model:drawer="drawer" :loading="isLoading" />

  <v-main class="fill-height">
    <div class="d-flex flex-column h-100">
      <v-toolbar color="surface">
        <v-tooltip :text="disyplayLastActivatedAgo" location="bottom left">
          <template v-slot:activator="{ props }">
            <v-app-bar-nav-icon
              :color="room?.isGroup ? 'tertiary' : 'secondary'"
              :icon="room?.isGroup ? 'mdi-account-group' : 'mdi-account-key'"
              v-bind="props"
            >
            </v-app-bar-nav-icon>
          </template>
        </v-tooltip>

        <v-toolbar-title>{{ displayName }}</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-card-subtitle v-if="$vuetify.display.mdAndUp">
          {{ disyplayLastActivatedAgo }}
        </v-card-subtitle>

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
import { useLocalStorage, useStyleTag } from '@vueuse/core';
import { computed, provide, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDisplay } from 'vuetify/lib/framework.mjs';

import VInfoSidebar from '@/components/Rooms/Detail/InfoSidebar.vue';
import VMainContent from '@/components/Rooms/Detail/MainContent.vue';
import {
  usePageLocale,
  useRoom,
  useSocketChat,
  useSocketEventListener,
} from '@/composables';
import { KEYS } from '@/constants';
import { IRoomRequest, IRoomResponse } from '@/interfaces';

const { translate } = usePageLocale({
  prefix: 'messages.room',
});

const display = useDisplay();

const socket = useSocketChat();

const router = useRouter();
const route = useRoute();

const roomId = computed<string>(() => route.params.roomId as string);

const drawerRooms = useLocalStorage<Record<string, boolean>>(
  'list:room:drawer',
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

const iconRooms = useLocalStorage<Record<string, string>>('list:room:icon', {});

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
});

const { currentMember, targetMember, displayName, lastActivatedAgo } =
  useRoom(room);

const disyplayLastActivatedAgo = computed(() => {
  return lastActivatedAgo.value === ''
    ? ''
    : translate('lastActivated', { lastActivated: lastActivatedAgo.value });
});

provide(KEYS.CHAT.ROOM, room);

provide(KEYS.CHAT.CURRENT_MEMBER, currentMember);
provide(KEYS.CHAT.TARGET_MEMBER, targetMember);

const { request: requestRoom, isLoading } = useSocketEventListener<
  IRoomResponse,
  IRoomRequest
>(socket, 'read:room', {
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

useStyleTag(
  computed(() => room.value.themeStyle ?? ''),
  { id: 'vuetify-room-style' },
);
</script>
