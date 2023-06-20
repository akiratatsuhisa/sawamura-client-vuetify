<template>
  <v-app>
    <v-topbar />

    <v-sidebar />

    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import { provide, ref } from 'vue';

import { initSocketChat, initSocketNotifications } from '@/composables';
import { KEYS } from '@/constants';
import { IRoomResponse } from '@/interfaces';
import VSidebar from '@/layouts/Default/Sidebar.vue';
import VTopbar from '@/layouts/Default/Topbar.vue';

const drawer = ref<boolean | null>(null);
provide(KEYS.DRAWER.SHOW, drawer);

const drawerRooms = useLocalStorage<Array<IRoomResponse>>('drawer:rooms', []);
provide(KEYS.DRAWER.ROOMS, drawerRooms);
provide(KEYS.DRAWER.UPDATE_ROOMS, (data) => {
  drawerRooms.value = data;
});

initSocketChat();
initSocketNotifications();
</script>
