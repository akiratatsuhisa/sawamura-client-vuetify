<template>
  <v-app-bar class="bg-surface-container text-on-surface">
    <v-app-bar-nav-icon
      v-if="$vuetify.display.smAndDown"
      @click="$router.replace($route.meta.backRoute ?? { name: 'Home' })"
    >
      <v-icon icon="mdi-arrow-left" />
    </v-app-bar-nav-icon>

    <v-app-bar-title
      class="cursor-pointer prevent-select"
      @click="$router.push({ name: 'Home' })"
    >
      {{ $t('common.app.title') }}
    </v-app-bar-title>
    <v-base-loading />

    <v-dashboard-menu v-if="$vuetify.display.xs && hasRoles('Administrator')" />
    <v-messages-menu />
    <v-profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useAuth } from '@/composables';
import VDashboardMenu from '@/layouts/Default/components/DashboardMenu.vue';
import VMessagesMenu from '@/layouts/Default/components/MessagesMenu.vue';
import VProfileMenu from '@/layouts/Default/components/ProfileMenu.vue';

const { hasRoles } = useAuth();
</script>
