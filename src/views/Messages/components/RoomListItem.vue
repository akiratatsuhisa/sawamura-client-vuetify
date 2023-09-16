<template>
  <v-list-item
    :to="{
      name: 'Messages:Room',
      params: { roomId: room.id },
    }"
  >
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
      {{
        room.isGroup
          ? translateShared('roomTypes.group')
          : translateShared('roomTypes.private')
      }}
      {{ lastActivatedAgo ? '-' : undefined }}
      {{ lastActivatedAgo }}
    </v-list-item-subtitle>
    <v-list-item-subtitle v-if="lastMessage">
      {{ getDisplayRoomMemberNameByUser(room.roomMembers, lastMessage.user) }}
      -
      {{ getDisplayRoomMessage(lastMessage) }}
    </v-list-item-subtitle>

    <template #append>
      <v-btn
        v-if="$vuetify.display.mdAndUp"
        append-icon="mdi-login-variant"
        variant="tonal"
        :to="{
          name: 'Messages:Room',
          params: { roomId: room.id },
        }"
      >
        {{ translate('enterChat') }}
      </v-btn>
    </template>
  </v-list-item>

  <v-divider :inset="$vuetify.display.mdAndUp" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import {
  getDisplayRoomMemberNameByUser,
  getDisplayRoomMessage,
  usePageLocale,
  useRoom,
} from '@/composables';
import { IRoomResponse } from '@/interfaces';

const props = defineProps<{
  room: IRoomResponse;
}>();

const { translate, translateShared } = usePageLocale({
  prefix: 'messages.list',
});

const { displayName, roomPhotoUrl, lastActivatedAgo, lastMessage } = useRoom(
  computed(() => props.room),
);
</script>
