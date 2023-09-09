<template>
  <v-rail-navigation v-if="$vuetify.display.mdAndUp" />

  <v-navigation-drawer v-if="$vuetify.display.mdAndUp" permanent width="340">
    <template #prepend>
      <v-hover>
        <template #default="{ isHovering, props }">
          <v-card-title
            tag="h1"
            class="cursor-pointer py-2"
            :class="{ 'text-primary': isHovering }"
            @click="$router.push({ name: 'Messages' })"
            v-bind="props"
          >
            {{ translate('subtitle') }}
          </v-card-title>
        </template>
      </v-hover>

      <div class="position-relative px-3 py-3">
        <div
          class="search bg-surface-container-high text-on-surface rounded-pill d-flex flex-row align-center cursor-pointer"
          @click.stop="isSearchFieldOpen = !isSearchFieldOpen"
        >
          <div class="pl-4 flex-grow-1">
            <input
              :value="search"
              class="input"
              type="text"
              readonly
              spellcheck="false"
              :placeholder="$t('pages.messages.shared.searchPlaceholder')"
            />
          </div>
          <v-icon class="mx-2" icon="mdi-magnify" />
        </div>

        <v-slide-y-transition>
          <div
            v-if="isSearchFieldOpen"
            ref="searchFieldContainerRef"
            class="search-container d-flex flex-column position-absolute mx-3 my-3 rounded-xl bg-surface-container-high elevation-2"
          >
            <div
              class="search flex-shrink-0 bg-surface-container-high text-on-surface rounded-t-xl d-flex flex-row align-center cursor-pointer"
            >
              <v-icon
                class="mx-2"
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
                class="ml-2"
                icon="mdi-close"
                @click="search = ''"
              />
              <v-icon
                class="mx-2"
                icon="mdi-magnify"
                @click="() => requestSearchAdvancedThrottle(search)"
              />
            </div>
            <v-divider />

            <div class="overflow-y-auto flex-grow-1">
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
                    {{ translateShared('fetchMore') }}
                  </v-btn>
                </v-list-item>
              </v-list>
            </div>

            <div class="py-2 flex-shrink-0"></div>
          </div>
        </v-slide-y-transition>
      </div>

      <v-divider />
    </template>

    <v-list lines="two" density="comfortable">
      <template v-for="room in rooms" :key="room.id">
        <v-room-list-item :room="room" />
      </template>
    </v-list>

    <div class="pa-3">
      <v-btn variant="plain" block :loading="isLoadingRooms" @click="fetchMore">
        {{ translateShared('fetchMore') }}
      </v-btn>
    </div>
    <template #append></template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import VAvancedRoomListItem from '@/components/Rooms/AvancedRoomListItem.vue';
import VRoomListItem from '@/components/Rooms/RoomListItem.vue';
import { usePageLocale, useSearchField } from '@/composables';
import VRailNavigation from '@/layouts/Default/components/RailNavigation.vue';
import { useRoomsStore } from '@/store';

const { translate, translateShared } = usePageLocale({
  prefix: 'messages.list',
});

const { isSearchFieldOpen, searchFieldContainerRef, searchFieldRef } =
  useSearchField();
const roomsStore = useRoomsStore();
const {
  rooms,
  isLoadingRooms,
  search,
  searchClearable,
  searchResult,
  isLoadingSearchAdvanced,
} = storeToRefs(roomsStore);
const { fetchMore, requestSearchAdvancedThrottle, fetchMoreSearchResult } =
  roomsStore;
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
  max-height: 400px;
  z-index: 100;
}
input.input {
  width: 100%;
  outline: none;
  color: rgb(var(--v-theme-on-surface));
}
</style>
