<template>
  <v-app>
    <topbar></topbar>

    <sidebar></sidebar>

    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import { provide, readonly, ref } from 'vue';

import { initSocketChat } from '@/composables/useSocketChat';
import { initSocketNotifications } from '@/composables/useSocketNotifications';
import { KEYS } from '@/constants';
import { IRoomResponse } from '@/interfaces/rooms';

import Sidebar from './Sidebar.vue';
import Topbar from './Topbar.vue';

const drawer = ref<boolean | null>(null);
provide(KEYS.DRAWER.SHOW, drawer);

const drawerRooms = useLocalStorage<Array<IRoomResponse>>('drawer:rooms', []);
provide(KEYS.DRAWER.ROOMS, readonly(drawerRooms));
provide(KEYS.DRAWER.UPDATE_ROOMS, (data) => {
  drawerRooms.value = data;
});

initSocketChat();
initSocketNotifications();
</script>
