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
      @blur="v$.name.$validate"
      :error-messages="getErrorMessage(v$.name)"
    />

    <template #action>{{ translate('form.submit') }}</template>
  </v-base-dialog>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

import { getErrorMessage, usePageLocale, useVuelidate } from '@/composables';
import { ICreateRoleRequest } from '@/interfaces';
import { maxLength, required } from '@/validators';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'submit', value: ICreateRoleRequest): void;
}>();

const { translate, pathFormField, translateFormField } = usePageLocale({
  prefix: 'dashboard.users.roles.create',
});

const form = reactive<ICreateRoleRequest>({
  name: '',
});

const [v$, { handleSubmit, submitable }] = useVuelidate(
  {
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
  form.name = '';

  v$.value.$reset();
}
</script>
