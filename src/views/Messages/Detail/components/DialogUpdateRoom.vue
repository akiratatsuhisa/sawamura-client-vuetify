<template>
  <v-base-dialog
    desktop-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="!submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translate('title') }}</template>

    <v-text-field
      class="mt-3"
      :label="translateFormField('name')"
      v-model="v$.name.$model"
      :error-messages="getErrorMessage(v$.name)"
      @blur="v$.name.$validate"
    />

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { inject, reactive } from 'vue';

import { getErrorMessage, usePageLocale, useVuelidate } from '@/composables';
import { KEYS } from '@/constants';
import { IUpdateRoomRequest } from '@/interfaces';
import { maxLength, required } from '@/validators';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IUpdateRoomRequest): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const { translate, translateFormField, pathFormField } = usePageLocale({
  prefix: 'messages.room.dialogs.editName',
});

const form = reactive<IUpdateRoomRequest>({
  id: '',
  name: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  {
    id: {
      required: required(pathFormField('id')),
    },
    name: {
      required: required(pathFormField('name')),
      maxLength: maxLength(pathFormField('name'), 255),
    },
  },
  form,
);

const onSubmit = handleSubmit((data) => {
  emit('submit', data);
  emit('update:modelValue', false);
});

function onOpen() {
  form.id = room.value?.id ?? '';
  form.name = room.value?.name ?? '';

  v$.value.$reset();
}
</script>
