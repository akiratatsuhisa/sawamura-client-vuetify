<template>
  <v-base-dialog
    mobile-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Room</template>

    <span>Delete this room</span>

    <template #action>Delete</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { required } from '@vuelidate/validators';
import { inject, reactive } from 'vue';

import { useVuelidate } from '@/composables';
import { KEYS } from '@/constants';
import { IDeleteRoomRequest } from '@/interfaces';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IDeleteRoomRequest): void;
}>();

const room = inject(KEYS.CHAT.ROOM)!;

const form = reactive<IDeleteRoomRequest>({
  id: '',
});

const [v$, { handleSubmit }] = useVuelidate(
  {
    id: {
      required: required,
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
