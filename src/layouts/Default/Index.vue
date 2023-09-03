<template>
  <v-app>
    <router-view name="topbar" />

    <router-view name="sidebar" />

    <router-view name="topbarMobile" />

    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import { provide, ref } from 'vue';

import { initSocketChat, initSocketNotifications } from '@/composables';
import { KEYS } from '@/constants';

const drawer = ref<boolean | null>(null);
provide(KEYS.DRAWER.SHOW, drawer);

initSocketChat();
initSocketNotifications();
</script>
