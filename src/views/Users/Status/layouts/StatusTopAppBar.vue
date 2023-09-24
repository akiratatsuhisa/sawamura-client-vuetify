<template>
  <v-app-bar class="bg-surface-container text-on-surface">
    <v-app-bar-nav-icon @click="$router.back()">
      <v-icon icon="mdi-arrow-left" />
    </v-app-bar-nav-icon>

    <v-app-bar-title
      class="cursor-pointer prevent-select"
      @click="$router.push({ name: 'Home' })"
    >
      {{ $t('common.app.title') }}
    </v-app-bar-title>

    <template v-if="$vuetify.display.mdAndUp">
      <v-messages-menu />
      <v-profile-menu />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import VMessagesMenu from '@/layouts/Default/MessagesMenu.vue';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';
</script>
