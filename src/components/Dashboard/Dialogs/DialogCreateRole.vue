<template>
  <v-base-dialog
    mobile-width="500"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :disabled-submit="!submitable"
    @submit="onSubmit"
    @open="onOpen"
  >
    <template #title>Role</template>

    <v-text-field
      class="mt-3"
      label="Role name"
      v-model="v$.name.$model"
      :error-messages="getErrorMessage(v$.name)"
      @blur="v$.name.$validate"
    ></v-text-field>

    <template #action>Create</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { maxLength, required } from '@vuelidate/validators';
import { reactive } from 'vue';

import { getErrorMessage, useVuelidate } from '@/composables';
import { ICreateRoleRequest, IRoleResponse } from '@/interfaces';

defineProps<{
  modelValue: boolean;
  value?: IRoleResponse;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: ICreateRoleRequest): void;
}>();

const form = reactive<ICreateRoleRequest>({
  name: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  {
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
  form.name = '';

  v$.value.$reset();
}
</script>
