<template>
  <v-list-item>
    <template #prepend>
      <v-avatar
        color="secondary-container"
        class="elevation-6"
        :image="roomPhotoUrl"
      ></v-avatar>
    </template>
    <v-list-item-title>
      <v-icon
        :color="room.isGroup ? 'tertiary' : 'secondary'"
        size="16"
        :icon="room.isGroup ? 'mdi-account-group' : 'mdi-account-key'"
      ></v-icon>
      {{ displayName }}
    </v-list-item-title>

    <v-list-item-subtitle>
      {{
        room.isGroup
          ? translateShared('roomTypes.group')
          : translateShared('roomTypes.private')
      }}
    </v-list-item-subtitle>

    <template #append>
      <v-btn
        icon="mdi-login-variant"
        variant="text"
        :to="{
          name: 'Messages:Room',
          params: { roomId: room.id },
        }"
      />
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import { usePageLocale, useRoom } from '@/composables';
import { IRoomResponse } from '@/interfaces';

const props = defineProps<{
  room: IRoomResponse;
}>();

const { translateShared } = usePageLocale({ prefix: 'messages.list' });

const { displayName, roomPhotoUrl } = useRoom(props.room);
</script>
