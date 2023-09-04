<template>
  <div v-if="$vuetify.display.mdAndUp" class="flex-grow-1">
    <div class="position-relative px-3 py-3">
      <div
        class="search bg-surface-container-high text-on-surface rounded-pill d-flex flex-row align-center elevation-2 cursor-pointer"
        @click.stop="isSearchFieldOpen = !isSearchFieldOpen"
      >
        <div class="pl-12 flex-grow-1">
          <input
            :value="search"
            class="input"
            type="text"
            readonly
            spellcheck="false"
            :placeholder="$t('pages.messages.shared.searchPlaceholder')"
          />
        </div>
        <v-icon class="mx-4" icon="mdi-magnify" />
      </div>

      <v-slide-y-transition>
        <div
          v-if="isSearchFieldOpen"
          ref="searchFieldContainerRef"
          class="search-container position-absolute mx-3 my-3 rounded-xl bg-surface-container-high elevation-4"
        >
          <div
            class="search bg-surface-container-high text-on-surface rounded-t-xl d-flex flex-row align-center cursor-pointer"
          >
            <v-icon
              class="mx-4"
              icon="mdi-arrow-left"
              @click="isSearchFieldOpen = !isSearchFieldOpen"
            />
            <div class="flex-grow-1">
              <input
                v-model="search"
                ref="searchFieldRef"
                class="input"
                type="text"
                spellcheck="false"
                :placeholder="$t('pages.messages.shared.searchPlaceholder')"
              />
            </div>
            <v-icon
              v-if="searchClearable"
              class="ml-4"
              icon="mdi-close"
              @click="search = ''"
            />
            <v-icon class="mx-4" icon="mdi-magnify" />
          </div>
          <v-divider />
        </div>
      </v-slide-y-transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { useSearchField } from '@/composables';
import { useRoomsStore } from '@/store';

const { isSearchFieldOpen, searchFieldContainerRef, searchFieldRef } =
  useSearchField();
const roomsStore = useRoomsStore();
const { search, searchClearable } = storeToRefs(roomsStore);
</script>

<style lang="scss" scoped>
.search {
  height: 48px;
}
.search-container {
  height: 48px;
  top: 0;
  left: 0;
  right: 0;
  min-height: 300px;
  max-height: 6s00px;
  z-index: 100;
}
input.input {
  width: 100%;
  outline: none;
  color: rgb(var(--v-theme-on-surface));
}
</style>
