<template>
  <v-list-item
    rounded="xl"
    :value="item.value"
    :active="isNavigationActive(item.value)"
  >
    <template #prepend>
      <v-avatar :icon="item.icon" :color="item.color ?? 'secondary'" />
    </template>

    <v-list-item-title v-if="item.translate" class="px-2">
      {{ translate(item.translate) }}
    </v-list-item-title>
  </v-list-item>
</template>

<script lang="ts" setup>
import { useLayoutLocale } from '@/composables';
import { IIconMenuItem } from '@/interfaces';
import { useAppStore } from '@/store';

defineProps<{
  item: IIconMenuItem;
}>();

const { translate } = useLayoutLocale({
  prefix: 'default.navigations',
});

const { isNavigationActive } = useAppStore();
</script>
