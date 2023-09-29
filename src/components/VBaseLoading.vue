<template>
  <v-progress-linear
    v-if="typeof firstLoading === 'number'"
    absolute
    location="bottom"
    color="primary"
    :model-value="firstLoading"
  />
  <v-progress-linear
    v-else-if="typeof firstLoading === 'boolean'"
    absolute
    location="bottom"
    color="primary"
    indeterminate
  />
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import { KEYS } from '@/constants';

const loadings = inject(KEYS.LOADINGS)!;

const firstLoading = computed(() => {
  const [_id, value] = loadings.value?.at(0) ?? ['', undefined];
  return value;
});
</script>
