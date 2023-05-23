<template>
  <v-app-bar elevation="4">
    <v-app-bar-nav-icon @click="drawer = !drawer">
      <v-fab-transition mode="out-in">
        <v-icon
          icon="mdi-arrow-left"
          v-if="$vuetify.display.smAndDown && drawer"
        ></v-icon>
        <v-icon icon="mdi-menu" v-else></v-icon>
      </v-fab-transition>
    </v-app-bar-nav-icon>

    <v-app-bar-title>Vue App</v-app-bar-title>

    <v-spacer></v-spacer>

    <v-notification-list />

    <v-profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, inject } from 'vue';

import { KEYS } from '@/constants';

const VProfileMenu = defineAsyncComponent(
  () => import('@/layouts/Default/Menus/ProfileMenu.vue'),
);
const VNotificationList = defineAsyncComponent(
  () => import('@/layouts/Default/NotificationList.vue'),
);

const drawer = inject(KEYS.DRAWER.SHOW);
</script>
