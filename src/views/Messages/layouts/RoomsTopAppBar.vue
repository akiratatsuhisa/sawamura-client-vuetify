<template>
  <v-app-bar
    v-if="$vuetify.display.mdAndUp"
    elevation="1"
    class="bg-surface-container text-on-surface"
  >
    <v-app-bar-title @click="$router.push({ name: 'Home' })">
      {{ $t('common.app.title') }}
    </v-app-bar-title>

    <v-notifications-menu />

    <v-profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import VNotificationsMenu from '@/layouts/Default/NotificationsMenu.vue';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';
</script>
