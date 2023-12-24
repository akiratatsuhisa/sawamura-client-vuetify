<template>
  <v-fade-transition>
    <slot />
  </v-fade-transition>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { onBeforeMount, onBeforeUnmount } from 'vue';

import { useAppStore } from '@/store';

const slots = defineSlots<{
  default(): any;
  rail(): any;
}>();

const appStore = useAppStore();
const { navigationRailFabComponent } = storeToRefs(appStore);

onBeforeMount(() => {
  navigationRailFabComponent.value = slots.rail;
});

onBeforeUnmount(() => {
  navigationRailFabComponent.value = undefined;
});
</script>
