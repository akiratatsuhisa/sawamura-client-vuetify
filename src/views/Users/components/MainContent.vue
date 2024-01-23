<template>
  <template v-for="item in items" :key="item.id">
    <v-whinny-content
      :data="item"
      class="bg-surface cursor-pointer"
      :class="[
        { 'my-4': $vuetify.display.smAndUp },
        $vuetify.display.xs ? 'rounded-0' : 'rounded-xl',
      ]"
    />
    <v-divider v-if="$vuetify.display.xs" />
  </template>

  <div
    class="text-center mt-3 mt-sm-0"
    v-if="!isAllLoaded"
    v-intersect="onIntersect"
  >
    <v-btn :loading="isLoading" variant="plain" @click="fetchMore">
      {{ $t('pages.users.relationships.fetchMore') }}
    </v-btn>
  </div>

  <div
    v-if="$vuetify.display.smAndDown"
    :class="[$vuetify.display.xs ? 'py-10' : 'py-6']"
  />
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { ref, watch } from 'vue';

import VWhinnyContent from '@/components/Whinnies/WhinnyContent.vue';
import { useAxios, useFetchIntersection } from '@/composables';
import { IWhinnyResponse } from '@/interfaces';
import { services } from '@/services';

const props = defineProps<{
  query: { username: string } | { sourceId: string };
}>();

const items = ref<Array<IWhinnyResponse>>([]);

const { request, isLoading } = useAxios(services.whinnies, 'getAll');

watch(
  () => props.query,
  async (query, prevQuery) => {
    if (_.isEqual(query, prevQuery)) {
      return;
    }

    const data = await request({ ...query, take: 10 });
    items.value = data;
  },
  { immediate: true },
);

const isAllLoaded = ref<boolean>(false);

async function fetchMore() {
  const cursor = _.last(items.value)?.id;

  const data = await request({
    ...props.query,
    take: 10,
    cursor,
  });

  if (!data.length) {
    isAllLoaded.value = true;
  }

  items.value = _.uniqBy([...items.value, ...data], (whinny) => whinny.id);
}

const { onIntersect } = useFetchIntersection({
  fetch: fetchMore,
  ms: 500,
  isLoading,
  isAllLoaded,
});

defineExpose({
  insertWhinny(data: IWhinnyResponse) {
    items.value.unshift(data);
  },
  deleteWhinny(data: IWhinnyResponse) {
    items.value = _.filter(items.value, (whinny) => whinny.id !== data.id);
  },
});
</script>
