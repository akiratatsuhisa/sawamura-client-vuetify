<template>
  <v-app-bar
    v-if="!$vuetify.display.mdAndUp"
    height="80"
    :class="{ 'bg-surface-container-lowest elevation-1': y }"
  >
    <div class="h-100 w-100 px-3 py-3">
      <div
        class="search bg-surface-container-high text-on-surface rounded-pill d-flex flex-row align-center cursor-pointer"
      >
        <v-icon class="mx-4" icon="mdi-menu" @click="drawer = !drawer" />
        <div @click="isSearchOpen = !isSearchOpen" class="flex-grow-1">
          <input
            :value="search"
            class="input"
            type="text"
            readonly
            :placeholder="$t('pages.messages.shared.searchPlaceholder')"
          />
        </div>

        <v-profile-menu class="mx-3" size="32" />
      </div>
    </div>
  </v-app-bar>

  <v-dialog
    :model-value="isSearchOpen && $vuetify.display.mdAndDown"
    fullscreen
    transition="slide-y-transition"
  >
    <v-card rounded="none" class="bg-surface-container-high text-on-surface">
      <v-toolbar class="px-3 bg-surface-container-high text-on-surface">
        <v-input
          prepend-icon="mdi-arrow-left"
          @click:prepend="isSearchOpen = !isSearchOpen"
          :append-icon="searchClearable ? 'mdi-close' : undefined"
          @click:append="search = ''"
          hide-details
        >
          <input
            v-model="search"
            ref="searchInputRef"
            class="input"
            type="text"
            :placeholder="$t('pages.messages.shared.searchPlaceholder')"
          />
        </v-input>
      </v-toolbar>
      <v-divider />
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { useWindowScroll } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { inject, ref, watch } from 'vue';

import { KEYS } from '@/constants';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';
import { useRoomsStore } from '@/store';

const { y } = useWindowScroll();
const drawer = inject(KEYS.DRAWER.SHOW);

const isSearchOpen = ref(false);
const searchInputRef = ref<HTMLInputElement>();
watch([isSearchOpen, searchInputRef], ([isOpened]) => {
  if (isOpened) {
    searchInputRef.value?.focus();
  }
});

const roomsStore = useRoomsStore();
const { search, searchClearable } = storeToRefs(roomsStore);
</script>

<style lang="scss" scoped>
.search {
  height: 56px;
}
input.input {
  width: 100%;
  outline: none;
  color: rgb(var(--v-theme-on-surface));
}
</style>
