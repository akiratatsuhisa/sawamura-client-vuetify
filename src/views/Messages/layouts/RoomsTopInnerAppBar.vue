<template>
  <v-app-bar
    v-if="!$vuetify.display.mdAndUp"
    height="80"
    :class="{ 'bg-surface-container-lowest elevation-1': isTopbarElevation }"
  >
    <div class="h-100 w-100 px-3 py-3">
      <div
        class="search bg-surface-container-high text-on-surface rounded-pill d-flex flex-row align-center cursor-pointer"
      >
        <v-btn
          class="ma-2"
          size="small"
          icon
          @click="isSearchFieldOpen = !isSearchFieldOpen"
        >
          <v-icon
            class="mx-4"
            size="24"
            icon="mdi-magnify"
            color="on-surface"
          />
        </v-btn>
        <div
          @click="isSearchFieldOpen = !isSearchFieldOpen"
          class="flex-grow-1"
        >
          <input
            :value="search"
            class="input"
            type="text"
            readonly
            spellcheck="false"
            :placeholder="$t('pages.messages.shared.searchPlaceholder')"
          />
        </div>

        <v-profile-menu class="ma-2" size="40" />
      </div>
    </div>
  </v-app-bar>

  <v-dialog
    :model-value="isSearchFieldOpen && $vuetify.display.mdAndDown"
    fullscreen
    transition="slide-y-transition"
  >
    <v-card rounded="none" class="bg-surface-container-high text-on-surface">
      <v-toolbar class="px-3 bg-surface-container-high text-on-surface">
        <v-input
          prepend-icon="mdi-arrow-left"
          @click:prepend="isSearchFieldOpen = !isSearchFieldOpen"
          :append-icon="searchClearable ? 'mdi-close' : undefined"
          @click:append="search = ''"
          hide-details
        >
          <input
            v-model="search"
            ref="searchFieldRef"
            class="input"
            type="text"
            spellcheck="false"
            :placeholder="$t('pages.messages.shared.searchPlaceholder')"
          />
        </v-input>
      </v-toolbar>
      <v-divider />

      <div class="overflow-y-auto">
        <v-list>
          <v-list-subheader v-if="searchResult.length">
            {{ $t('pages.messages.shared.results') }}
          </v-list-subheader>
          <v-avanced-room-list-item
            v-for="room in searchResult"
            :key="room.id"
            :room="room"
          />
          <v-list-item class="text-center">
            <v-btn
              v-if="searchResult.length"
              variant="text"
              :loading="isLoadingSearchAdvanced"
              @click="fetchMoreSearchResult"
            >
              {{ $t('pages.messages.shared.fetchMore') }}
            </v-btn>
          </v-list-item>
        </v-list>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import VAvancedRoomListItem from '@/components/Rooms/AvancedRoomListItem.vue';
import { useScrollBehavior, useSearchField } from '@/composables';
import VProfileMenu from '@/layouts/Default/ProfileMenu.vue';
import { useRoomsStore } from '@/store';

const { isTopbarElevation } = useScrollBehavior();

const { isSearchFieldOpen, searchFieldRef } = useSearchField();
const roomsStore = useRoomsStore();
const { search, searchClearable, searchResult, isLoadingSearchAdvanced } =
  storeToRefs(roomsStore);
const { fetchMoreSearchResult } = roomsStore;
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
