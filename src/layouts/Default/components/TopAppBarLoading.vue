<template>
  <v-progress-linear
    v-if="anyLoading.size"
    absolute
    location="bottom"
    color="primary"
    indeterminate
  />
  <v-progress-linear
    v-else-if="typeof percent !== 'undefined'"
    absolute
    location="bottom"
    color="primary"
    :model-value="percent"
  />
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';

import { KEYS } from '@/constants';

const anyLoading = inject(KEYS.ANY_LOADING)!;
const loadingPercents = inject(KEYS.LOADING_PERCENTS)!;

const percent = computed<undefined | number>(() => {
  const [_id, percent] = loadingPercents.value?.at(0) ?? ['', undefined];
  return percent;
});
</script>
