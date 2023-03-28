<template>
  <v-list-item rounded="xl" :value="item.value" :active="isActive(item.value)">
    <template #prepend>
      <v-avatar
        :icon="item.icon"
        :color="item.color ?? isDark ? 'grey-darken-2' : 'grey-lighten-2'"
      />
    </template>

    <v-list-item-title class="px-2">{{ item.title }}</v-list-item-title>
  </v-list-item>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { KEYS } from '@/constants';
import { IIconMenuItem } from '@/interfaces/menus';

defineProps<{
  item: IIconMenuItem;
}>();

const isDark = inject(KEYS.THEMES.IS_DARK)!;

const isActive = inject(KEYS.DRAWER.IS_ACTIVE)!;
</script>
