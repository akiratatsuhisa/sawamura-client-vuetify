<template>
  <template v-for="whinny in comments" :key="whinny.id">
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
import { ref, watch } from 'vue';

import VWhinnyContent from '@/components/Whinnies/WhinnyContent.vue';
import { useAxios } from '@/composables';
import { IWhinnyResponse } from '@/interfaces';
import { services } from '@/services';

const props = defineProps<{ sourceId: string }>();

const comments = ref<Array<IWhinnyResponse>>([]);

const { excute: requestWhinnies } = useAxios(services.whinnies, 'getAll');

watch(
  () => props.sourceId,
  async (sourceId) => {
    const data = await requestWhinnies({ sourceId, take: 10 });
    comments.value = data;
  },
  { immediate: true },
);
</script>
