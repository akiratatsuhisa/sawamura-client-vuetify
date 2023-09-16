<template>
  <div class="d-flex flex-column-reverse flex-sm-column">
    <div
      class="d-flex flex-column flex-sm-row justify-sm-space-between align-sm-center"
    >
      <v-base-limit-page
        :skip="props.skip"
        @update:skip="(value) => emit('update:skip', value)"
        :take="props.take"
        @update:take="(value) => emit('update:take', value)"
      />

      <div class="text-body-2 font-weight-medium mt-2 mt-sm-0">
        {{ $t('common.pagination.showing', { from, to, totalCount }) }}
      </div>
    </div>
    <v-pagination
      :model-value="page"
      @update:model-value="updatePage"
      :length="length"
      density="comfortable"
      rounded="circle"
    />
  </div>
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { computed } from 'vue';

import VBaseLimitPage from '@/components/VBaseLimitPage.vue';

const props = defineProps<{
  skip?: string;
  take?: string;
  count?: number;
  totalCount?: number;
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

const from = computed(() => (skip.value ?? 0) + (props.count ? 1 : 0));
const to = computed(() => (skip.value ?? 0) + (props.count ?? 0));

const length = computed(() =>
  _.ceil((props.totalCount ?? 0) / (take.value ?? 0)),
);
const page = computed(() => _.ceil((skip.value ?? 0) / (take.value ?? 0) + 1));
function updatePage(value: number) {
  skip.value = (value - 1) * (take.value ?? 0);
}
</script>
