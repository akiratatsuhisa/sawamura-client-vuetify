<template>
  <v-dialog
    :width="fullscreen ? undefined : desktopWidth"
    :fullscreen="fullscreen"
    :close-on-back="false"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot :fullscreen="fullscreen" :close="close" />
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
  modelValue: boolean;
  fullscreen?: boolean;
  disabledSubmit?: boolean;
  desktopWidth?: number | string;
  contentClass?: any;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'open'): void;
  (event: 'close'): void;
}>();

defineSlots<{
  default(props: { fullscreen: boolean; close(): void }): any;
}>();

const display = useDisplay();
const fullscreen = computed(() => props.fullscreen || display.smAndDown.value);

function close() {
  emit('update:modelValue', false);
}

watch(
  () => props.modelValue,
  (current) => {
    if (current) {
      emit('open');
    } else {
      emit('close');
    }
  },
  { immediate: true },
);
</script>
