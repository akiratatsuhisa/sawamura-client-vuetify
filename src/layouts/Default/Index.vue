<template>
  <v-app>
    <router-view name="leftOuter" />

    <router-view name="top" />

    <router-view name="left" />

    <router-view name="topInner" />

    <router-view />

    <router-view name="bottom" />
  </v-app>
</template>

<script lang="ts" setup>
import { initSocketChat, initSocketNotifications } from '@/composables';

initSocketChat();
initSocketNotifications();
</script>
