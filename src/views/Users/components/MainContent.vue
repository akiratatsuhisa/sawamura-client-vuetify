<template>
  <template v-for="whinny in whinnies" :key="whinny.id">
    <v-whinny-content
      :data="whinny"
      class="bg-surface cursor-pointer"
      :class="[
        { 'my-4': $vuetify.display.smAndUp },
        $vuetify.display.xs ? 'rounded-0' : 'rounded-xl',
      ]"
    />
    <v-divider v-if="$vuetify.display.xs" />
  </template>
  <div
    v-if="$vuetify.display.smAndDown"
    :class="[$vuetify.display.xs ? 'py-10' : 'py-6']"
  />
</template>

<script lang="ts" setup>
import _ from 'lodash';
import { ref, watch } from 'vue';

import VWhinnyContent from '@/components/Whinnies/WhinnyContent.vue';
import { useAxios } from '@/composables';
import { IWhinnyResponse } from '@/interfaces';
import { services } from '@/services';

const whinnies = ref<Array<IWhinnyResponse>>([]);

const props = defineProps<{
  query: { username: string } | { sourceId: string };
}>();

const { excute: requestWhinnies } = useAxios(services.whinnies, 'getAll');

watch(
  () => props.query,
  async (query) => {
    const data = await requestWhinnies({ ...query, take: 10 });
    whinnies.value = data;
  },
  { immediate: true },
);

defineExpose({
  insertWhinny(data: IWhinnyResponse) {
    whinnies.value.unshift(data);
  },
  deleteWhinny(data: IWhinnyResponse) {
    whinnies.value = _.filter(
      whinnies.value,
      (whinny) => whinny.id !== data.id,
    );
  },
});
</script>
