<template>
  <v-base-dialog
    mobile-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="!submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Room</template>

    <v-text-field
      class="mt-3"
      label="Room name"
      v-model="v$.name.$model"
      :error-messages="getErrorMessage(v$.name)"
      @blur="v$.name.$validate"
    ></v-text-field>

    <template #action>Edit</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { maxLength, required } from '@vuelidate/validators';
import { inject, reactive } from 'vue';

import { getErrorMessage, useVuelidate } from '@/composables';
import { KEYS } from '@/constants';
import { IUpdateRoomRequest } from '@/interfaces';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IUpdateRoomRequest): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const form = reactive<IUpdateRoomRequest>({
  id: '',
  name: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  {
    id: {
      required: required,
    },
    name: {
      required,
      maxLength: maxLength(255),
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
