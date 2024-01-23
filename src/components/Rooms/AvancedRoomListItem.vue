<template>
  <v-list-item :to="{ name: 'Messages:Room', params: { roomId: room.id } }">
    <template #prepend>
      <v-badge
        location="bottom end"
        :color="room?.isGroup ? 'tertiary' : 'secondary'"
        :icon="room?.isGroup ? 'mdi-account-group' : 'mdi-account-key'"
      >
        <v-avatar
          :image="roomPhotoUrl"
          color="secondary-container"
          class="elevation-1"
        />
      </v-badge>
    </template>

    <v-list-item-title>
      {{ displayName }}
    </v-list-item-title>

    <v-list-item-subtitle>
      {{ lastActivatedAgo }}
    </v-list-item-subtitle>

    <v-list-item-subtitle v-if="lastMessage">
      {{ getDisplayRoomMemberNameByUser(room.roomMembers, lastMessage.user) }}
      -
      {{ getDisplayRoomMessage(lastMessage) }}
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import {
  getDisplayRoomMemberNameByUser,
  getDisplayRoomMessage,
  useAdvancedRoom,
} from '@/composables';
import { IAdvancedRoomResponse } from '@/interfaces';

const props = defineProps<{
  room: IAdvancedRoomResponse;
}>();

const { displayName, roomPhotoUrl, lastActivatedAgo, lastMessage } =
  useAdvancedRoom(computed(() => props.room));
</script>
