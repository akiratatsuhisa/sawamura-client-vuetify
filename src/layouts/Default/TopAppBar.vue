<template>
  <v-app-bar elevation="1" class="bg-surface-container text-on-surface">
    <v-app-bar-nav-icon
      v-if="subNavigationItems.length"
      @click="drawer = !drawer"
    >
      <v-fab-transition mode="out-in">
        <v-icon icon="mdi-menu-open" v-if="drawer"></v-icon>
        <v-icon icon="mdi-menu" v-else></v-icon>
      </v-fab-transition>
    </v-app-bar-nav-icon>

    <v-app-bar-title @click="$router.push({ name: 'Home' })">
      {{ $t('common.app.title') }}
    </v-app-bar-title>

    <v-notifications-menu />

    <v-messages-menu />

    <v-profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import VMessagesMenu from '@/layouts/Default/MessagesMenu.vue';
import VNotificationsMenu from '@/layouts/Default/NotificationsMenu.vue';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';
import { useAppStore } from '@/store';

const appStore = useAppStore();
const { drawer, subNavigationItems } = storeToRefs(appStore);
</script>
