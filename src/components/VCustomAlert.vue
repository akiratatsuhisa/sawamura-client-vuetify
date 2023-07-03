<template>
  <v-dialog
    v-model="dialog"
    width="auto"
    persistent
    min-width="250"
    max-width="400"
  >
    <v-card tag="form" @submit.prevent="onSubmit">
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
import { ref } from 'vue';

import { AlertProps, AlertResult } from '@/composables';

const props = defineProps<AlertProps>();
const emit = defineEmits<{ (event: 'submit', payload: AlertResult): void }>();

const dialog = ref(true);

function onSubmit(event: SubmitEvent) {
  dialog.value = false;
  const action = (event.submitter as HTMLButtonElement).value;
  const formData = new FormData(event.target as HTMLFormElement);

  setTimeout(() => {
    emit('submit', {
      isCancel: action === 'cancel',
      isConfirm: action === 'confirm',
      isDeny: action === 'deny',
      formData: action === 'confirm' ? formData : undefined,
    });
  }, 250);
}
</script>
