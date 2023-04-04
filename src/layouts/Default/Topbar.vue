<template>
  <v-app-bar elevation="4">
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

    <v-spacer></v-spacer>

    <notification-list />

    <profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { KEYS } from '@/constants';

import ProfileMenu from './Menus/ProfileMenu.vue';
import NotificationList from './NotificationList.vue';

const drawer = inject(KEYS.DRAWER.SHOW);
</script>
