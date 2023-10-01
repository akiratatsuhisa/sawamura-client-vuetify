<template>
  <slot name="activator" :props="{ onClick }" />
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSlots } from 'vue';

import { useAppStore } from '@/store';

const props = withDefaults(defineProps<{ closeOnContentClick?: boolean }>(), {
  closeOnContentClick: true,
});

const slots = useSlots();

const appStore = useAppStore();
const { bottomSheetProps, bottomSheetComponent } = storeToRefs(appStore);

function onClick() {
  bottomSheetProps.value = props;
  bottomSheetComponent.value = slots.default;
}
</script>
