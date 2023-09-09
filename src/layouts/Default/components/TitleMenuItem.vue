<template>
  <v-list-item
    rounded="xl"
    :value="item.value"
    :active="isNavigationActive(item.value)"
  >
    <v-list-item-title v-if="item.translate" class="px-2">
      {{ translate(item.translate) }}
    </v-list-item-title>
  </v-list-item>
</template>

<script lang="ts" setup>
import { useLayoutLocale } from '@/composables';
import { ITitleMenuItem } from '@/interfaces';
import { useAppStore } from '@/store';

defineProps<{
  item: ITitleMenuItem;
}>();

const { translate } = useLayoutLocale({
  prefix: 'default.navigations',
});

const { isNavigationActive } = useAppStore();
</script>
