<template>
  <v-sidebar v-if="$vuetify.display.mdAndUp" />

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
            >{{ translate('subtitle') }}</v-card-title
          >
        </template>
      </v-hover>

      <div class="position-relative px-3 py-3">
        <div
          class="search bg-surface-container-high text-on-surface rounded-pill d-flex flex-row align-center cursor-pointer"
          @click.stop="isSearchOpen = !isSearchOpen"
        >
          <div class="pl-4 flex-grow-1">
            <input
              :value="search"
              class="input"
              type="text"
              readonly
              :placeholder="$t('pages.messages.shared.searchPlaceholder')"
            />
          </div>
          <v-icon class="mx-2" icon="mdi-magnify" />
        </div>

        <v-slide-y-transition>
          <div
            v-if="isSearchOpen"
            ref="searchContainerRef"
            class="search-container position-absolute mx-3 my-3 rounded-xl bg-surface-container-high elevation-2"
          >
            <div
              class="search bg-surface-container-high text-on-surface rounded-t-xl d-flex flex-row align-center cursor-pointer"
            >
              <v-icon
                class="mx-2"
                icon="mdi-arrow-left"
                @click="isSearchOpen = !isSearchOpen"
              />
              <div class="flex-grow-1">
                <input
                  v-model="search"
                  ref="searchInputRef"
                  class="input"
                  type="text"
                  :placeholder="$t('pages.messages.shared.searchPlaceholder')"
                />
              </div>
              <v-icon
                v-if="searchClearable"
                class="ml-2"
                icon="mdi-close"
                @click="search = ''"
              />
              <v-icon class="mx-2" icon="mdi-magnify" />
            </div>
            <v-divider />
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
        {{ translate('fetchMore') }}
      </v-btn>
    </div>
    <template #append></template>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { onClickOutside } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { ref, watch } from 'vue';

import VRoomListItem from '@/components/Rooms/RoomListItem.vue';
import { usePageLocale } from '@/composables';
import VSidebar from '@/layouts/Default/Sidebar.vue';
import { useRoomsStore } from '@/store';

const { translate } = usePageLocale({ prefix: 'messages.list' });

const isSearchOpen = ref(false);
const searchInputRef = ref<HTMLInputElement>();
watch([isSearchOpen, searchInputRef], ([isOpened]) => {
  if (isOpened) {
    searchInputRef.value?.focus();
  }
});

const searchContainerRef = ref<HTMLDivElement>();
onClickOutside(
  searchContainerRef,
  () => (isSearchOpen.value = !isSearchOpen.value),
);

const roomsStore = useRoomsStore();
const { rooms, isLoadingRooms, search, searchClearable } =
  storeToRefs(roomsStore);
const { fetchMore } = roomsStore;
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
  min-height: 200px;
  max-height: 400px;
  z-index: 100;
}
input.input {
  width: 100%;
  outline: none;
  color: rgb(var(--v-theme-on-surface));
}
</style>
