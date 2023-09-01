<template>
  <v-dialog
    :width="fullscreen ? undefined : mobileWidth"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :fullscreen="fullscreen"
  >
    <v-card
      tag="form"
      :rounded="fullscreen ? '0' : 'xl'"
      @submit.prevent="emit('submit')"
      :class="[
        fullscreen ? 'bg-surface' : 'bg-surface-container-high',
        'text-on-surface',
      ]"
    >
      <v-toolbar
        :class="[
          fullscreen ? 'bg-surface' : 'bg-surface-container-high',
          'text-on-surface',
        ]"
      >
        <v-app-bar-nav-icon
          :icon="fullscreen ? 'mdi-arrow-left' : 'mdi-close'"
          @click="emit('update:modelValue', false)"
        >
        </v-app-bar-nav-icon>

        <v-toolbar-title>
          <slot name="title"></slot>
        </v-toolbar-title>
      </v-toolbar>

      <v-divider />

      <v-card-text
        class="overflow-y-auto"
        :class="contentClass?.(fullscreen) ?? contentClass"
      >
        <slot></slot>
      </v-card-text>

      <v-card-actions class="px-6 justify-end">
        <v-btn
          type="submit"
          color="primary"
          :variant="fullscreen ? 'elevated' : 'text'"
          :block="fullscreen"
          :disabled="disabledSubmit"
        >
          <slot name="action"></slot>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { useDisplay } from 'vuetify';

const props = defineProps<{
  modelValue: boolean;
  fullscreen?: boolean;
  disabledSubmit?: boolean;
  mobileWidth?: number | string;
  contentClass?: any;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit'): void;
  (event: 'open'): void;
  (event: 'close'): void;
}>();

const display = useDisplay();

const fullscreen = computed(() => props.fullscreen || display.smAndDown.value);

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
