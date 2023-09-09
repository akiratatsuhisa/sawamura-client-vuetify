<template>
  <v-list lines="two">
    <v-list-subheader tag="h2">
      {{ translate('subtitle') }}
    </v-list-subheader>

    <v-room-list-item v-for="room in rooms" :key="room.id" :room="room" />
  </v-list>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { usePageLocale } from '@/composables';
import { useRoomsStore } from '@/store';
import VRoomListItem from '@/views/Messages/components/RoomListItem.vue';

const roomsStore = useRoomsStore();
const { rooms } = storeToRefs(roomsStore);

const { translate } = usePageLocale({
  prefix: 'messages.list',
});
</script>
