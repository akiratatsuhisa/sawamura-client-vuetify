<template>
  <v-bottom-sheet inset v-model="model" v-bind="bottomSheetProps">
    <v-card class="rounded-t-xl rounded-b-0">
      <component :is="bottomSheetComponent" />
    </v-card>
  </v-bottom-sheet>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useAppStore } from '@/store';

const appStore = useAppStore();
const { bottomSheetProps, bottomSheetComponent } = storeToRefs(appStore);

const model = computed({
  get: () => !!bottomSheetComponent.value,
  set: (value: boolean) => {
    if (value) {
      return;
    }

    bottomSheetProps.value = undefined;
    bottomSheetComponent.value = undefined;
  },
});
</script>
