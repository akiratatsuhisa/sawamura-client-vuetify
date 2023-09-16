<template>
  <v-app-bar class="bg-surface-container text-on-surface">
    <v-app-bar-nav-icon @click="$router.back()">
      <v-icon icon="mdi-arrow-left" />
    </v-app-bar-nav-icon>

    <v-app-bar-title v-if="$vuetify.display.xs">
      <h1 class="v-toolbar-title text-truncate">
        {{ user?.displayName }}
      </h1>
      <h2 class="text-subtitle-2 font-weight-light text-truncate">
        @{{ user?.username }}
      </h2>
    </v-app-bar-title>
    <v-app-bar-title
      v-else
      class="cursor-pointer prevent-select"
      @click="$router.push({ name: 'Home' })"
    >
      {{ $t('common.app.title') }}
    </v-app-bar-title>

    <template v-if="$vuetify.display.smAndUp">
      <v-messages-menu />
      <v-profile-menu />
    </template>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import VMessagesMenu from '@/layouts/Default/MessagesMenu.vue';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';
import { useProfileUserStore } from '@/store';

const profileUserStore = useProfileUserStore();
const { user } = storeToRefs(profileUserStore);
</script>
