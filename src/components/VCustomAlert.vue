<template>
  <v-dialog
    v-model="dialog"
    width="auto"
    :persistent="persistent"
    min-width="250"
    max-width="400"
  >
    <v-card tag="form" class="rounded-xl" @submit.prevent="onSubmit">
      <v-card-text v-if="props.message">
        <div v-if="props.icon" class="text-center pa-3">
          <v-icon :color="props.icon.color" size="64">
            {{ props.icon.name }}
          </v-icon>
        </div>
        <v-img
          class="elevation-4 rounded-lg mb-3"
          v-else-if="props.image"
          cover
          :aspect-ratio="props.image.ratio"
          :src="props.image.url"
          :alt="props.image.alt"
        ></v-img>

        <div>{{ props.message }}</div>
      </v-card-text>
      <v-card-text v-else-if="props.comp">
        <component :is="props.comp" />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          v-if="cancelButton?.show"
          color="primary"
          type="submit"
          value="cancel"
        >
          {{ cancelButton?.text ?? 'cancel' }}
        </v-btn>
        <v-btn
          v-if="denyButton?.show"
          color="primary"
          type="submit"
          value="deny"
        >
          {{ denyButton?.text ?? 'deny' }}
        </v-btn>
        <v-btn
          v-if="confirmButton?.show"
          color="primary"
          type="submit"
          value="confirm"
        >
          {{ confirmButton?.text ?? 'confirm' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { AlertProps, AlertResult } from '@/composables';

const props = withDefaults(defineProps<AlertProps>(), {
  persistent: true,
  confirmButton: () => ({ show: true }),
});
const emit = defineEmits<{
  (event: 'submit', payload: AlertResult): void;
  (event: 'exception', payload?: any): void;
}>();

const route = useRoute();

const dialog = ref(true);
const isExceptionThrow = ref(false);

const action = ref('cancel');
const formData = ref<FormData>();

function onSubmit(event: SubmitEvent) {
  action.value = (event.submitter as HTMLButtonElement).value;
  formData.value = new FormData(event.target as HTMLFormElement);
  dialog.value = false;
}

watch(
  () => route.fullPath,
  () => {
    if (!dialog.value) {
      return;
    }

    isExceptionThrow.value = true;
    dialog.value = false;
    emit('exception');
  },
);

watch(dialog, (dialog) => {
  if (dialog || isExceptionThrow.value) {
    return;
  }

  setTimeout(() => {
    emit('submit', {
      isCancel: action.value === 'cancel',
      isConfirm: action.value === 'confirm',
      isDeny: action.value === 'deny',
      formData: action.value === 'confirm' ? formData.value : undefined,
    });
  }, 250);
});
</script>
