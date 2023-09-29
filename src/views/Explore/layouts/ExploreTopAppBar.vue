<template>
  <v-app-bar v-if="$vuetify.display.smAndDown" height="80">
    <v-search
      class="h-100 w-100"
      v-model="isSearchFieldOpen"
      v-model:search="search"
      dialog
      offset-x="3"
      offset-y="3"
      :placeholder="$t('pages.explore.search.placeholder')"
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
        <v-settings-menu />
      </template>
    </v-search>

    <v-base-loading />
  </v-app-bar>

  <v-app-bar v-else class="bg-surface-container text-on-surface">
    <div class="w-100">
      <v-search
        class="w-50 mx-auto"
        v-model:search="search"
        :readonly="false"
        offset-x="1"
        offset-y="1"
        density="compact"
        field-bg-color="surface"
        :placeholder="$t('pages.explore.search.placeholder')"
      >
        <template #prepend-icon>
          <div class="px-2" />
        </template>
      </v-search>
    </div>
    <v-base-loading />

    <v-settings-menu />
    <v-profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import VSearch from '@/components/VSearch.vue';
import VProfileMenu from '@/layouts/Default/components/ProfileMenu.vue';
import VSettingsMenu from '@/views/Explore/layouts/SettingsMenu.vue';

const isSearchFieldOpen = ref(false);
const search = ref('');
</script>
