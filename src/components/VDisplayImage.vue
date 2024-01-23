<template>
  <v-overlay
    :model-value="!!model"
    class="align-center justify-center"
    persistent
  >
    <v-btn
      position="absolute"
      icon="mdi-close"
      location="top right"
      size="x-small"
      variant="flat"
      class="ma-2"
      @click="model = undefined"
    />

    <div class="wrapper-image" @click="model = undefined">
      <v-img :src="model" />
    </div>
  </v-overlay>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{ modelValue: string | undefined }>();
const emit = defineEmits<{
  (event: 'update:modelValue', payload: string | undefined): void;
}>();

const model = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<style lang="scss" scoped>
.wrapper-image {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 4.5rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 1.5rem;
  height: 100dvh;
  width: 100dvw;
}
</style>
