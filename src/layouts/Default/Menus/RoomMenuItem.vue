<template>
  <v-list-item rounded="xl" :value="item.value" :active="isActive(item.value)">
    <template #prepend>
      <v-avatar :image="roomPhotoUrl" color="secondary-container" />
    </template>

    <v-list-item-title class="px-2">{{ displayName }}</v-list-item-title>
  </v-list-item>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { useRoom } from '@/composables';
import { KEYS } from '@/constants';
import { IRoomMenuItem } from '@/interfaces';

const props = defineProps<{
  item: IRoomMenuItem;
}>();

const isActive = inject(KEYS.DRAWER.IS_ACTIVE)!;

const { displayName, roomPhotoUrl } = useRoom(props.item.room);
</script>
