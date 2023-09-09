<template>
  <v-app-bar elevation="1" class="bg-surface-container text-on-surface">
    <v-app-bar-nav-icon
      v-if="$vuetify.display.smAndDown"
      @click="$router.replace($route.meta.backRoute ?? { name: 'Home' })"
    >
      <v-icon icon="mdi-arrow-left" />
    </v-app-bar-nav-icon>

    <v-app-bar-title>{{ $t('common.app.title') }}</v-app-bar-title>

    <v-dashboard-menu />
    <v-messages-menu />
    <v-profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import VDashboardMenu from '@/layouts/Default/DashboardMenu.vue';
import VMessagesMenu from '@/layouts/Default/MessagesMenu.vue';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';
</script>
