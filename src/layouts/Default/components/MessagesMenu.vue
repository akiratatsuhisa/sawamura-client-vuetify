<template>
  <v-btn icon>
    <v-avatar color="primary" icon="mdi-forum" />

    <v-base-menu :title="translate('title')" #default="{ isMenu }">
      <div v-if="isMenu">
        <v-card-title>
          {{ translate('title') }}
        </v-card-title>
        <v-divider />
      </div>
      <v-list
        :max-height="$vuetify.display.mdAndUp ? 350 : undefined"
        class="mb-4"
      >
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
    </v-base-menu>
  </v-btn>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { useFetchIntersection, useLayoutLocale } from '@/composables';
import VMessageListItem from '@/layouts/Default/components/MessageListItem.vue';
import { useRoomsStore } from '@/store';

const { translate } = useLayoutLocale({
  prefix: 'default.topAppBar.message',
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
