<template>
  <v-btn icon>
    <v-avatar
      color="secondary-container"
      class="elevation-2"
      icon="mdi-message-text"
    />

    <v-base-menu :title="translate('title')">
      <template #default="{ isMenu }">
        <div v-if="isMenu">
          <v-card-title>
            {{ translate('title') }}
          </v-card-title>
          <v-divider />
        </div>
        <v-list max-height="350" class="mb-4">
          <v-message-list-item
            v-for="room in rooms"
            :key="room.id"
            :room="room"
          />
          <v-list-item v-intersect="onIntersect" class="text-center">
            <v-btn
              :loading="isLoadingRooms"
              icon="mdi-arrow-down"
              size="small"
              variant="plain"
              @click="fetchMore"
            />
          </v-list-item>
        </v-list>
      </template>
    </v-base-menu>
  </v-btn>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { storeToRefs } from 'pinia';

import { useFetchIntersection, useLayoutLocale } from '@/composables';
import VMessageListItem from '@/layouts/Default/Messages/MessageListItem.vue';
import { useRoomsStore } from '@/store';

const { translate } = useLayoutLocale({
  prefix: 'default.topbar.message',
});

const roomsStore = useRoomsStore();
const { rooms, isLoadingRooms, isRoomsAllLoaded } = storeToRefs(roomsStore);
const { fetchMore } = roomsStore;

const { onIntersect } = useFetchIntersection({
  fetch: fetchMore,
  ms: 500,
  isLoading: isLoadingRooms,
  isAllLoaded: isRoomsAllLoaded,
});
</script>
