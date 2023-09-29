<template>
  <v-app-bar v-if="$vuetify.display.smAndDown" height="80">
    <v-search
      class="h-100 w-100"
      v-model="isSearchFieldOpen"
      v-model:search="search"
      :loading="isLoadingSearchAdvanced"
      dialog
      :placeholder="$t('pages.messages.shared.searchPlaceholder')"
      offset-x="3"
      offset-y="3"
      @submit="requestSearchAdvancedThrottle(search)"
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

    <v-base-loading />
  </v-app-bar>

  <v-app-bar v-else class="bg-surface-container text-on-surface">
    <v-app-bar-title
      class="cursor-pointer prevent-select"
      @click="$router.push({ name: 'Home' })"
    >
      {{ $t('common.app.title') }}
    </v-app-bar-title>
    <v-base-loading />

    <v-profile-menu />
  </v-app-bar>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

import VAvancedRoomListItem from '@/components/Rooms/AvancedRoomListItem.vue';
import VSearch from '@/components/VSearch.vue';
import VProfileMenu from '@/layouts/Default/components/ProfileMenu.vue';
import { useRoomsStore } from '@/store';

const isSearchFieldOpen = ref(false);
const roomsStore = useRoomsStore();
const { search, searchResult, isLoadingSearchAdvanced } =
  storeToRefs(roomsStore);
const { fetchMoreSearchResult, requestSearchAdvancedThrottle } = roomsStore;
</script>
