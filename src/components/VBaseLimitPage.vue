<template>
  <v-menu-chip
    :model-value="take"
    icon="mdi-format-list-numbered"
    filter-icon="mdi-format-list-numbered"
    :items="limitList"
  >
    <template #content>
      {{ $t('common.pagination.limit', { limit: take }) }}
    </template>
    <template #item="{ item, isActive }">
      <v-list-item
        :value="item.value"
        :class="{ 'v-list-item--active': isActive }"
        @click="updateLimit(item.value)"
      >
        <v-list-item-title>
          {{ $t('common.pagination.show', { limit: item.value }) }}
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-menu-chip>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed } from 'vue';

import VMenuChip from '@/components/VMenuChip.vue';
import { Router } from '@/helpers';

const props = defineProps<{
  skip?: string;
  take?: string;
}>();

const emit = defineEmits<{
  (event: 'update:skip', payload?: string): void;
  (event: 'update:take', payload?: string): void;
}>();

function parseStringToNumber(value?: string): number | undefined {
  return _.isNil(value) || value === '' || _.isNaN(Number(value))
    ? undefined
    : Number(value);
}
function parseNumberToString(value?: number): string | undefined {
  return _.isNil(value) ? undefined : value.toString();
}
const skip = computed<number | undefined>({
  get: () => parseStringToNumber(props.skip),
  set: (value?: number) => emit('update:skip', parseNumberToString(value)),
});
const take = computed<number | undefined>({
  get: () => parseStringToNumber(props.take),
  set: (value?: number) => emit('update:take', parseNumberToString(value)),
});

const limitList = Router.TAKE_LIMITS;

function updateLimit(value: number) {
  skip.value = 0;
  take.value = value;
}
</script>
