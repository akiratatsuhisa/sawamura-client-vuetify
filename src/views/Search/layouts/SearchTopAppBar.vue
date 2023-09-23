<template>
  <v-app-bar v-if="$vuetify.display.smAndDown" height="80">
    <v-search
      class="h-100 w-100"
      v-model="isSearchFieldOpen"
      v-model:search="search"
      offset-x="3"
      offset-y="3"
    >
      <template #prepend-icon>
        <v-btn
          class="ma-2"
          size="small"
          icon
          @click.stop="isSearchFieldOpen = true"
        >
          <v-icon
            class="mx-4"
            size="24"
            icon="mdi-magnify"
            color="on-surface"
          />
        </v-btn>
      </template>

      <template #append-icon>
        <v-profile-menu class="ma-2" size="40" />
      </template>
    </v-search>
  </v-app-bar>

  <v-app-bar v-else class="bg-surface-container text-on-surface">
    <v-app-bar-title
      class="cursor-pointer prevent-select"
      @click="$router.push({ name: 'Home' })"
    >
      {{ $t('common.app.title') }}
    </v-app-bar-title>

    <v-profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import VSearch from '@/components/VSearch.vue';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';

const isSearchFieldOpen = ref(false);
const search = ref('');
</script>
