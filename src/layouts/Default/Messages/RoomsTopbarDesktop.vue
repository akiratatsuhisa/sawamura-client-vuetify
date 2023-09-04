<template>
  <v-app-bar
    v-if="$vuetify.display.mdAndUp"
    elevation="1"
    class="bg-surface-container text-on-surface"
  >
    <v-app-bar-nav-icon @click="drawer = !drawer">
      <v-fab-transition mode="out-in">
        <v-icon
          icon="mdi-arrow-left"
          v-if="$vuetify.display.smAndDown && drawer"
        ></v-icon>
        <v-icon icon="mdi-menu" v-else></v-icon>
      </v-fab-transition>
    </v-app-bar-nav-icon>

    <v-app-bar-title>{{ $t('common.app.title') }}</v-app-bar-title>

    <v-spacer></v-spacer>

    <v-notification-list />

    <v-profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { KEYS } from '@/constants';
import VNotificationList from '@/layouts/Default/NotificationList.vue';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';

const drawer = inject(KEYS.DRAWER.SHOW);
</script>
