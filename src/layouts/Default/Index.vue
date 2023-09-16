<template>
  <v-app>
    <router-view name="topOuter" />

    <router-view name="left" />

    <router-view name="top" />

    <router-view name="leftInner" />

    <router-view />

    <router-view name="bottom" />
  </v-app>
</template>

<script lang="ts" setup>
import { initSocketChat, initSocketNotifications } from '@/composables';

initSocketChat();
initSocketNotifications();
</script>
