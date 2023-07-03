<template>
  <v-snackbar v-model="snackbar" v-bind="props">
    <template v-if="typeof content === 'string'">
      {{ content }}
    </template>
    <template v-else>
      <component :is="content" />
    </template>

    <template v-if="typeof content === 'string'" #actions>
      <v-btn variant="text" color="on-primary" @click="onClose">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

import { SnackbarProps } from '@/composables';

const props = defineProps<SnackbarProps>();
const emit = defineEmits<{
  (event: 'close', payload?: any): void;
}>();

const snackbar = ref(true);

function onClose() {
  snackbar.value = false;
}

watch(snackbar, (snackbar) => {
  if (snackbar) {
    return;
  }

  setTimeout(() => {
    emit('close');
  }, 250);
});
</script>
