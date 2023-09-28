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

    <v-profile-menu />

    <v-top-app-bar-loading />
  </v-app-bar>
</template>

<script lang="ts" setup>
import VProfileMenu from '@/layouts/Default/components/ProfileMenu.vue';
import VTopAppBarLoading from '@/layouts/Default/components/TopAppBarLoading.vue';
</script>
