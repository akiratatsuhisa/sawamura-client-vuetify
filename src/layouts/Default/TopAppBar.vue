<template>
  <v-app-bar class="bg-surface-container text-on-surface">
    <v-app-bar-nav-icon
      v-if="subNavigationItems.length"
      @click="drawer = !drawer"
    >
      <v-fab-transition mode="out-in">
        <v-icon icon="mdi-menu-open" v-if="drawer" />
        <v-icon icon="mdi-menu" v-else />
      </v-fab-transition>
    </v-app-bar-nav-icon>

    <v-app-bar-title
      class="cursor-pointer prevent-select"
      @click="$router.push({ name: 'Home' })"
    >
      {{ $t('common.app.title') }}
    </v-app-bar-title>
    <v-base-loading />

    <v-messages-menu />

    <v-profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import VMessagesMenu from '@/layouts/Default/components/MessagesMenu.vue';
import VProfileMenu from '@/layouts/Default/components/ProfileMenu.vue';
import { useAppStore } from '@/store';

const appStore = useAppStore();
const { drawer, subNavigationItems } = storeToRefs(appStore);
</script>
