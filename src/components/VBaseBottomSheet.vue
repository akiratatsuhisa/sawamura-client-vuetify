<template>
  <slot name="activator" :props="{ onClick }" />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';

import { useAppStore } from '@/store';

const props = withDefaults(defineProps<{ closeOnContentClick?: boolean }>(), {
  closeOnContentClick: true,
});

const slots = defineSlots<{
  default(): any;
  activator(props: { props: { onClick(): void } }): any;
}>();

const appStore = useAppStore();
const { bottomSheetProps, bottomSheetComponent } = storeToRefs(appStore);

function onClick() {
  bottomSheetProps.value = props;
  bottomSheetComponent.value = slots.default;
}
</script>
