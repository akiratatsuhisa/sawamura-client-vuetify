<template>
  <v-navigation-drawer v-if="$vuetify.display.mdAndUp" permanent width="340">
    <template #prepend>
      <v-hover #default="{ isHovering, props }">
        <v-card-title
          tag="h1"
          class="cursor-pointer py-2"
          :class="{ 'text-primary': isHovering }"
          @click="$router.push({ name: 'Messages' })"
          v-bind="props"
        >
          {{ translate('subtitle') }}
        </v-card-title>
      </v-hover>

      <v-search
        v-model="isSearchFieldOpen"
        v-model:search="search"
        dropdown
        density="compact"
        :placeholder="$t('pages.messages.shared.searchPlaceholder')"
        offset-x="3"
        offset-y="3"
        @submit="requestSearchAdvancedThrottle(search)"
      >
        <template #prepend-icon>
          <div class="px-1"></div>
        </template>

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
      </v-search>
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
import { ref } from 'vue';

import VAvancedRoomListItem from '@/components/Rooms/AvancedRoomListItem.vue';
import VRoomListItem from '@/components/Rooms/RoomListItem.vue';
import VSearch from '@/components/VSearch.vue';
import { usePageLocale } from '@/composables';
import { useRoomsStore } from '@/store';

const { translate, translateShared } = usePageLocale({
  prefix: 'messages.list',
});

const isSearchFieldOpen = ref(false);
const roomsStore = useRoomsStore();
const { rooms, isLoadingRooms, search, searchResult, isLoadingSearchAdvanced } =
  storeToRefs(roomsStore);
const { fetchMore, requestSearchAdvancedThrottle, fetchMoreSearchResult } =
  roomsStore;
</script>
