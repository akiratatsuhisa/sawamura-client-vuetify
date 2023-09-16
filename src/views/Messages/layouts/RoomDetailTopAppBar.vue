<template>
  <v-app-bar
    v-if="$vuetify.display.mdAndUp"
    class="bg-surface-container text-on-surface"
  >
    <v-app-bar-title
      class="cursor-pointer prevent-select"
      @click="$router.push({ name: 'Home' })"
    >
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
