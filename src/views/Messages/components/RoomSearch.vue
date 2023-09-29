<template>
  <v-search
    v-if="$vuetify.display.mdAndUp"
    class="flex-grow-1"
    v-model="model"
    v-model:search="search"
    :loading="isLoadingSearchAdvanced"
    dropdown
    density="compact"
    :placeholder="$t('pages.messages.shared.searchPlaceholder')"
    offset-x="3"
    offset-y="3"
    @submit="requestSearchAdvancedThrottle(search)"
  >
    <template #prepend-icon>
      <div class="px-4"></div>
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
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import VAvancedRoomListItem from '@/components/Rooms/AvancedRoomListItem.vue';
import VSearch from '@/components/VSearch.vue';
import { useRoomsStore } from '@/store';

const model = ref(false);

const roomsStore = useRoomsStore();
const { search, searchResult, isLoadingSearchAdvanced } =
  storeToRefs(roomsStore);
const { requestSearchAdvancedThrottle, fetchMoreSearchResult } = roomsStore;
</script>
