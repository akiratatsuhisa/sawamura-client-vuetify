<template>
  <v-room-list-item :room="room" />
</template>

<script lang="ts" setup>
import VRoomListItem from '@/components/Rooms/RoomListItem.vue';
import { IRoomResponse } from '@/interfaces';

defineProps<{ room: IRoomResponse }>();
</script>
