<template>
  <v-base-dialog
    desktop-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>{{ translate('title') }}</template>

    <span>{{ translate('message') }}</span>

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { inject, reactive } from 'vue';

import { usePageLocale, useVuelidate } from '@/composables';
import { KEYS } from '@/constants';
import { IDeleteRoomRequest } from '@/interfaces';
import { required } from '@/validators';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IDeleteRoomRequest): void;
}>();

const { translate, pathFormField } = usePageLocale({
  prefix: 'messages.room.dialogs.deleteChat',
});

const room = inject(KEYS.CHAT.ROOM)!;

const form = reactive<IDeleteRoomRequest>({
  id: '',
});

const [v$, { handleSubmit }] = useVuelidate(
  {
    id: {
      required: required(pathFormField('id')),
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

  v$.value.$reset();
}
</script>
