<template>
  <v-base-dialog
    mobile-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Role</template>

    <span>Delete this role: {{ value?.name }}</span>

    <template #action>Delete</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { required } from '@vuelidate/validators';
import { reactive } from 'vue';

import { useVuelidate } from '@/composables/useVuelidate';
import { IDeleteRoleRequest, IRoleResponse } from '@/interfaces/roles';

const props = defineProps<{
  modelValue: boolean;
  value?: IRoleResponse;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: IDeleteRoleRequest): void;
}>();

const form = reactive<IDeleteRoleRequest>({
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
  form.id = props.value?.id ?? '';

  v$.value.$reset();
}
</script>
