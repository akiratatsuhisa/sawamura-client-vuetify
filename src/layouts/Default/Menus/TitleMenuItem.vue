<template>
  <v-list-item rounded="xl" :value="item.value" :active="isActive(item.value)">
    <v-list-item-title class="px-2">{{ item.title }}</v-list-item-title>
  </v-list-item>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { KEYS } from '@/constants';
import { ITitleMenuItem } from '@/interfaces';

defineProps<{
  item: ITitleMenuItem;
}>();

const isActive = inject(KEYS.DRAWER.IS_ACTIVE)!;
</script>
