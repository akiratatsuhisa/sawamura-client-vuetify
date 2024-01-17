<template>
  <v-whinny-content
    :key="data.id"
    detail
    :data="data"
    :user="data.user"
    class="bg-surface"
    :class="[
      { 'my-4': $vuetify.display.smAndUp },
      $vuetify.display.xs ? 'rounded-0' : 'rounded-xl',
    ]"
  />
</template>

<script lang="ts" setup>
import VWhinnyContent from '@/components/Whinnies/WhinnyContent.vue';
import { IWhinnyResponse } from '@/interfaces';

defineProps<{
  data: IWhinnyResponse;
}>();
</script>
