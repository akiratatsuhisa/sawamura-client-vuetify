<template>
  <v-list-item rounded="xl" :value="item.value" :active="isActive(item.value)">
    <template #prepend>
      <v-avatar
        :image="item.avatar"
        :color="item.color ?? 'secondary-container'"
      />
    </template>

    <v-list-item-title v-if="item.translate" class="px-2">
      {{ translate(item.translate) }}
    </v-list-item-title>
  </v-list-item>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import { useLayoutLocale } from '@/composables';
import { KEYS } from '@/constants';
import { IAvatarMenuItem } from '@/interfaces';

defineProps<{
  item: IAvatarMenuItem;
}>();

const isActive = inject(KEYS.DRAWER.IS_ACTIVE)!;

const { translate } = useLayoutLocale({
  prefix: 'default.sidebar',
});
</script>
